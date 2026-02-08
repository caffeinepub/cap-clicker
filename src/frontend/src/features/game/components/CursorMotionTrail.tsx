import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  opacity: number;
}

/**
 * Canvas-based cursor motion trail that renders a subtle blur effect
 * when the pointer moves quickly. Fades out when movement slows.
 * Respects prefers-reduced-motion and never blocks pointer events.
 */
export function CursorMotionTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const trailPoints = useRef<TrailPoint[]>([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastTimestamp = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      const dt = now - lastTimestamp.current;
      
      // Calculate velocity (pixels per millisecond)
      const dx = e.clientX - lastPosition.current.x;
      const dy = e.clientY - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = dt > 0 ? distance / dt : 0;

      // Only add trail points if moving fast enough (threshold: 0.5 px/ms)
      if (velocity > 0.5) {
        trailPoints.current.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: now,
          opacity: Math.min(velocity * 0.3, 1), // Scale opacity with velocity
        });

        // Limit trail length
        if (trailPoints.current.length > 20) {
          trailPoints.current.shift();
        }
      }

      lastPosition.current = { x: e.clientX, y: e.clientY };
      lastTimestamp.current = now;

      // Start animation if not already running
      if (animationFrameId.current === null) {
        animate();
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const now = Date.now();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw trail points
      trailPoints.current = trailPoints.current.filter((point) => {
        const age = now - point.timestamp;
        const maxAge = 500; // Trail fades over 500ms

        if (age > maxAge) return false;

        // Calculate fade based on age
        const ageFactor = 1 - age / maxAge;
        const opacity = point.opacity * ageFactor;

        // Draw trail point as a gradient circle
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          20
        );
        
        // Use amber/orange colors matching the theme
        gradient.addColorStop(0, `rgba(251, 191, 36, ${opacity * 0.4})`); // amber-400
        gradient.addColorStop(0.5, `rgba(249, 115, 22, ${opacity * 0.2})`); // orange-500
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Continue animation if there are still points
      if (trailPoints.current.length > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        animationFrameId.current = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas"
      aria-hidden="true"
    />
  );
}
