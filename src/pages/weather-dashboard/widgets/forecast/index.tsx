// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData, WeatherService } from '../../services/weather-api';
import { WeatherWidgetConfig } from '../interfaces';

function ForecastHeader() {
  return (
    <Header variant="h2" description="7-day weather forecast">
      Weekly Forecast
    </Header>
  );
}

function ForecastWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async position => {
              try {
                const { latitude, longitude } = position.coords;
                const data = await WeatherService.getCurrentLocationWeather(latitude, longitude);
                setWeatherData(data);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
              } finally {
                setLoading(false);
              }
            },
            async () => {
              try {
                const data = await WeatherService.getCurrentLocationWeather(51.5074, -0.1278);
                setWeatherData(data);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
              } finally {
                setLoading(false);
              }
            },
          );
        } else {
          try {
            const data = await WeatherService.getCurrentLocationWeather(51.5074, -0.1278);
            setWeatherData(data);
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
          Loading forecast...
        </Box>
      </Box>
    );
  }

  if (error || !weatherData) {
    return (
      <Alert type="error" header="Failed to load forecast data">
        {error || 'An unknown error occurred'}
      </Alert>
    );
  }

  const { daily } = weatherData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <ColumnLayout columns={1} variant="text-grid">
      {daily.time.map((date, index) => {
        const weatherIcon = WeatherService.getWeatherIcon(daily.weather_code[index], true);
        const weatherDescription = WeatherService.getWeatherDescription(daily.weather_code[index]);

        return (
          <Box key={date} padding={{ vertical: 's', horizontal: 'm' }}>
            <ColumnLayout columns={4} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">{formatDate(date)}</Box>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Box fontSize="heading-m">{weatherIcon}</Box>
                <Box variant="small" color="text-body-secondary">
                  {weatherDescription}
                </Box>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Box variant="p" fontWeight="bold">
                  {Math.round(daily.temperature_2m_max[index])}°
                </Box>
                <Box variant="small" color="text-body-secondary">
                  {Math.round(daily.temperature_2m_min[index])}°
                </Box>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Box variant="small">💧 {daily.precipitation_probability_max[index]}%</Box>
                <Box variant="small" color="text-body-secondary">
                  🌧️ {daily.precipitation_sum[index].toFixed(1)}mm
                </Box>
              </div>
            </ColumnLayout>
          </Box>
        );
      })}
    </ColumnLayout>
  );
}

export const weeklyForecast: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 4, defaultColumnSpan: 3 },
  data: {
    icon: 'calendar',
    title: 'Weekly Forecast',
    description: '7-day weather forecast',
    header: ForecastHeader,
    content: ForecastWidget,
    staticMinHeight: 500,
  },
};
