// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export interface GeolocationData {
  results: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1: string;
    admin2: string;
    timezone: string;
    population: number;
    country: string;
  }>;
}

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherService {
  static async getCurrentLocationWeather(latitude: number, longitude: number): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant',
      ].join(','),
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${BASE_URL}/forecast?${params}`);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return response.json();
  }

  static async searchCities(query: string): Promise<GeolocationData> {
    const params = new URLSearchParams({
      name: query,
      count: '10',
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_URL}/search?${params}`);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    return response.json();
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

  static getWeatherIcon(weatherCode: number, isDay: boolean): string {
    if (weatherCode === 0) {
      return isDay ? '☀️' : '🌙';
    } else if (weatherCode <= 3) {
      return isDay ? '⛅' : '☁️';
    } else if (weatherCode <= 48) {
      return '🌫️';
    } else if (weatherCode <= 67) {
      return '🌧️';
    } else if (weatherCode <= 77) {
      return '🌨️';
    } else if (weatherCode <= 82) {
      return '🌦️';
    } else if (weatherCode <= 86) {
      return '❄️';
    } else {
      return '⛈️';
    }
  }
}
