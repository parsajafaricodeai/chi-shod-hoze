import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Error initializing Gemini client:', e);
    }
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGemini: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

/**
 * Helper to convert numbers to Persian digits
 */
function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

/**
 * POST /api/parse-video
 * Automatically extracts, parses, and enriches all episode/clip metadata from any video link
 */
app.post('/api/parse-video', async (req, res) => {
  try {
    const { url, rawText, type = 'episode' } = req.body || {};
    const videoUrl = String(url || '').trim();

    if (!videoUrl && !rawText) {
      return res.status(400).json({
        success: false,
        error: 'لطفاً پیوند ویدیو یا متن را وارد کنید.',
      });
    }

    // 1. Check for Aparat
    const aparatMatch = videoUrl.match(/(?:aparat\.com\/(?:v\/|video\/video\/embed\/videohash\/))([a-zA-Z0-9_-]+)/i);
    let aparatData: any = null;
    let embedUrl = videoUrl;
    let canonicalUrl = videoUrl;
    let posterImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80';
    let durationPersian = '۴۵ دقیقه';
    let rawTitle = '';
    let rawDesc = '';
    let rawSender = '';
    let rawTags: string[] = [];

    if (aparatMatch && aparatMatch[1]) {
      const hash = aparatMatch[1];
      canonicalUrl = `https://www.aparat.com/v/${hash}`;
      embedUrl = `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const apRes = await fetch(`https://www.aparat.com/etc/api/video/videohash/${hash}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (apRes.ok) {
          const json = await apRes.json();
          const v = json.video;
          if (v) {
            aparatData = v;
            rawTitle = v.title || '';
            rawDesc = v.description || '';
            rawSender = v.sender_name || '';
            if (v.big_poster || v.small_poster) {
              posterImage = v.big_poster || v.small_poster;
            }
            if (v.duration) {
              const mins = Math.round(Number(v.duration) / 60);
              durationPersian = `${toPersianDigits(mins || 45)} دقیقه`;
            }
            if (Array.isArray(v.tags)) {
              rawTags = v.tags;
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch Aparat API, continuing with URL analysis:', err);
      }
    }

    // 2. Check for YouTube
    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const ytid = ytMatch[1];
      canonicalUrl = `https://www.youtube.com/watch?v=${ytid}`;
      embedUrl = `https://www.youtube.com/embed/${ytid}?autoplay=1&rel=0`;
      posterImage = `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const ytRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (ytRes.ok) {
          const yData = await ytRes.json();
          rawTitle = yData.title || '';
          rawSender = yData.author_name || '';
        }
      } catch (err) {
        console.warn('YouTube oEmbed fetch error:', err);
      }

      // Extract exact description from YouTube page meta tags
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 3500);
        const htmlRes = await fetch(canonicalUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept-Language': 'fa,en;q=0.9',
          },
          signal: controller2.signal,
        });
        clearTimeout(timeoutId2);
        if (htmlRes.ok) {
          const html = await htmlRes.text();
          const descMatch =
            html.match(/<meta\s+(?:name|property)="(?:\w+:)?description"\s+content="([^"]*)"/i) ||
            html.match(/content="([^"]*)"\s+(?:name|property)="(?:\w+:)?description"/i);
          if (descMatch && descMatch[1]) {
            rawDesc = descMatch[1]
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, '&');
          }
        }
      } catch (err) {
        console.warn('YouTube description scraping error:', err);
      }
    }

    // 3. AI structuring with Gemini if available
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `
شما مسئول ثبت و تنظیم اطلاعات رسانه گفت‌وگومحور و مستند «چی شد حوزه؟» هستید.
شعار برنامه: «روایت آدم‌هایی که این مسیر را زندگی کرده‌اند.»

اطلاعات ویدیوی دریافتی:
- لینک ویدیو: ${videoUrl}
- عنوان ویدیو در آپارات/یوتیوب: ${rawTitle || 'نامشخص'}
- توضیحات واقعی ویدیو در آپارات/یوتیوب: ${rawDesc || 'ندارد'}
- نام کانال/فرستنده: ${rawSender || 'نامشخص'}
- برچسب‌های خام: ${rawTags.join('، ') || 'نامشخص'}
- متن یا یادداشت الحاقی کاربر: ${rawText || 'ندارد'}
- نوع مدیا درخواستی: ${type === 'clip' ? 'کلیپ کوتاه عمودی (Clip)' : 'قسمت کامل برنامه (Episode)'}

دستور بسیار مهم برای دیسکریپشن (توضیحات):
- اگر توضیحات واقعی ویدیو (توضیحات بالا) موجود است، دقیقاً همان متن توضیحات ویدیو را در فیلد "description" قرار دهید و از خودتان هیچ متن جدید، تلخیص یا توصیف جعلی نسازید.
- اگر توضیحات ویدیو خالی بود، فقط در آن صورت یک چکیده واقعی و مرتبط بنویسید.

لطفاً یک خروجی JSON کاملاً معتبر و تمیز به زبان فارسی برگردانید:

اگر type برابر با "episode" است:
{
  "title": "${rawTitle ? rawTitle.replace(/"/g, '') : 'عنوان گفتگو'}",
  "guest": "نام کامل مهمان (مثلاً: حجت‌الاسلام دکتر ...)",
  "guestRole": "سمت، عنوان علمی یا تخصص مهمان",
  "duration": "${durationPersian}",
  "description": ${JSON.stringify(rawDesc || 'روایت صریح و شنیدنی از تجربیات زیسته در حوزه علمیه.')},
  "topics": ["موضوع ۱", "موضوع ۲", "موضوع ۳", "موضوع ۴"],
  "quote": "یک جمله برجسته و تکان‌دهنده از زبان مهمان در قالب «...»",
  "takeaways": [
    "نکته کلیدی اول",
    "نکته کلیدی دوم",
    "نکته کلیدی سوم"
  ],
  "category": "یکی از موارد دقیقاً: scholars یا managers یا figures یا special",
  "highlightCategory": "یکی از موارد: تصورات اولیه / چالش‌ها / نگاه به گذشته / حقایق پنهان / تجربه زیسته"
}

اگر type برابر با "clip" است:
{
  "title": "${rawTitle ? rawTitle.replace(/"/g, '') : 'عنوان کلیپ'}",
  "guest": "نام مهمان",
  "guestRole": "سمت یا تخصص",
  "duration": "۱:۲۰",
  "description": ${JSON.stringify(rawDesc || '')},
  "highlightCategory": "یکی از موارد: تصورات اولیه / چالش‌ها / نگاه به گذشته / حقایق پنهان / تجربه زیسته"
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          // Always ensure the exact video description from Aparat/YouTube is preserved
          const exactDescription =
            rawDesc && rawDesc.trim().length > 0
              ? rawDesc.trim()
              : (parsed.description && parsed.description.trim().length > 0
                  ? parsed.description.trim()
                  : 'روایتی از برنامه گفت‌وگومحور «چی شد حوزه؟»');

          return res.json({
            success: true,
            source: 'gemini',
            data: {
              ...parsed,
              description: exactDescription,
              videoUrl: canonicalUrl,
              embedUrl,
              thumbnail: posterImage,
              guestAvatar: posterImage,
            },
          });
        }
      } catch (geminiError) {
        console.warn('Gemini extraction failed, using heuristic parser:', geminiError);
      }
    }

    // 4. Smart Heuristic Fallback (Never fails)
    let extractedGuest = rawSender || 'حجت‌الاسلام و المسلمین';
    let extractedTitle = rawTitle || 'گفتگوی صریح و بدون روتوش «چی شد حوزه؟»';

    // Try extracting guest name from title if has separators like | or - or :
    if (extractedTitle.includes('|') || extractedTitle.includes('-') || extractedTitle.includes(':')) {
      const parts = extractedTitle.split(/[|\-:]/).map((p) => p.trim());
      if (parts.length > 1) {
        if (parts[0].includes('حجت') || parts[0].includes('دکتر') || parts[0].includes('استاد')) {
          extractedGuest = parts[0];
          extractedTitle = parts.slice(1).join(' - ');
        } else if (parts[1].includes('حجت') || parts[1].includes('دکتر') || parts[1].includes('استاد')) {
          extractedGuest = parts[1];
          extractedTitle = parts[0];
        }
      }
    }

    const exactDescription =
      rawDesc && rawDesc.trim().length > 0
        ? rawDesc.trim()
        : 'روایتی از برنامه گفت‌وگومحور «چی شد حوزه؟»';

    const fallbackData = {
      title: extractedTitle,
      guest: extractedGuest,
      guestRole: 'مهمان و راوی برنامه «چی شد حوزه؟»',
      duration: durationPersian,
      description: exactDescription,
      topics: rawTags.length > 0 ? rawTags.slice(0, 4) : ['روایت طلبگی', 'تجربه زیسته', 'چالش‌های مسیر', 'گفتگوی صریح'],
      quote: `«${extractedTitle}؛ روایتی از حقیقت مسیری که کمتر شنیده شده است.»`,
      takeaways: [
        'انگیزه‌های ورود و مقایسه آن با واقعیت‌های موجود',
        'نقش خانواده و واکنش اطرافیان در پذیرش تصمیم',
        'توصیه‌های عملی به جوانان در آستانه انتخاب مسیر',
      ],
      category: 'scholars',
      highlightCategory: 'تجربه زیسته',
      videoUrl: canonicalUrl,
      embedUrl,
      thumbnail: posterImage,
      guestAvatar: posterImage,
    };

    return res.json({
      success: true,
      source: 'heuristic',
      data: fallbackData,
    });
  } catch (error: any) {
    console.error('API /api/parse-video error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'خطا در پردازش و استخراج ویدیو',
    });
  }
});

// Start the server with Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
