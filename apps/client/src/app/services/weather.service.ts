// /src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWeather(latitude: number, longitude: number): Observable<WeatherData> {
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
    return this.http.get<WeatherData>(`${this.apiUrl}${latitude}/${longitude}`);
  }
}
