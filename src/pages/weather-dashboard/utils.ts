// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Utility functions for weather dashboard
 */

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number, unit: 'kmh' | 'mph' | 'ms' = 'kmh'): string {
  switch (unit) {
    case 'mph':
      return `${Math.round(speed * 0.621371)} mph`;
    case 'ms':
      return `${Math.round(speed / 3.6)} m/s`;
    default:
      return `${Math.round(speed)} km/h`;
  }
}

export function formatPrecipitation(precip: number, unit: 'mm' | 'inch' = 'mm'): string {
  if (unit === 'inch') {
    return `${(precip * 0.0393701).toFixed(2)}"`;
  }
  return `${precip.toFixed(1)}mm`;
}

export function getWindDirection(degrees: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];

  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getWeatherIcon(weatherCode: number, isDay: boolean = true): string {
  // Map weather codes to appropriate icons based on day/night
  const iconMap: Record<number, { day: string; night: string }> = {
    0: { day: 'sunny', night: 'moon' },
    1: { day: 'partly-cloudy', night: 'partly-cloudy' },
    2: { day: 'partly-cloudy', night: 'partly-cloudy' },
    3: { day: 'cloudy', night: 'cloudy' },
    45: { day: 'fog', night: 'fog' },
    48: { day: 'fog', night: 'fog' },
    51: { day: 'rain', night: 'rain' },
    53: { day: 'rain', night: 'rain' },
    55: { day: 'rain', night: 'rain' },
    56: { day: 'snow', night: 'snow' },
    57: { day: 'snow', night: 'snow' },
    61: { day: 'rain', night: 'rain' },
    63: { day: 'rain', night: 'rain' },
    65: { day: 'rain', night: 'rain' },
    66: { day: 'snow', night: 'snow' },
    67: { day: 'snow', night: 'snow' },
    71: { day: 'snow', night: 'snow' },
    73: { day: 'snow', night: 'snow' },
    75: { day: 'snow', night: 'snow' },
    77: { day: 'snow', night: 'snow' },
    80: { day: 'rain', night: 'rain' },
    81: { day: 'rain', night: 'rain' },
    82: { day: 'rain', night: 'rain' },
    85: { day: 'snow', night: 'snow' },
    86: { day: 'snow', night: 'snow' },
    95: { day: 'thunderstorm', night: 'thunderstorm' },
    96: { day: 'thunderstorm', night: 'thunderstorm' },
    99: { day: 'thunderstorm', night: 'thunderstorm' },
  };

  const icons = iconMap[weatherCode];
  if (!icons) return 'question';

  return isDay ? icons.day : icons.night;
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula to calculate distance between two points
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return time.toLocaleDateString();
}
