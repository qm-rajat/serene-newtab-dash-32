import { Sun, Moon, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  theme: string;
  onThemeToggle: () => void;
}

export const Navbar = ({ theme, onThemeToggle }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="glass-hover text-foreground hover:text-primary"
          >
            {theme === 'dark' ? 
              <Sun className="w-5 h-5" /> : 
              <Moon className="w-5 h-5" />
            }
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="glass-hover text-foreground hover:text-primary"
            onClick={() => {
              const settingsPanel = document.getElementById('settings-panel');
              if (settingsPanel) {
                settingsPanel.classList.toggle('translate-x-full');
              }
            }}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};