'use client';

import { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('都市名を入力してください');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('天気情報を取得できませんでした');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
              天気予報アプリ
            </h1>
            
            {/* 検索エリア */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="都市名を入力してください（例: Tokyo）"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={fetchWeather}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? '検索中...' : '検索'}
                </button>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* 天気情報表示 */}
            {weatherData && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {weatherData.name}
                </h2>
                
                <div className="text-center mb-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="mx-auto w-20 h-20"
                  />
                  <p className="text-lg text-gray-600 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">気温:</span>
                    <span className="text-2xl font-bold text-gray-800">
                      {Math.round(weatherData.main.temp)}°C
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">体感温度:</span>
                    <span className="text-lg text-gray-800">
                      {Math.round(weatherData.main.feels_like)}°C
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">湿度:</span>
                    <span className="text-lg text-gray-800">
                      {weatherData.main.humidity}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">風速:</span>
                    <span className="text-lg text-gray-800">
                      {weatherData.wind.speed} m/s
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}