import { useState, useEffect } from 'react';
import { StickyNote, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const NotesWidget = () => {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('stickyNotes');
    if (saved) {
      setNotes(saved);
    }
  }, []);

  const saveNotes = () => {
    localStorage.setItem('stickyNotes', notes);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      saveNotes();
    }
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-warning/20">
            <StickyNote className="w-5 h-5 text-warning" />
          </div>
          <h3 className="font-semibold text-card-foreground">Notes</h3>
        </div>
        {isEditing && (
          <Button
            onClick={saveNotes}
            size="sm"
            className="bg-success hover:bg-success/80"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setIsEditing(true);
          }}
          onKeyDown={handleKeyPress}
          placeholder="Write your notes here..."
          className="min-h-32 resize-none bg-secondary/30 border-glass-border focus:border-primary/50 text-card-foreground placeholder:text-muted-foreground"
        />
        <div className="text-xs text-muted-foreground mt-2">
          Ctrl+Enter to save • Esc to cancel
        </div>
      </div>
    </div>
  );
};