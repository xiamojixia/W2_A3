// /src/app/pages/event-detail/event-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../src/environments/environment';

// 天气代码翻译
const WEATHER_DESCRIPTIONS: { [key: number]: string } = {
  0: '☀️ Clear sky',
  1: '🌤️ Mainly clear',
  2: '⛅ Partly cloudy',
  3: '☁️ Overcast',
  45: '🌫️ Fog',
  48: '🌫️ Rime fog',
  51: '🌦️ Light drizzle',
  53: '🌦️ Moderate drizzle',
  55: '🌦️ Dense drizzle',
  61: '🌧️ Light rain',
  63: '🌧️ Moderate rain',
  65: '🌧️ Heavy rain',
  66: '🌧️ Light freezing rain',
  67: '🌧️ Heavy freezing rain',
  71: '🌨️ Light snow',
  73: '🌨️ Moderate snow',
  75: '🌨️ Heavy snow',
  77: '🌨️ Snow grains',
  80: '🌦️ Light rain showers',
  81: '🌦️ Moderate rain showers',
  82: '🌦️ Violent rain showers',
  85: '🌨️ Light snow showers',
  86: '🌨️ Heavy snow showers',
  95: '⛈️ Thunderstorm',
  96: '⛈️ Thunderstorm with light hail',
  99: '⛈️ Thunderstorm with heavy hail'
};

interface Event {
  id: number;
  name: string;
  description: string;
  start_datetime: string;
  location: string;
  image_url?: string;
  category_name: string;
  org_name: string;
  events_status: string;
  registration_count: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-event-detail',
  standalone: false,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  apiUrl = environment.apiUrl;
  event: Event | null = null;
  weatherData: WeatherData | null = null;
  weatherDescription: string = '';
  isLoading: boolean = true;
  isLoadingWeather: boolean = false;
  errorMessage: string = '';
  weatherError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private weatherService: WeatherService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEventDetails();
  }

  loadEventDetails(): void {

    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.errorMessage = '活动ID未找到';
      this.isLoading = false;
      return;
    }
    const fullApiUrl = `${this.apiUrl}/events/${eventId}`;

    this.http.get<Event>(fullApiUrl).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;

        // 加载天气数据
        if (event.latitude && event.longitude) {
          console.log('活动经纬度:', event.latitude, event.longitude);
          this.loadWeatherData(event.latitude, event.longitude);
        } else {
          console.warn('活动缺少经纬度信息');
          this.weatherError = '该活动暂无天气信息';
        }
      },
      error: (error) => {
        console.error('加载活动详情错误:', error);
        this.errorMessage = '加载活动详情失败';
        this.isLoading = false;
      }
    });
  }

  loadWeatherData(latitude: number, longitude: number): void {
    this.isLoadingWeather = true;
    this.weatherError = '';

    console.log('正在获取天气数据，经纬度:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    console.log('正在获取天气数据，经纬度1:', latitude, longitude);
    this.weatherService.getWeather(latitude, longitude).subscribe({
      next: (data) => {
        console.log('天气数据响应:', data);
        this.weatherData = data;

        if (data.daily && data.daily.weather_code.length > 0) {
          const weatherCode = data.daily.weather_code[0];
          this.weatherDescription =
            WEATHER_DESCRIPTIONS[weatherCode] || 'Unknown weather condition';

          console.log('天气代码:', weatherCode, '描述:', this.weatherDescription);
        }

        this.isLoadingWeather = false;
      },
      error: (error) => {
        console.error('获取天气数据错误:', error);
        this.weatherError = '获取天气信息失败';
        this.isLoadingWeather = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEventImage(event: Event): string {
    return event.image_url || 'https://via.placeholder.com/800x450?text=No+Image';
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  joinEvent(event: Event): void {
    console.log('🎯 加入活动:', event.name, 'ID:', event.id);

    // 使用查询参数传递事件ID
    this.router.navigate(['/login'], {
      queryParams: { eventId: event.id }
    });
  }

  donateToEvent(): void {
    if (this.event) {
      const amount = prompt(`Please enter the donation amount for ${this.event.name}`, '50');
      if (amount) {
        alert(`Thank you for donating $${amount} to ${this.event.name}`);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
