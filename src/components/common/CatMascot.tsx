'use client';

import { cn } from '@/lib/utils';

interface CatMascotProps {
  variant?: 'default' | 'waving' | 'floating' | 'bouncing';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
}

export function CatMascot({
  variant = 'default',
  size = 'md',
  className,
  showSpeechBubble = false,
  speechText = '喵～',
}: CatMascotProps) {
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl',
  };

  const animationClasses = {
    default: '',
    waving: 'mascot-wave',
    floating: 'mascot-float',
    bouncing: 'mascot-bounce',
  };

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      {/* 對話泡泡 */}
      {showSpeechBubble && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-card-border rounded-2xl px-4 py-2 shadow-lg whitespace-nowrap z-10">
          <span className="text-sm font-medium text-foreground">{speechText}</span>
          {/* 三角形指向 */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-card" />
        </div>
      )}

      {/* 三花貓 emoji */}
      <div className={cn(sizeClasses[size], animationClasses[variant])}>
        <span role="img" aria-label="三花貓吉祥物">🐱</span>
      </div>

      {/* 裝飾性元素 - 模擬三花貓斑點 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 橘色斑點 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full opacity-60" />
        {/* 黑色斑點 */}
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gray-800 rounded-full opacity-50" />
        {/* 白色高光 */}
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-70" />
      </div>
    </div>
  );
}

export default CatMascot;
