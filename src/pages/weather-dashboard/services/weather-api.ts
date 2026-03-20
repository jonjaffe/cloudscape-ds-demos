import { WeatherData, Location, GeocodeResponse, WeatherResponse } from '../types';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export async function fetchGeocoding(query: string): Promise<Location[]> {
  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data: GeocodeResponse = await response.json();
    return data.results || [];
  } catch (error) {
    throw new Error(`Geocoding error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
      hourly: 'temperature_2m,wind_speed_10m,relative_humidity_2m',
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${FORECAST_API}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: WeatherResponse = await response.json();

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      current: data.current,
      daily: data.daily,
      hourly: data.hourly,
    };
  } catch (error) {
    throw new Error(
      `Weather API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function getWeatherDescription(weatherCode: number): string {
  // WMO Weather interpretation codes
  const descriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
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

  return descriptions[weatherCode] || `Weather code ${weatherCode}`;
}

export function getWeatherIcon(weatherCode: number): string {
  // Return emoji based on weather code
  if (weatherCode === 0) return '☀️';
  if (weatherCode === 1 || weatherCode === 2) return '⛅';
  if (weatherCode === 3) return '☁️';
  if (weatherCode === 45 || weatherCode === 48) return '🌫️';
  if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
  if (weatherCode >= 71 && weatherCode <= 86) return '❄️';
  if (weatherCode >= 80 && weatherCode <= 82) return '🌧️';
  if (weatherCode >= 85 && weatherCode <= 86) return '🌨️';
  if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
  return '🌤️';
}
