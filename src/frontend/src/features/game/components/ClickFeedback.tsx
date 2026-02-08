import { useEffect, useState } from 'react';

interface ClickFeedbackProps {
  x: number;
  y: number;
  value: number;
}

export function ClickFeedback({ x, y, value }: ClickFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      role="status"
      aria-live="polite"
      aria-label={`Plus ${formatNumber(value)} caps`}
    >
      <span className="click-feedback-text">
        +{formatNumber(value)}
      </span>
    </div>
  );
}
