// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  windSpeed: number[];
}

export interface DailyForecast {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitation: number[];
  windSpeedMax: number[];
  weatherCode: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  location: WeatherLocation;
}

export class WeatherAPI {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1';

  static async getCurrentWeather(location: WeatherLocation): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      hourly: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'wind_speed_10m'].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
        'weather_code',
      ].join(','),
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${this.BASE_URL}/forecast?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
        time: data.current.time,
      },
      hourly: {
        time: data.hourly.time.slice(0, 24), // Next 24 hours
        temperature: data.hourly.temperature_2m.slice(0, 24),
        humidity: data.hourly.relative_humidity_2m.slice(0, 24),
        precipitation: data.hourly.precipitation.slice(0, 24),
        windSpeed: data.hourly.wind_speed_10m.slice(0, 24),
      },
      daily: {
        time: data.daily.time,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        precipitation: data.daily.precipitation_sum,
        windSpeedMax: data.daily.wind_speed_10m_max,
        weatherCode: data.daily.weather_code,
      },
      location,
    };
  }

  static async searchLocations(query: string): Promise<WeatherLocation[]> {
    const params = new URLSearchParams({
      name: query,
      count: '10',
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return (data.results || []).map((result: any) => ({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
      timezone: result.timezone,
    }));
  }

  static getWeatherDescription(weatherCode: number): string {
    const weatherCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[weatherCode] || 'Unknown';
  }
}

// Default locations
export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  { latitude: 40.7128, longitude: -74.006, name: 'New York', country: 'United States' },
  { latitude: 51.5074, longitude: -0.1278, name: 'London', country: 'United Kingdom' },
  { latitude: 48.8566, longitude: 2.3522, name: 'Paris', country: 'France' },
  { latitude: 35.6762, longitude: 139.6503, name: 'Tokyo', country: 'Japan' },
  { latitude: -33.8688, longitude: 151.2093, name: 'Sydney', country: 'Australia' },
];
