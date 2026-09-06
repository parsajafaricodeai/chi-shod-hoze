/**
 * Universal video utility for Aparat, YouTube, Direct MP4, and Eitaa URLs
 */

export interface VideoInfo {
  type: 'aparat' | 'youtube' | 'direct' | 'eitaa' | 'generic';
  id?: string;
  embedUrl: string;
  canonicalUrl: string;
  thumbnailUrl?: string;
  isEmbeddable: boolean;
}

export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function formatDurationToPersian(secondsOrStr: number | string): string {
  if (typeof secondsOrStr === 'string' && secondsOrStr.includes('دقیقه')) {
    return secondsOrStr;
  }
  const secs = typeof secondsOrStr === 'number' ? secondsOrStr : parseInt(String(secondsOrStr), 10);
  if (isNaN(secs) || secs <= 0) return '۴۵ دقیقه';

  const mins = Math.round(secs / 60);
  return `${toPersianDigits(mins)} دقیقه`;
}

export function parseVideoUrl(rawUrl: string): VideoInfo {
  const url = (rawUrl || '').trim();

  // 1. Check if user pasted an iframe embed code (common from Aparat or YouTube)
  if (url.includes('<iframe') && url.includes('src="')) {
    const srcMatch = url.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return parseVideoUrl(srcMatch[1]);
    }
  }

  // 2. Aparat detection
  // Matches:
  // https://www.aparat.com/v/XXXXX
  // https://aparat.com/v/XXXXX
  // https://www.aparat.com/video/video/embed/videohash/XXXXX/vt/frame
  // aparat.com/v/XXXXX
  const aparatRegex = /(?:aparat\.com\/(?:v\/|video\/video\/embed\/videohash\/))([a-zA-Z0-9_-]+)/i;
  const aparatMatch = url.match(aparatRegex);
  if (aparatMatch && aparatMatch[1]) {
    const hash = aparatMatch[1];
    return {
      type: 'aparat',
      id: hash,
      embedUrl: `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`,
      canonicalUrl: `https://www.aparat.com/v/${hash}`,
      isEmbeddable: true,
    };
  }

  // 3. YouTube detection
  // Matches:
  // https://www.youtube.com/watch?v=XXXXX
  // https://youtu.be/XXXXX
  // https://www.youtube.com/embed/XXXXX
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      isEmbeddable: true,
    };
  }

  // 4. Direct video file (.mp4, .webm, .ogg, gtv-videos-bucket, etc.)
  const isDirectVideo =
    /\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i.test(url) ||
    url.includes('gtv-videos-bucket') ||
    url.includes('sample-videos') ||
    url.startsWith('blob:');

  if (isDirectVideo) {
    return {
      type: 'direct',
      embedUrl: url,
      canonicalUrl: url,
      isEmbeddable: false, // will use HTML5 <video>
    };
  }

  // 5. Eitaa link
  if (url.includes('eitaa.com')) {
    return {
      type: 'eitaa',
      embedUrl: url,
      canonicalUrl: url,
      isEmbeddable: false,
    };
  }

  // 6. Generic web URL
  return {
    type: 'generic',
    embedUrl: url,
    canonicalUrl: url,
    isEmbeddable: false,
  };
}

/**
 * Client-side heuristic parser if offline or server is unavailable
 */
export async function clientSideAutoExtract(url: string): Promise<Record<string, any>> {
  const info = parseVideoUrl(url);

  if (info.type === 'aparat' && info.id) {
    try {
      // Aparat public video API allows retrieving video info
      const res = await fetch(`https://www.aparat.com/etc/api/video/videohash/${info.id}`);
      if (res.ok) {
        const json = await res.json();
        const v = json.video;
        if (v) {
          const durationStr = formatDurationToPersian(v.duration || 2700);
          return {
            title: v.title || 'گفتگوی ویژه «چی شد حوزه؟»',
            guest: v.sender_name || 'استاد و پژوهشگر حوزوی',
            guestRole: 'مهمان برنامه «چی شد حوزه؟»',
            description: v.description || 'روایت صریح و شنیدنی از فراز و نشیب‌های مسیر طلبگی و زیست حوزوی.',
            duration: durationStr,
            thumbnail: v.big_poster || v.small_poster || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
            videoUrl: info.canonicalUrl,
            embedUrl: info.embedUrl,
            category: 'scholars',
            topics: Array.isArray(v.tags) && v.tags.length > 0 ? v.tags.slice(0, 4) : ['روایت طلبگی', 'گفتگوی صریح', 'تجربه زیسته'],
            quote: `«${v.title || 'روایتی از دغدغه‌ها و چرایی انتخاب مسیر حوزه'}»`,
            takeaways: [
              'تحلیل واقع‌بینانه از نقاط عطف و چالش‌های مسیر',
              'بررسی انگیزه‌ها و چشم‌انداز آینده در حوزه',
              'توصیه‌های کاربردی به علاقمندان علوم دینی',
            ],
          };
        }
      }
    } catch {
      // ignore, fall through to default fallback
    }
  }

  // Fallback for YouTube or other links
  return {
    title: 'قسمت جدید برنامه «چی شد حوزه؟»',
    guest: 'حجت‌الاسلام و المسلمین',
    guestRole: 'استاد و فعال حوزوی',
    description: 'روایتی شنیدنی و صریح از چرایی انتخاب حوزه، چالش‌های ورود و تجربه زیست طلبگی.',
    duration: '۴۵ دقیقه',
    thumbnail: info.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    videoUrl: info.canonicalUrl,
    embedUrl: info.embedUrl,
    category: 'scholars',
    topics: ['تجربه زیسته', 'چالش‌های ورود به حوزه', 'دیدگاه‌ها و افق‌ها'],
    quote: '«این مسیر با همه سختی‌هایش، افقی روشن برای کشف حقیقت است.»',
    takeaways: [
      'انگیزه‌های بنیادین برای انتخاب مسیر حوزه',
      'رویارویی با تردیدها و پرسش‌های ابتدای مسیر',
      'نقش مباحثه و زیست جمعی در رشد فردی',
    ],
  };
}
