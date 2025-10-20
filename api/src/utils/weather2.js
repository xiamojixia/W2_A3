const express = require('express');
const router = express.Router();

router.get('/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    
    console.log('获取天气数据，经纬度:', latitude, longitude);

    const apiUrl = new URL('https://api.open-meteo.com/v1/forecast');
    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      forecast_days: 1
    };
    
    Object.keys(params).forEach(key => 
      apiUrl.searchParams.append(key, params[key])
    );

    console.log('请求Open-Meteo API:', apiUrl.toString());

    const weatherResponse = await fetch(apiUrl.toString());
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API responded with status: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log('天气API响应:', weatherData);
    
    res.json(weatherData);
    
  } catch (error) {
    console.error('天气API错误:', error);
    res.status(500).json({ 
      error: '获取天气数据失败',
      message: error.message 
    });
  }
});

module.exports = router;