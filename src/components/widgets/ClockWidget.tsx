import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-card-foreground">Current Time</h3>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2 font-mono">
          {formatTime(time)}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
};