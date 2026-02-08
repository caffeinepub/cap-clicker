import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useEffect, useRef } from 'react';

interface SmoothScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper around ScrollArea that adds smooth wheel/trackpad scrolling
 * via requestAnimationFrame interpolation while preserving keyboard navigation.
 * Respects prefers-reduced-motion preference.
 */
export function SmoothScrollArea({ children, className }: SmoothScrollAreaProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const targetScrollTop = useRef(0);
  const currentScrollTop = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || prefersReducedMotion) return;

    // Initialize refs with current scroll position
    currentScrollTop.current = viewport.scrollTop;
    targetScrollTop.current = viewport.scrollTop;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Update target scroll position
      targetScrollTop.current = Math.max(
        0,
        Math.min(
          viewport.scrollHeight - viewport.clientHeight,
          targetScrollTop.current + e.deltaY
        )
      );

      // Start animation if not already running
      if (animationFrameId.current === null) {
        animateScroll();
      }
    };

    const animateScroll = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      // Lerp factor for smooth interpolation (0.15 = smooth, higher = faster)
      const lerpFactor = 0.15;
      const diff = targetScrollTop.current - currentScrollTop.current;

      // If we're close enough, snap to target and stop animating
      if (Math.abs(diff) < 0.5) {
        currentScrollTop.current = targetScrollTop.current;
        viewport.scrollTop = targetScrollTop.current;
        animationFrameId.current = null;
        return;
      }

      // Interpolate towards target
      currentScrollTop.current += diff * lerpFactor;
      viewport.scrollTop = currentScrollTop.current;

      // Continue animation
      animationFrameId.current = requestAnimationFrame(animateScroll);
    };

    // Add wheel listener with passive: false to allow preventDefault
    viewport.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <ScrollArea className={className}>
      <div ref={viewportRef} className="h-full overflow-auto scrollbar-warm">
        {children}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}
