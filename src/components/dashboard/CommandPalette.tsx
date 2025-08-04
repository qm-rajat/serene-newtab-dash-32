import { useState, useEffect, useCallback } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { 
  Search, 
  Clock, 
  Sun, 
  Moon, 
  Settings, 
  Timer, 
  Calendar,
  Music,
  StickyNote,
  CheckSquare,
  Quote,
  Newspaper,
  Link,
  Heart,
  Focus,
  Palette,
  Activity
} from 'lucide-react';

interface CommandPaletteProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  enabledWidgets: Record<string, boolean>;
  onToggleWidget: (widget: string) => void;
  onFocusMode?: () => void;
  onOpenSettings?: () => void;
  onOpenAI?: () => void;
}

interface CommandAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
  keywords?: string[];
}

export const CommandPalette = ({ 
  theme, 
  onThemeChange, 
  enabledWidgets, 
  onToggleWidget,
  onFocusMode,
  onOpenSettings,
  onOpenAI
}: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);

  // Register keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const executeAction = useCallback((action: () => void) => {
    action();
    setOpen(false);
  }, []);

  const commands: CommandAction[] = [
    // Theme Commands
    {
      id: 'theme-light',
      label: 'Switch to Light Theme',
      icon: Sun,
      action: () => onThemeChange('light'),
      category: 'Theme',
      keywords: ['light', 'bright', 'white']
    },
    {
      id: 'theme-dark',
      label: 'Switch to Dark Theme',
      icon: Moon,
      action: () => onThemeChange('dark'),
      category: 'Theme',
      keywords: ['dark', 'night', 'black']
    },

    // Widget Toggle Commands
    {
      id: 'toggle-clock',
      label: `${enabledWidgets.clock ? 'Hide' : 'Show'} Clock Widget`,
      icon: Clock,
      action: () => onToggleWidget('clock'),
      category: 'Widgets'
    },
    {
      id: 'toggle-weather',
      label: `${enabledWidgets.weather ? 'Hide' : 'Show'} Weather Widget`,
      icon: Sun,
      action: () => onToggleWidget('weather'),
      category: 'Widgets'
    },
    {
      id: 'toggle-todo',
      label: `${enabledWidgets.todo ? 'Hide' : 'Show'} Todo Widget`,
      icon: CheckSquare,
      action: () => onToggleWidget('todo'),
      category: 'Widgets'
    },
    {
      id: 'toggle-notes',
      label: `${enabledWidgets.notes ? 'Hide' : 'Show'} Notes Widget`,
      icon: StickyNote,
      action: () => onToggleWidget('notes'),
      category: 'Widgets'
    },
    {
      id: 'toggle-quote',
      label: `${enabledWidgets.quote ? 'Hide' : 'Show'} Quote Widget`,
      icon: Quote,
      action: () => onToggleWidget('quote'),
      category: 'Widgets'
    },
    {
      id: 'toggle-news',
      label: `${enabledWidgets.news ? 'Hide' : 'Show'} News Widget`,
      icon: Newspaper,
      action: () => onToggleWidget('news'),
      category: 'Widgets'
    },
    {
      id: 'toggle-quicklinks',
      label: `${enabledWidgets.quickLinks ? 'Hide' : 'Show'} Quick Links Widget`,
      icon: Link,
      action: () => onToggleWidget('quickLinks'),
      category: 'Widgets'
    },
    {
      id: 'toggle-pomodoro',
      label: `${enabledWidgets.pomodoro ? 'Hide' : 'Show'} Pomodoro Widget`,
      icon: Timer,
      action: () => onToggleWidget('pomodoro'),
      category: 'Widgets'
    },
    {
      id: 'toggle-music',
      label: `${enabledWidgets.musicPlayer ? 'Hide' : 'Show'} Music Player Widget`,
      icon: Music,
      action: () => onToggleWidget('musicPlayer'),
      category: 'Widgets'
    },
    {
      id: 'toggle-mood',
      label: `${enabledWidgets.moodTracker ? 'Hide' : 'Show'} Mood Tracker Widget`,
      icon: Heart,
      action: () => onToggleWidget('moodTracker'),
      category: 'Widgets'
    },

    // Action Commands
    {
      id: 'open-settings',
      label: 'Open Settings',
      icon: Settings,
      action: () => {
        onOpenSettings?.();
        const panel = document.getElementById('settings-panel');
        if (panel) {
          panel.classList.remove('translate-x-full');
        }
      },
      category: 'Actions',
      keywords: ['settings', 'preferences', 'config']
    },
    {
      id: 'focus-mode',
      label: 'Toggle Focus Mode',
      icon: Focus,
      action: () => onFocusMode?.(),
      category: 'Actions',
      keywords: ['focus', 'distraction', 'minimal']
    },
    {
      id: 'open-ai',
      label: 'Open AI Assistant',
      icon: Activity,
      action: () => onOpenAI?.(),
      category: 'Actions',
      keywords: ['ai', 'assistant', 'chat', 'help']
    },

    // Quick Links
    {
      id: 'open-gmail',
      label: 'Open Gmail',
      icon: Link,
      action: () => window.open('https://gmail.com', '_blank'),
      category: 'Quick Links',
      keywords: ['email', 'mail', 'google']
    },
    {
      id: 'open-github',
      label: 'Open GitHub',
      icon: Link,
      action: () => window.open('https://github.com', '_blank'),
      category: 'Quick Links',
      keywords: ['code', 'repository', 'git']
    },
    {
      id: 'open-calendar',
      label: 'Open Google Calendar',
      icon: Calendar,
      action: () => window.open('https://calendar.google.com', '_blank'),
      category: 'Quick Links',
      keywords: ['calendar', 'schedule', 'events']
    }
  ];

  // Group commands by category
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
          <CommandGroup key={category} heading={category}>
            {categoryCommands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => executeAction(command.action)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <command.icon className="w-4 h-4" />
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};