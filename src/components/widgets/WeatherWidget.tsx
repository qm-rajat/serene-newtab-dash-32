import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              await getWeatherData(latitude, longitude);
            },
            () => {
              // Fallback to default location (New York)
              getWeatherData(40.7128, -74.0060);
            }
          );
        } else {
          getWeatherData(40.7128, -74.0060);
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        setLoading(false);
      }
    };

    const getWeatherData = async (lat: number, lon: number) => {
      try {
        // Note: Replace with your OpenWeatherMap API key
        const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWeather({
            location: data.name,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon
          });
        } else {
          // Fallback mock data
          setWeather({
            location: 'Your City',
            temperature: 22,
            condition: 'Clear',
            humidity: 65,
            windSpeed: 3.2,
            icon: '01d'
          });
        }
      } catch (error) {
        console.error('Weather API error:', error);
        setWeather({
          location: 'Your City',
          temperature: 22,
          condition: 'Clear',
          humidity: 65,
          windSpeed: 3.2,
          icon: '01d'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="widget-glass">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Cloud className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-semibold text-card-foreground">Weather</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-glass group hover:neon-glow transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/20">
          <Cloud className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-semibold text-card-foreground">Weather</h3>
      </div>
      
      {weather && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-card-foreground">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground">
                {weather.location}
              </div>
            </div>
            {getWeatherIcon(weather.condition)}
          </div>
          
          <div className="text-sm text-muted-foreground mb-3">
            {weather.condition}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="w-3 h-3 text-gray-400" />
              <span>{weather.windSpeed} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};