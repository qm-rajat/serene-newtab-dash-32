import { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteData {
  text: string;
  author: string;
}

export const QuoteWidget = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      if (response.ok) {
        const data = await response.json();
        setQuote({
          text: data[0].q,
          author: data[0].a
        });
      } else {
        // Fallback quotes
        const fallbackQuotes = [
          { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
          { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
          { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
        ];
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(randomQuote);
      }
    } catch (error) {
      console.error('Quote fetch error:', error);
      setQuote({
        text: "Every moment is a fresh beginning.",
        author: "T.S. Eliot"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-info/20">
            <Quote className="w-5 h-5 text-info" />
          </div>
          <h3 className="font-semibold text-card-foreground">Quote of the Day</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchQuote}
          disabled={loading}
          className="text-muted-foreground hover:text-primary"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      ) : quote ? (
        <div className="space-y-3">
          <blockquote className="text-lg italic text-card-foreground leading-relaxed">
            "{quote.text}"
          </blockquote>
          <div className="text-right">
            <cite className="text-sm text-primary font-medium">— {quote.author}</cite>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Failed to load quote
        </div>
      )}
    </div>
  );
};