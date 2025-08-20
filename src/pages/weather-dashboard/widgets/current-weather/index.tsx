// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherData, WeatherService } from '../../services/weather-api';
import { WeatherWidgetConfig } from '../interfaces';

function CurrentWeatherHeader() {
  return (
    <Header variant="h2" description="Real-time weather conditions">
      Current Weather
    </Header>
  );
}

function CurrentWeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('Current Location');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const data = await WeatherService.getCurrentLocationWeather(latitude, longitude);
                setWeatherData(data);
                setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
              } finally {
                setLoading(false);
              }
            },
            async () => {
              // Fallback to a default location (London)
              try {
                const data = await WeatherService.getCurrentLocationWeather(51.5074, -0.1278);
                setWeatherData(data);
                setLocationName('London, UK (Default)');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
              } finally {
                setLoading(false);
              }
            }
          );
        } else {
          // Geolocation not supported, use default location
          try {
            const data = await WeatherService.getCurrentLocationWeather(51.5074, -0.1278);
            setWeatherData(data);
            setLocationName('London, UK (Default)');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          } finally {
            setLoading(false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" padding="xl">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 'm' }}>
          Loading current weather...
        </Box>
      </Box>
    );
  }

  if (error || !weatherData) {
    return (
      <Alert type="error" header="Failed to load weather data">
        {error || 'An unknown error occurred'}
      </Alert>
    );
  }

  const { current } = weatherData;
  const weatherIcon = WeatherService.getWeatherIcon(current.weather_code, current.is_day === 1);
  const weatherDescription = WeatherService.getWeatherDescription(current.weather_code);

  return (
    <ColumnLayout columns={1}>
      <Box textAlign="center">
        <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
          {weatherIcon}
        </Box>
        <Box fontSize="heading-xl" fontWeight="bold" margin={{ top: 's' }}>
          {Math.round(current.temperature_2m)}°C
        </Box>
        <Box variant="p" color="text-body-secondary" margin={{ top: 'xs' }}>
          Feels like {Math.round(current.apparent_temperature)}°C
        </Box>
        <Box variant="small" margin={{ top: 'xs' }}>
          {weatherDescription}
        </Box>
        <Box variant="small" color="text-body-secondary" margin={{ top: 'xs' }}>
          📍 {locationName}
        </Box>
      </Box>
      
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Humidity</Box>
          <Box variant="p">{current.relative_humidity_2m}%</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Wind Speed</Box>
          <Box variant="p">{Math.round(current.wind_speed_10m)} km/h</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Pressure</Box>
          <Box variant="p">{Math.round(current.pressure_msl)} hPa</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Cloud Cover</Box>
          <Box variant="p">{current.cloud_cover}%</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Precipitation</Box>
          <Box variant="p">{current.precipitation} mm</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Status</Box>
          <StatusIndicator type="success">
            {current.is_day ? 'Day' : 'Night'}
          </StatusIndicator>
        </div>
      </ColumnLayout>
    </ColumnLayout>
  );
}

export const currentWeather: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 2 },
  data: {
    icon: 'status-positive',
    title: 'Current Weather',
    description: 'Real-time weather conditions',
    header: CurrentWeatherHeader,
    content: CurrentWeatherWidget,
    staticMinHeight: 400,
  },
};
