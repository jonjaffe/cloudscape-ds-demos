// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherResponse, WeatherLocation } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherApiService {
  static async getCurrentWeather(location: WeatherLocation): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current_weather: 'true',
      temperature_unit: 'celsius',
      windspeed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: location.timezone || 'auto',
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getHourlyForecast(location: WeatherLocation, days: number = 7): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      hourly: 'temperature_2m,precipitation,weathercode,windspeed_10m,relative_humidity_2m',
      temperature_unit: 'celsius',
      windspeed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: location.timezone || 'auto',
      forecast_days: days.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getDailyForecast(location: WeatherLocation, days: number = 14): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max',
      temperature_unit: 'celsius',
      windspeed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: location.timezone || 'auto',
      forecast_days: days.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getCompleteWeatherData(location: WeatherLocation): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current_weather: 'true',
      hourly: 'temperature_2m,precipitation,weathercode,windspeed_10m,relative_humidity_2m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max',
      temperature_unit: 'celsius',
      windspeed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: location.timezone || 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Predefined locations
export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York', country: 'USA' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', country: 'UK' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', country: 'Japan' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', country: 'France' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', country: 'Australia' },
  { name: 'Berlin', latitude: 52.52, longitude: 13.405, timezone: 'Europe/Berlin', country: 'Germany' },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', country: 'USA' },
  { name: 'Mumbai', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata', country: 'India' },
];
