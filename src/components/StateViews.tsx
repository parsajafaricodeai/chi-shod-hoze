import React from 'react';
import { AlertCircle, FileQuestion, RefreshCw } from 'lucide-react';

export const SkeletonEpisodeCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 animate-pulse">
      <div className="aspect-16/9 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="h-3 bg-stone-200 rounded w-2/3" />
        <div className="pt-3 border-t border-stone-100 flex justify-between">
          <div className="h-3 bg-stone-200 rounded w-16" />
          <div className="h-3 bg-stone-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ message?: string; actionLabel?: string; onAction?: () => void }> = ({
  message = 'هنوز روایتی برای این بخش منتشر نشده.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1B3B2B]/5 flex items-center justify-center text-[#1B3B2B] mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-[#12281D] mb-2">{message}</h4>
      <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
        قسمت‌ها و مصاحبه‌های جدید این دسته به زودی پس از تدوین نهایی در این بخش قرار خواهد گرفت.
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#1B3B2B] text-white text-xs font-bold hover:bg-[#234F3A] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-[#12281D] mb-1">
        مشکلی در بارگذاری محتوا پیش آمد.
      </h4>
      <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
        لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش فرمایید.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B3B2B] text-white text-xs font-bold hover:bg-[#234F3A] transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تلاش دوباره</span>
        </button>
      )}
    </div>
  );
};
