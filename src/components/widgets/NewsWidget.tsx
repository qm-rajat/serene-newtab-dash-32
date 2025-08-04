import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const NewsWidget = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Note: Replace with your NewsAPI key
        const API_KEY = 'YOUR_NEWSAPI_KEY';
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setNews(data.articles.map((article: any) => ({
            title: article.title,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt
          })));
        } else {
          // Fallback mock news
          setNews([
            { title: "Tech Innovation Continues to Shape Future", url: "#", source: "Tech News", publishedAt: "2024-01-15" },
            { title: "Climate Solutions Gain Global Support", url: "#", source: "World News", publishedAt: "2024-01-15" },
            { title: "Space Exploration Reaches New Milestones", url: "#", source: "Science Daily", publishedAt: "2024-01-15" }
          ]);
        }
      } catch (error) {
        console.error('News fetch error:', error);
        setNews([
          { title: "Welcome to Your Personal Dashboard", url: "#", source: "Dashboard", publishedAt: "2024-01-15" },
          { title: "Stay Updated with Latest News", url: "#", source: "News", publishedAt: "2024-01-15" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-info/20">
          <Newspaper className="w-5 h-5 text-info" />
        </div>
        <h3 className="font-semibold text-card-foreground">Latest News</h3>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
          {news.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg glass-hover cursor-pointer group/item"
              onClick={() => window.open(item.url, '_blank')}
            >
              <h4 className="text-sm font-medium text-card-foreground line-clamp-2 mb-1 group-hover/item:text-primary transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.source}</span>
                <div className="flex items-center space-x-1">
                  <span>{formatDate(item.publishedAt)}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};