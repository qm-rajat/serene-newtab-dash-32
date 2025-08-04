import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PomodoroWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(isBreak ? 'Break time is over!' : 'Pomodoro session complete!');
      }
      // Switch between work and break
      if (isBreak) {
        setTimeLeft(25 * 60); // Work session
        setIsBreak(false);
      } else {
        setTimeLeft(5 * 60); // Break session
        setIsBreak(true);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isBreak]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/20">
          <Timer className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-semibold text-card-foreground">Pomodoro</h3>
      </div>
      
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100, 100"
              className="text-muted/30"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              className={isBreak ? "text-success" : "text-accent"}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-card-foreground font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          {isBreak ? '☕ Break Time' : '🍅 Focus Time'}
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button
            onClick={toggleTimer}
            size="sm"
            className={isActive ? "bg-warning hover:bg-warning/80" : "bg-success hover:bg-success/80"}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="sm"
            className="border-glass-border hover:bg-secondary/50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};