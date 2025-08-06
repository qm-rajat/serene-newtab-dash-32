import { useState, useEffect } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { ClockWidget } from '@/components/widgets/ClockWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { TodoWidget } from '@/components/widgets/TodoWidget';
import { NotesWidget } from '@/components/widgets/NotesWidget';
import { QuoteWidget } from '@/components/widgets/QuoteWidget';
import { NewsWidget } from '@/components/widgets/NewsWidget';
import { QuickLinksWidget } from '@/components/widgets/QuickLinksWidget';
import { PomodoroWidget } from '@/components/widgets/PomodoroWidget';
import { MusicPlayerWidget } from '@/components/widgets/MusicPlayerWidget';
import { MoodTrackerWidget } from '@/components/widgets/MoodTrackerWidget';
import { BookmarkWidget } from '@/components/widgets/BookmarkWidget';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { AIAssistantSidebar } from '@/components/dashboard/AIAssistantSidebar';

const Index = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [enabledWidgets, setEnabledWidgets] = useState(() => {
    const saved = localStorage.getItem('enabledWidgets');
    return saved ? JSON.parse(saved) : {
      clock: true,
      weather: true,
      todo: true,
      notes: true,
      quote: true,
      news: true,
      quickLinks: true,
      pomodoro: true,
      musicPlayer: true,
      moodTracker: true,
      bookmarks: true,
    };
  });

  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  // Fetch daily background from Unsplash
  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const today = new Date().toDateString();
        const cachedBg = localStorage.getItem('dailyBackground');
        const cachedDate = localStorage.getItem('backgroundDate');
        
        if (cachedBg && cachedDate === today) {
          setBackgroundImage(cachedBg);
          return;
        }

        const response = await fetch('https://api.unsplash.com/photos/random?query=minimal,abstract&orientation=landscape&w=1920&h=1080', {
          headers: {
            'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBackgroundImage(data.urls.full);
          localStorage.setItem('dailyBackground', data.urls.full);
          localStorage.setItem('backgroundDate', today);
        } else {
          // Fallback gradient background
          setBackgroundImage('');
        }
      } catch (error) {
        console.error('Failed to fetch background:', error);
        setBackgroundImage('');
      }
    };

    fetchBackground();
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save enabled widgets
  useEffect(() => {
    localStorage.setItem('enabledWidgets', JSON.stringify(enabledWidgets));
  }, [enabledWidgets]);

  const toggleWidget = (widget: string) => {
    setEnabledWidgets(prev => ({
      ...prev,
      [widget]: !prev[widget]
    }));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-background bg-grid"
        style={{
          backgroundImage: backgroundImage 
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`
            : 'radial-gradient(circle at 20% 80%, hsl(var(--neon-primary) / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--neon-secondary) / 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, hsl(var(--neon-accent) / 0.1) 0%, transparent 50%)',
          backgroundSize: backgroundImage ? 'cover' : 'auto',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <Navbar 
          theme={theme} 
          onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          onOpenAI={() => setAiSidebarOpen(true)}
        />
        
        {/* Hero Search Section */}
        <div className="flex flex-col items-center justify-center pt-20 pb-12 px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-neon-secondary bg-clip-text text-transparent mb-4 float">
              Welcome
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your personal dashboard awaits
            </p>
          </div>
          
          <SearchBar />
        </div>

        {/* Widgets Grid */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {enabledWidgets.clock && (
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <ClockWidget />
              </div>
            )}
            
            {enabledWidgets.weather && (
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <WeatherWidget />
              </div>
            )}
            
            {enabledWidgets.todo && (
              <div className="animate-slide-up md:col-span-1 lg:col-span-1" style={{animationDelay: '0.3s'}}>
                <TodoWidget />
              </div>
            )}
            
            {enabledWidgets.notes && (
              <div className="animate-slide-up md:col-span-1" style={{animationDelay: '0.4s'}}>
                <NotesWidget />
              </div>
            )}
            
            {enabledWidgets.quote && (
              <div className="animate-slide-up md:col-span-2 lg:col-span-2" style={{animationDelay: '0.5s'}}>
                <QuoteWidget />
              </div>
            )}
            
            {enabledWidgets.quickLinks && (
              <div className="animate-slide-up md:col-span-2 lg:col-span-2" style={{animationDelay: '0.6s'}}>
                <QuickLinksWidget />
              </div>
            )}
            
            {enabledWidgets.news && (
              <div className="animate-slide-up md:col-span-2 lg:col-span-2" style={{animationDelay: '0.7s'}}>
                <NewsWidget />
              </div>
            )}
            
            {enabledWidgets.pomodoro && (
              <div className="animate-slide-up" style={{animationDelay: '0.8s'}}>
                <PomodoroWidget />
              </div>
            )}
            
            {enabledWidgets.musicPlayer && (
              <div className="animate-slide-up md:col-span-2" style={{animationDelay: '0.9s'}}>
                <MusicPlayerWidget />
              </div>
            )}
            
            {enabledWidgets.moodTracker && (
              <div className="animate-slide-up" style={{animationDelay: '1.0s'}}>
                <MoodTrackerWidget />
              </div>
            )}
            
            {enabledWidgets.bookmarks && (
              <div className="animate-slide-up md:col-span-2" style={{animationDelay: '1.1s'}}>
                <BookmarkWidget />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette 
        theme={theme}
        onThemeChange={setTheme}
        enabledWidgets={enabledWidgets}
        onToggleWidget={toggleWidget}
        onOpenAI={() => setAiSidebarOpen(true)}
      />

      {/* Settings Panel */}
      <SettingsPanel 
        theme={theme}
        onThemeChange={setTheme}
        enabledWidgets={enabledWidgets}
        onToggleWidget={toggleWidget}
      />

      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar 
        isOpen={aiSidebarOpen}
        onToggle={() => setAiSidebarOpen(!aiSidebarOpen)}
      />
    </div>
  );
};

export default Index;