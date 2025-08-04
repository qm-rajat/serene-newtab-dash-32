import { useState, useEffect } from 'react';
import { Link, Plus, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export const QuickLinksWidget = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: '' });

  useEffect(() => {
    const saved = localStorage.getItem('quickLinks');
    if (saved) {
      setLinks(JSON.parse(saved));
    } else {
      // Default links
      setLinks([
        { id: '1', name: 'Google', url: 'https://google.com', icon: '🔍' },
        { id: '2', name: 'GitHub', url: 'https://github.com', icon: '💻' },
        { id: '3', name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
        { id: '4', name: 'Twitter', url: 'https://twitter.com', icon: '🐦' }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quickLinks', JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (newLink.name && newLink.url) {
      const link: QuickLink = {
        id: Date.now().toString(),
        name: newLink.name,
        url: newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`,
        icon: newLink.icon || '🔗'
      };
      setLinks([...links, link]);
      setNewLink({ name: '', url: '', icon: '' });
      setIsEditing(false);
    }
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Link className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-card-foreground">Quick Links</h3>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-glass-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add Quick Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                className="bg-secondary/50 border-glass-border"
              />
              <Input
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="bg-secondary/50 border-glass-border"
              />
              <Input
                placeholder="Icon (emoji)"
                value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                className="bg-secondary/50 border-glass-border"
              />
              <div className="flex space-x-2">
                <Button onClick={addLink} className="flex-1">Add Link</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {links.map((link) => (
          <div key={link.id} className="relative group/link">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-3 rounded-lg glass-hover transition-all duration-200 hover:scale-105"
            >
              <div className="w-8 h-8 mb-2 flex items-center justify-center">
                {link.icon ? (
                  <span className="text-xl">{link.icon}</span>
                ) : (
                  <img 
                    src={getFavicon(link.url)} 
                    alt={link.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <span className="text-xs text-card-foreground text-center line-clamp-1">
                {link.name}
              </span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink(link.id)}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive/80 text-white opacity-0 group-hover/link:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};