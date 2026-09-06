import { clientSideAutoExtract, parseVideoUrl } from '../utils/videoUtils';

export interface ParsedVideoResult {
  title: string;
  guest: string;
  guestRole: string;
  guestAvatar: string;
  thumbnail: string;
  duration: string;
  description: string;
  topics: string[];
  quote: string;
  takeaways: string[];
  category: 'scholars' | 'managers' | 'figures' | 'special';
  highlightCategory?: string;
  videoUrl: string;
  embedUrl: string;
  source?: string;
}

export async function fetchVideoAutoInfo(
  url: string,
  rawText?: string,
  type: 'episode' | 'clip' = 'episode'
): Promise<ParsedVideoResult> {
  const cleanUrl = (url || '').trim();

  try {
    const res = await fetch('/api/parse-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: cleanUrl,
        rawText,
        type,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend parse-video API failed, using client fallback:', err);
  }

  // Fallback to client-side extraction
  const fallback = await clientSideAutoExtract(cleanUrl);
  return {
    title: fallback.title || 'گفتگوی اختصاصی «چی شد حوزه؟»',
    guest: fallback.guest || 'حجت‌الاسلام و المسلمین',
    guestRole: fallback.guestRole || 'مهمان برنامه',
    guestAvatar: fallback.thumbnail,
    thumbnail: fallback.thumbnail,
    duration: fallback.duration || '۴۵ دقیقه',
    description: fallback.description || '',
    topics: fallback.topics || ['روایت طلبگی', 'تجربه زیسته'],
    quote: fallback.quote || '«روایتی از حقیقت مسیری که زندگی کرده‌ایم.»',
    takeaways: fallback.takeaways || ['درس‌آموخته‌های زیست حوزوی'],
    category: fallback.category || 'scholars',
    highlightCategory: fallback.highlightCategory || 'تجربه زیسته',
    videoUrl: fallback.videoUrl,
    embedUrl: fallback.embedUrl,
    source: 'client-fallback',
  };
}
