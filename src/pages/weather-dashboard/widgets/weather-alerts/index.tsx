// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherData, WeatherService } from '../../services/weather-api';
import { WeatherWidgetConfig } from '../interfaces';

function WeatherAlertsHeader() {
  return (
    <Header variant="h2" description="Weather conditions and alerts">
      Weather Alerts
    </Header>
  );
}

function WeatherAlertsWidget() {
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
            async (position) => {
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
            }
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
          Loading weather alerts...
        </Box>
      </Box>
    );
  }

  if (error || !weatherData) {
    return (
      <Alert type="error" header="Failed to load weather alerts">
        {error || 'An unknown error occurred'}
      </Alert>
    );
  }

  const { current, hourly } = weatherData;
  
  const generateAlerts = () => {
    const alerts = [];

    // High wind alert
    if (current.wind_speed_10m > 30) {
      alerts.push({
        type: 'warning' as const,
        icon: '💨',
        title: 'High Wind Warning',
        message: `Strong winds at ${Math.round(current.wind_speed_10m)} km/h`,
      });
    }

    // Heavy rain alert
    if (current.precipitation > 5) {
      alerts.push({
        type: 'warning' as const,
        icon: '🌧️',
        title: 'Heavy Rain Alert',
        message: `Heavy precipitation: ${current.precipitation.toFixed(1)} mm/h`,
      });
    }

    // Low visibility alert
    if (current.weather_code >= 45 && current.weather_code <= 48) {
      alerts.push({
        type: 'warning' as const,
        icon: '🌫️',
        title: 'Low Visibility',
        message: 'Fog conditions may affect visibility',
      });
    }

    // Extreme temperature alerts
    if (current.temperature_2m > 35) {
      alerts.push({
        type: 'warning' as const,
        icon: '🌡️',
        title: 'High Temperature',
        message: `Very hot conditions: ${Math.round(current.temperature_2m)}°C`,
      });
    } else if (current.temperature_2m < -10) {
      alerts.push({
        type: 'warning' as const,
        icon: '🥶',
        title: 'Extreme Cold',
        message: `Very cold conditions: ${Math.round(current.temperature_2m)}°C`,
      });
    }

    // High humidity alert
    if (current.relative_humidity_2m > 85) {
      alerts.push({
        type: 'info' as const,
        icon: '����',
        title: 'High Humidity',
        message: `Humidity level: ${current.relative_humidity_2m}%`,
      });
    }

    // Upcoming precipitation alert
    const nextHourPrecipitation = hourly.precipitation_probability[1] || 0;
    if (nextHourPrecipitation > 70) {
      alerts.push({
        type: 'info' as const,
        icon: '☔',
        title: 'Rain Expected',
        message: `${nextHourPrecipitation}% chance of rain in the next hour`,
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  return (
    <SpaceBetween size="m">
      {alerts.length === 0 ? (
        <Box textAlign="center" padding="xl">
          <StatusIndicator type="success">
            <Box variant="h3" color="text-status-success">All Clear</Box>
          </StatusIndicator>
          <Box variant="p" margin={{ top: 's' }} color="text-body-secondary">
            No weather alerts at this time
          </Box>
        </Box>
      ) : (
        alerts.map((alert, index) => (
          <Alert
            key={index}
            type={alert.type}
            header={`${alert.icon} ${alert.title}`}
            dismissible
          >
            {alert.message}
          </Alert>
        ))
      )}

      <Box>
        <Box variant="h4" margin={{ bottom: 's' }}>Current Conditions Summary</Box>
        <SpaceBetween size="xs">
          <Box variant="small">
            🌡️ Temperature: {Math.round(current.temperature_2m)}°C (feels like {Math.round(current.apparent_temperature)}°C)
          </Box>
          <Box variant="small">
            💧 Humidity: {current.relative_humidity_2m}%
          </Box>
          <Box variant="small">
            💨 Wind: {Math.round(current.wind_speed_10m)} km/h
          </Box>
          <Box variant="small">
            🌧️ Precipitation: {current.precipitation} mm
          </Box>
          <Box variant="small">
            ☁️ Cloud Cover: {current.cloud_cover}%
          </Box>
        </SpaceBetween>
      </Box>
    </SpaceBetween>
  );
}

export const weatherAlerts: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 2 },
  data: {
    icon: 'notification',
    title: 'Weather Alerts',
    description: 'Weather conditions and alerts',
    header: WeatherAlertsHeader,
    content: WeatherAlertsWidget,
    staticMinHeight: 400,
  },
};
