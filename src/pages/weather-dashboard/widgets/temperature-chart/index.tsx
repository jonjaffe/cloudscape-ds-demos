// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData, WeatherService } from '../../services/weather-api';
import { WeatherWidgetConfig } from '../interfaces';

function TemperatureChartHeader() {
  return (
    <Header variant="h2" description="24-hour temperature trend">
      Temperature Trend
    </Header>
  );
}

function TemperatureChartWidget() {
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
          Loading temperature data...
        </Box>
      </Box>
    );
  }

  if (error || !weatherData) {
    return (
      <Alert type="error" header="Failed to load temperature data">
        {error || 'An unknown error occurred'}
      </Alert>
    );
  }

  const { hourly } = weatherData;

  // Get next 24 hours of data
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time),
    y: hourly.temperature_2m[index],
  }));

  const chartData = [
    {
      title: 'Temperature',
      type: 'line' as const,
      data: next24Hours,
      valueFormatter: (value: number) => `${Math.round(value)}°C`,
    },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  return (
    <Box padding="s">
      <LineChart
        series={chartData}
        xDomain={[next24Hours[0]?.x, next24Hours[next24Hours.length - 1]?.x]}
        yDomain={[
          Math.min(...next24Hours.map(d => d.y)) - 2,
          Math.max(...next24Hours.map(d => d.y)) + 2,
        ]}
        i18nStrings={{
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'Line chart showing temperature over the next 24 hours',
          xTickFormatter: formatTime,
          yTickFormatter: (value) => `${Math.round(value)}°C`,
        }}
        ariaLabel="Temperature trend over next 24 hours"
        errorText="Error loading data."
        height={300}
        loadingText="Loading chart"
        recoveryText="Retry"
        xScaleType="time"
        xTitle="Time"
        yTitle="Temperature (°C)"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              There is no temperature data available
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box variant="p" color="inherit">
              Try adjusting the filters
            </Box>
          </Box>
        }
      />
    </Box>
  );
}

export const temperatureChart: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 4 },
  data: {
    icon: 'trending-up',
    title: 'Temperature Chart',
    description: '24-hour temperature trend',
    header: TemperatureChartHeader,
    content: TemperatureChartWidget,
    staticMinHeight: 400,
  },
};
