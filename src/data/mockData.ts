import { Episode, Guest, Clip, QuoteItem, InteractiveOption } from '../types';

/**
 * Initial empty dataset for production
 * All real content is added via Admin Panel or Quick Auto-Register with actual video links.
 */
export const EPISODES_DATA: Episode[] = [];

export const GUESTS_DATA: Guest[] = [];

export const CLIPS_DATA: Clip[] = [];

export const QUOTES_DATA: QuoteItem[] = [];

export const INTERACTIVE_OPTIONS: InteractiveOption[] = [
  {
    id: 'self-discovery',
    title: 'شناخت خودم',
    iconName: 'Compass',
    description: 'درک عمیق‌تر از معنای بودن، لایه‌های درونی روح و چرایی زیستن',
    insight: 'برای تو مسیر زندگی از یک کاوش درونی آغاز می‌شود؛ روایتی از کسی را بشنو که در اوج موفقیت ظاهری، به دنبال حقیقت درونش رفت.',
    recommendedEpisodeIds: []
  },
  {
    id: 'learning',
    title: 'یادگیری و خردورزی',
    iconName: 'BookOpen',
    description: 'کشف متون، مباحثه بی‌پایان، نظریه‌پردازی و تسلط بر ریشه‌های اندیشه',
    insight: 'شور دانستن موتور محرک توست؛ لذت درک متون کهن و ارتباط با تفکر معاصر می‌تواند الهام‌بخش انتخاب‌های آینده‌ات باشد.',
    recommendedEpisodeIds: []
  },
  {
    id: 'service',
    title: 'خدمت به مردم',
    iconName: 'HeartHandshake',
    description: 'گره‌گشایی از رنج‌های جامعه، همراهی با محرومان و حضور در میدان واقعی',
    insight: 'تو معنای زندگی را در اثرگذاری ملموس بر جامعه می‌بینی؛ تجربه کسانی که علم را پلی برای خدمت بی‌ادعا قرار دادند را از دست نده.',
    recommendedEpisodeIds: []
  },
  {
    id: 'spirituality',
    title: 'معنویت و آرامش جان',
    iconName: 'Sparkles',
    description: 'اتصال به خلوت، ارتباط با مبدأ هستی و تطهیر ذهن از شلوغی‌های روزمره',
    insight: 'در دنیای پرهیاهوی امروز، سکوت و معنویت کیمیای نایابی است؛ بشنو که سالکان این راه چگونه در دل سختی‌ها به آرامش دست یافتند.',
    recommendedEpisodeIds: []
  },
  {
    id: 'different-path',
    title: 'تجربه یک مسیر متفاوت',
    iconName: 'Flame',
    description: 'شکستن کلیشه‌ها، شنا کردن بر خلاف جریان معمول و خلق داستانی منحصربه‌فرد',
    insight: 'جرأت جسارت و ایستادن در موقعیت‌های نامتعارف شاخصه تفکر توست؛ پای صحبت کسانی بنشین که انتخابشان همه را شگفت‌زده کرد.',
    recommendedEpisodeIds: []
  }
];

export const PRODUCTION_TIMELINE = [
  {
    step: '۰۱',
    title: 'ایده و کشف سوژه',
    desc: 'شناسایی روایت‌های ناگفته و سؤال‌های بی‌پرده‌ای که در ذهن جوان امروز درباره چرایی ورود به حوزه وجود دارد.'
  },
  {
    step: '۰۲',
    title: 'گفت‌وگوی بدون روتوش',
    desc: 'نشستن صمیمی روبه‌روی مهمان در فضایی فارغ از تعارفات رسمی؛ جایی که هر کس حقیقت احساس خود را می‌گوید.'
  },
  {
    step: '۰۳',
    title: 'روایت مستند و تدوین',
    desc: 'خلق ساختاری متناسب با سلیقه مخاطب همراه با پایش مستند تجربیات زیسته.'
  },
  {
    step: '۰۴',
    title: 'انتشار و گفت‌وگوی مخاطبان',
    desc: 'پخش برنامه به همراه کلیپ‌های کوتاه در شبکه‌های اجتماعی برای ایجاد محفلی باز برای پرسشگری.'
  }
];
