const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface GeocodingResult {
  results?: Location[];
  generationtime_ms?: number;
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
    );
    const data: GeocodingResult = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function getWeatherForecast(
  latitude: number,
  longitude: number
): Promise<ForecastData | null> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,precipitation,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
      temperature_unit: 'fahrenheit',
      timezone: 'auto',
    });

    const response = await fetch(`${FORECAST_API}?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
}

export function getWeatherDescription(code: number): string {
  // WMO Weather interpretation codes
  const codes: { [key: number]: string } = {
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
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return codes[code] || 'Unknown';
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if ((code >= 51 && code <= 55) || (code >= 80 && code <= 82)) return '🌧️';
  if ((code >= 61 && code <= 65)) return '🌧️';
  if ((code >= 71 && code <= 75) || (code >= 85 && code <= 86)) return '❄️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌤️';
}
