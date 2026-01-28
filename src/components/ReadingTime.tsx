import { Clock } from 'lucide-react';

interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  className?: string;
}

const ReadingTime = ({ content, wordsPerMinute = 200, className = '' }: ReadingTimeProps) => {
  const calculateReadingTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
  };

  const minutes = calculateReadingTime(content);

  return (
    <div className={`flex items-center gap-1.5 text-muted-foreground text-sm ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{minutes} Min. Lesezeit</span>
    </div>
  );
};

export default ReadingTime;