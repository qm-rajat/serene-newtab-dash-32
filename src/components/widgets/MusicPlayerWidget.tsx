import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

export const MusicPlayerWidget = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample tracks - replace with your own
  const tracks: Track[] = [
    {
      id: 1,
      title: "Chill Vibes",
      artist: "Lofi Artist",
      url: "https://www.soundjay.com/misc/sounds/coffee-shop-ambience.mp3" // Placeholder
    },
    {
      id: 2,
      title: "Focus Flow",
      artist: "Study Beats",
      url: "https://www.soundjay.com/misc/sounds/rain-on-tent.mp3" // Placeholder
    },
    {
      id: 3,
      title: "Peaceful Moments",
      artist: "Ambient Master",
      url: "https://www.soundjay.com/misc/sounds/forest-birds.mp3" // Placeholder
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    
    const newTime = (value[0] / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(value[0]);
  };

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-neon-accent/20">
          <Music className="w-5 h-5 text-neon-accent" />
        </div>
        <h3 className="font-semibold text-card-foreground">Music Player</h3>
      </div>
      
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.url}
        preload="metadata"
      />
      
      <div className="space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <h4 className="font-medium text-card-foreground truncate">
            {tracks[currentTrack]?.title}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {tracks[currentTrack]?.artist}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTrack}
            className="text-muted-foreground hover:text-primary"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={togglePlay}
            size="icon"
            className="bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="text-muted-foreground hover:text-primary"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};