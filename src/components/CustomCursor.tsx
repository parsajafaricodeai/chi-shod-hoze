import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if device has fine pointer (mouse/trackpad, not touch-only)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches);
    };
    mediaQuery.addEventListener('change', handlePointerChange);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, [role="button"], .clickable, .card-interactive');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer ring */}
      <motion.div
        className="fixed rounded-full border border-[#1B3B2B]/40 bg-[#1B3B2B]/5 pointer-events-none"
        animate={{
          x: position.x - (isHovered ? 24 : 14),
          y: position.y - (isHovered ? 24 : 14),
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          borderColor: isHovered ? '#C5A869' : 'rgba(27, 59, 43, 0.4)',
          backgroundColor: isHovered ? 'rgba(197, 168, 105, 0.12)' : 'rgba(27, 59, 43, 0.04)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      {/* Center dot */}
      <motion.div
        className="fixed rounded-full bg-[#1B3B2B] pointer-events-none"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          width: 6,
          height: 6,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 700, damping: 35 }}
      />
    </div>
  );
};
