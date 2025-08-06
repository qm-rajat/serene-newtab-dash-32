import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
}

export const MusicPlayerWidget = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', url: '' });
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('musicPlayerTracks');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: "Lofi Hip Hop",
        artist: "ChillHop Music",
        url: "https://www.soundjay.com/misc/sounds/coffee-shop-ambience.mp3"
      },
      {
        id: '2',
        title: "Peaceful Piano",
        artist: "Relaxing Music",
        url: "https://www.soundjay.com/misc/sounds/rain-on-tent.mp3"
      }
    ];
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save tracks to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayerTracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = () => {
      toast.error('Failed to load audio track');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTrack = () => {
    if (!newTrack.title || !newTrack.artist) {
      toast.error('Please fill in title and artist');
      return;
    }

    let url = newTrack.url;
    if (!url) {
      toast.error('Please provide a URL or upload a file');
      return;
    }

    const track: Track = {
      id: Date.now().toString(),
      title: newTrack.title,
      artist: newTrack.artist,
      url: url
    };

    setTracks(prev => [...prev, track]);
    setNewTrack({ title: '', artist: '', url: '' });
    setIsDialogOpen(false);
    toast.success('Track added successfully!');
  };

  const removeTrack = (trackId: string) => {
    const trackIndex = tracks.findIndex(track => track.id === trackId);
    if (trackIndex === currentTrack && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
    
    setTracks(prev => prev.filter(track => track.id !== trackId));
    
    if (trackIndex < currentTrack) {
      setCurrentTrack(prev => prev - 1);
    } else if (trackIndex === currentTrack && trackIndex === tracks.length - 1) {
      setCurrentTrack(0);
    }
    
    toast.success('Track removed');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setNewTrack(prev => ({ ...prev, url }));
      toast.success('Audio file uploaded');
    } else {
      toast.error('Please select a valid audio file');
    }
  };

  if (tracks.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Music Player
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Track
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Track</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="track-title">Title</Label>
                    <Input
                      id="track-title"
                      value={newTrack.title}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Song title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="track-artist">Artist</Label>
                    <Input
                      id="track-artist"
                      value={newTrack.artist}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, artist: e.target.value }))}
                      placeholder="Artist name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="track-url">URL or Upload File</Label>
                    <div className="space-y-2">
                      <Input
                        id="track-url"
                        value={newTrack.url}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/song.mp3"
                      />
                      <div className="text-center text-sm text-muted-foreground">or</div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Audio File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <Button onClick={addTrack} className="w-full">
                    Add Track
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm mb-2">No tracks available</p>
            <p className="text-xs">Add your first track to start playing music</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Music Player
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Track</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="track-title">Title</Label>
                    <Input
                      id="track-title"
                      value={newTrack.title}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Song title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="track-artist">Artist</Label>
                    <Input
                      id="track-artist"
                      value={newTrack.artist}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, artist: e.target.value }))}
                      placeholder="Artist name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="track-url">URL or Upload File</Label>
                    <div className="space-y-2">
                      <Input
                        id="track-url"
                        value={newTrack.url}
                        onChange={(e) => setNewTrack(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/song.mp3"
                      />
                      <div className="text-center text-sm text-muted-foreground">or</div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Audio File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <Button onClick={addTrack} className="w-full">
                    Add Track
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.url}
        preload="metadata"
      />
      
      <CardContent className="space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-card-foreground truncate flex-1">
              {tracks[currentTrack]?.title}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTrack(tracks[currentTrack]?.id)}
              className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
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
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
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
          <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Slider
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
        </div>
        
        {/* Track List */}
        {tracks.length > 1 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            <div className="text-xs font-medium text-muted-foreground mb-2">Playlist</div>
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrack(index);
                  setProgress(0);
                  if (isPlaying) {
                    setTimeout(() => {
                      audioRef.current?.play();
                    }, 100);
                  }
                }}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  index === currentTrack 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{track.title}</div>
                  <div className="text-xs opacity-70 truncate">{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};