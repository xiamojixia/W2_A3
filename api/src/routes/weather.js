const express = require('express');
const router = express.Router();

// 天气代码翻译
const WEATHER_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear', 
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with light hail',
  99: 'Thunderstorm with heavy hail'
};

// GET /api/weather/:latitude/:longitude
router.get('/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    
    console.log('🌤️ 获取天气数据 - 经纬度:', latitude, longitude);

    // 验证经纬度
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ 
        error: 'Invalid coordinates',
        message: 'Please provide valid latitude and longitude values' 
      });
    }

    // 构建Open-Meteo API URL
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;

    console.log('🔗 请求Open-Meteo API:', apiUrl);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API responded with status: ${response.status}`);
    }

    const weatherData = await response.json();
    
    console.log('✅ 天气API响应成功');

    // 添加天气描述
    if (weatherData.daily && weatherData.daily.weather_code.length > 0) {
      const weatherCode = weatherData.daily.weather_code[0];
      weatherData.weather_description = WEATHER_DESCRIPTIONS[weatherCode] || 'Unknown';
      weatherData.weather_emoji = getWeatherEmoji(weatherCode);
    }

    res.json(weatherData);
    
  } catch (error) {
    console.error('❌ 天气API错误:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});

// 获取天气对应的emoji
function getWeatherEmoji(weatherCode) {
  const emojiMap = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌦️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    66: '🌧️',
    67: '🌧️',
    71: '🌨️',
    73: '🌨️',
    75: '🌨️',
    77: '🌨️',
    80: '🌦️',
    81: '🌦️',
    82: '🌦️',
    85: '🌨️',
    86: '🌨️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
  };
  return emojiMap[weatherCode] || '🌈';
}

module.exports = router;