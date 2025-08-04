import { X, Palette, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  enabledWidgets: Record<string, boolean>;
  onToggleWidget: (widget: string) => void;
}

const widgetLabels = {
  clock: 'Clock & Date',
  weather: 'Weather',
  todo: 'To-Do List',
  notes: 'Sticky Notes',
  quote: 'Quote of the Day',
  news: 'Latest News',
  quickLinks: 'Quick Links',
  pomodoro: 'Pomodoro Timer',
  musicPlayer: 'Music Player',
  moodTracker: 'Mood Tracker'
};

export const SettingsPanel = ({ 
  theme, 
  onThemeChange, 
  enabledWidgets, 
  onToggleWidget 
}: SettingsPanelProps) => {
  const closePanel = () => {
    const panel = document.getElementById('settings-panel');
    if (panel) {
      panel.classList.add('translate-x-full');
    }
  };

  return (
    <div
      id="settings-panel"
      className="fixed top-0 right-0 h-full w-80 glass border-l border-glass-border z-50 transform translate-x-full transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closePanel}
            className="text-muted-foreground hover:text-primary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Separator className="bg-glass-border" />

        {/* Theme Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <span>Appearance</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-card-foreground">Theme</span>
              <div className="flex space-x-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onThemeChange('light')}
                  className="text-xs"
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onThemeChange('dark')}
                  className="text-xs"
                >
                  Dark
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-glass-border" />

        {/* Widget Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Eye className="w-5 h-5 text-primary" />
            <span>Widgets</span>
          </h3>
          
          <div className="space-y-3">
            {Object.entries(widgetLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-card-foreground text-sm">{label}</span>
                <div className="flex items-center space-x-2">
                  {enabledWidgets[key] ? (
                    <Eye className="w-4 h-4 text-success" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={enabledWidgets[key]}
                    onCheckedChange={() => onToggleWidget(key)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-glass-border" />

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground">About</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Personal Dashboard v1.0</p>
            <p>A modern, customizable home page</p>
            <p className="text-xs">All data is stored locally in your browser</p>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-card-foreground">Keyboard Shortcuts</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Focus Search:</span>
              <span className="font-mono bg-secondary/50 px-1 rounded">Ctrl+K</span>
            </div>
            <div className="flex justify-between">
              <span>Settings:</span>
              <span className="font-mono bg-secondary/50 px-1 rounded">Ctrl+,</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};