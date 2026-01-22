// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface Location {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
}

/**
 * Search for cities using the Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) {
    return [];
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.append('name', query);
  url.searchParams.append('count', '10');
  url.searchParams.append('language', 'en');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map((result: any) => ({
    id: result.id,
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }));
}

/**
 * Get weather forecast for a location using the Open-Meteo Forecast API
 */
export async function getWeatherForecast(latitude: number, longitude: number): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  url.searchParams.append('current_weather', 'true');
  url.searchParams.append('hourly', 'temperature_2m');
  url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode');
  url.searchParams.append('forecast_days', '7');
  url.searchParams.append('temperature_unit', 'fahrenheit');
  url.searchParams.append('windspeed_unit', 'mph');
  url.searchParams.append('precipitation_unit', 'inch');
  url.searchParams.append('timezone', 'auto');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get weather code description
 */
export function getWeatherDescription(weatherCode: number): string {
  const weatherDescriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with hail',
  };

  return weatherDescriptions[weatherCode] || 'Unknown';
}

/**
 * Get weather icon emoji based on weather code
 */
export function getWeatherIcon(weatherCode: number, isDay: number = 1): string {
  const isDaytime = isDay === 1;

  if (weatherCode === 0) return '☀️';
  if (weatherCode === 1 || weatherCode === 2) return isDaytime ? '⛅' : '🌤️';
  if (weatherCode === 3) return '☁️';
  if (weatherCode === 45 || weatherCode === 48) return '🌫️';
  if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
  if (weatherCode >= 71 && weatherCode <= 86) return '❄️';
  if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';

  return '🌡️';
}
