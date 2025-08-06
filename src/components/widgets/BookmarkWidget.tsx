import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export const BookmarkWidget = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('customBookmarks');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Google',
        url: 'https://google.com',
        favicon: 'https://www.google.com/favicon.ico'
      },
      {
        id: '2',
        title: 'GitHub',
        url: 'https://github.com',
        favicon: 'https://github.com/favicon.ico'
      },
      {
        id: '3',
        title: 'YouTube',
        url: 'https://youtube.com',
        favicon: 'https://www.youtube.com/favicon.ico'
      }
    ];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '' });

  useEffect(() => {
    localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=example.com&sz=32`;
    }
  };

  const addBookmark = () => {
    if (!newBookmark.title || !newBookmark.url) {
      toast.error('Please fill in both title and URL');
      return;
    }

    let url = newBookmark.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      title: newBookmark.title,
      url: url,
      favicon: getFaviconUrl(url)
    };

    setBookmarks(prev => [...prev, bookmark]);
    setNewBookmark({ title: '', url: '' });
    setIsDialogOpen(false);
    toast.success('Bookmark added successfully!');
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    toast.success('Bookmark removed');
  };

  const openBookmark = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bookmarks
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Bookmark</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="e.g., google.com"
                  />
                </div>
                <Button onClick={addBookmark} className="w-full">
                  Add Bookmark
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group relative flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1 h-5 w-5 flex items-center justify-center text-xs z-10"
              >
                <X className="h-3 w-3" />
              </button>
              
              <div
                onClick={() => openBookmark(bookmark.url)}
                className="flex flex-col items-center space-y-1 w-full"
              >
                <div className="w-10 h-10 rounded-lg bg-background border border-border/50 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                  <img
                    src={bookmark.favicon || getFaviconUrl(bookmark.url)}
                    alt={bookmark.title}
                    className="w-6 h-6"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<ExternalLink class="w-4 h-4 text-muted-foreground" />';
                      }
                    }}
                  />
                </div>
                <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors truncate w-full">
                  {bookmark.title}
                </span>
              </div>
            </div>
          ))}
          
          {bookmarks.length === 0 && (
            <div className="col-span-4 text-center py-8 text-muted-foreground">
              <ExternalLink className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No bookmarks yet</p>
              <p className="text-xs">Click the + button to add some</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};