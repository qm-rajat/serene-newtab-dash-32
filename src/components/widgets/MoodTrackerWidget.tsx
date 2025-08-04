import { useState, useEffect } from 'react';
import { Heart, Smile, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale
  emoji: string;
  note?: string;
}

const moodEmojis = [
  { value: 1, emoji: '😞', label: 'Sad' },
  { value: 2, emoji: '😕', label: 'Disappointed' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '😊', label: 'Happy' },
  { value: 5, emoji: '😄', label: 'Great' }
];

export const MoodTrackerWidget = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('moodTracker');
    if (saved) {
      const savedMoods = JSON.parse(saved);
      setMoods(savedMoods);
      
      // Check if mood for today exists
      const today = new Date().toDateString();
      const todayEntry = savedMoods.find((entry: MoodEntry) => 
        new Date(entry.date).toDateString() === today
      );
      if (todayEntry) {
        setTodayMood(todayEntry);
        setSelectedMood(todayEntry.mood);
      }
    }
  }, []);

  const saveMood = (moodValue: number) => {
    const today = new Date().toDateString();
    const moodEmoji = moodEmojis.find(m => m.value === moodValue);
    
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: moodValue,
      emoji: moodEmoji?.emoji || '😐'
    };

    // Remove existing entry for today if any
    const filteredMoods = moods.filter(entry => 
      new Date(entry.date).toDateString() !== today
    );
    
    const updatedMoods = [newEntry, ...filteredMoods];
    setMoods(updatedMoods);
    setTodayMood(newEntry);
    setSelectedMood(moodValue);
    
    localStorage.setItem('moodTracker', JSON.stringify(updatedMoods));
  };

  const getAverageMood = () => {
    if (moods.length === 0) return 0;
    const sum = moods.reduce((acc, mood) => acc + mood.mood, 0);
    return (sum / moods.length).toFixed(1);
  };

  const getRecentMoods = () => {
    return moods.slice(0, 7); // Last 7 entries
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-neon-accent/20">
          <Heart className="w-5 h-5 text-neon-accent" />
        </div>
        <h3 className="font-semibold text-card-foreground">Mood Tracker</h3>
      </div>
      
      <div className="space-y-4">
        {/* Today's Mood */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">How are you feeling today?</p>
          <div className="flex justify-center space-x-2 mb-3">
            {moodEmojis.map((mood) => (
              <Button
                key={mood.value}
                variant="ghost"
                size="sm"
                onClick={() => saveMood(mood.value)}
                className={`p-2 text-2xl hover:scale-110 transition-transform ${
                  selectedMood === mood.value ? 'bg-primary/20 scale-110' : ''
                }`}
                title={mood.label}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
          
          {todayMood && (
            <div className="text-center">
              <span className="text-3xl">{todayMood.emoji}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {moodEmojis.find(m => m.value === todayMood.mood)?.label}
              </p>
            </div>
          )}
        </div>
        
        {/* Stats */}
        {moods.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average:</span>
              <span className="text-card-foreground font-medium">{getAverageMood()}/5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entries:</span>
              <span className="text-card-foreground font-medium">{moods.length}</span>
            </div>
          </div>
        )}
        
        {/* Recent Moods */}
        {moods.length > 1 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Recent moods:</p>
            <div className="flex space-x-1 justify-center">
              {getRecentMoods().map((mood, index) => (
                <span
                  key={index}
                  className="text-lg opacity-80 hover:opacity-100 transition-opacity"
                  title={new Date(mood.date).toLocaleDateString()}
                >
                  {mood.emoji}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};