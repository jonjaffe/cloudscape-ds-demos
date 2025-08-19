// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import AreaChart from '@cloudscape-design/components/area-chart';
import LineChart from '@cloudscape-design/components/line-chart';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import ColumnLayout from '@cloudscape-design/components/column-layout';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
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

const WEATHER_CODES: { [key: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  95: 'Thunderstorm',
};

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [locationName, setLocationName] = useState('New York, NY');

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7&temperature_unit=fahrenheit`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getCurrentWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 75) return '❄️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  };

  const formatTemperatureChart = () => {
    if (!weatherData?.hourly) return [];
    
    return weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time),
      y: weatherData.hourly.temperature_2m[index],
    }));
  };

  const formatDailyTemperatureChart = () => {
    if (!weatherData?.daily) return [];
    
    return weatherData.daily.time.map((time, index) => ({
      x: new Date(time),
      y: weatherData.daily.temperature_2m_max[index],
    }));
  };

  const formatPrecipitationChart = () => {
    if (!weatherData?.hourly) return [];
    
    return weatherData.hourly.time.slice(0, 24).map((time, index) => ({
      x: new Date(time),
      y: weatherData.hourly.precipitation_probability[index],
    }));
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Real-time weather data and forecasts powered by Open-Meteo API"
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <SpaceBetween size="m">
                <Box variant="h2">Location Settings</Box>
                <ColumnLayout columns={4}>
                  <FormField label="Latitude">
                    <Input
                      value={latitude}
                      onChange={({ detail }) => setLatitude(detail.value)}
                      placeholder="40.7128"
                    />
                  </FormField>
                  <FormField label="Longitude">
                    <Input
                      value={longitude}
                      onChange={({ detail }) => setLongitude(detail.value)}
                      placeholder="-74.0060"
                    />
                  </FormField>
                  <FormField label="Location Name">
                    <Input
                      value={locationName}
                      onChange={({ detail }) => setLocationName(detail.value)}
                      placeholder="New York, NY"
                    />
                  </FormField>
                  <FormField label="Update">
                    <Button variant="primary" onClick={fetchWeatherData} loading={loading}>
                      Fetch Weather
                    </Button>
                  </FormField>
                </ColumnLayout>
              </SpaceBetween>
            </Container>

            {error && (
              <Alert type="error" header="Error loading weather data">
                {error}
              </Alert>
            )}

            {loading && !weatherData && (
              <Container>
                <Box textAlign="center" padding="xl">
                  <Spinner size="large" />
                  <Box variant="p" padding={{ top: 's' }}>
                    Loading weather data...
                  </Box>
                </Box>
              </Container>
            )}

            {weatherData && (
              <>
                <Container>
                  <SpaceBetween size="m">
                    <Box variant="h2">Current Weather - {locationName}</Box>
                    <Grid gridDefinition={[
                      { colspan: { default: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
                      { colspan: { default: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
                      { colspan: { default: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
                      { colspan: { default: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
                    ]}>
                      <Box textAlign="center" padding="s">
                        <Box fontSize="display-l">{getCurrentWeatherIcon(weatherData.current.weather_code)}</Box>
                        <Box variant="h3">{Math.round(weatherData.current.temperature_2m)}°F</Box>
                        <Box variant="small">{WEATHER_CODES[weatherData.current.weather_code] || 'Unknown'}</Box>
                      </Box>
                      <Box textAlign="center" padding="s">
                        <Box variant="h4">Feels like</Box>
                        <Box variant="h3">{Math.round(weatherData.current.apparent_temperature)}°F</Box>
                      </Box>
                      <Box textAlign="center" padding="s">
                        <Box variant="h4">Humidity</Box>
                        <Box variant="h3">{weatherData.current.relative_humidity_2m}%</Box>
                      </Box>
                      <Box textAlign="center" padding="s">
                        <Box variant="h4">Wind Speed</Box>
                        <Box variant="h3">{Math.round(weatherData.current.wind_speed_10m)} km/h</Box>
                      </Box>
                    </Grid>
                  </SpaceBetween>
                </Container>

                <Grid gridDefinition={[
                  { colspan: { default: 12, l: 6, xl: 6 } },
                  { colspan: { default: 12, l: 6, xl: 6 } },
                ]}>
                  <Container>
                    <LineChart
                      series={[
                        {
                          title: 'Temperature (°F)',
                          type: 'line',
                          data: formatTemperatureChart(),
                        },
                      ]}
                      xDomain={[
                        formatTemperatureChart()[0]?.x,
                        formatTemperatureChart()[formatTemperatureChart().length - 1]?.x,
                      ]}
                      yTitle="Temperature (°F)"
                      xTitle="Time"
                      height={300}
                      hideFilter
                      hideLegend
                      i18nStrings={{
                        filterLabel: 'Filter displayed data',
                        filterPlaceholder: 'Filter data',
                        filterSelectedAriaLabel: 'selected',
                        legendAriaLabel: 'Legend',
                        chartAriaRoleDescription: '24-hour temperature forecast in Fahrenheit',
                      }}
                    />
                  </Container>

                  <Container>
                    <AreaChart
                      series={[
                        {
                          title: 'Precipitation Probability (%)',
                          type: 'area',
                          data: formatPrecipitationChart(),
                        },
                      ]}
                      xDomain={[
                        formatPrecipitationChart()[0]?.x,
                        formatPrecipitationChart()[formatPrecipitationChart().length - 1]?.x,
                      ]}
                      yTitle="Probability (%)"
                      xTitle="Time"
                      height={300}
                      hideFilter
                      hideLegend
                      i18nStrings={{
                        filterLabel: 'Filter displayed data',
                        filterPlaceholder: 'Filter data',
                        filterSelectedAriaLabel: 'selected',
                        legendAriaLabel: 'Legend',
                        chartAriaRoleDescription: '24-hour precipitation probability',
                      }}
                    />
                  </Container>
                </Grid>

                <Container>
                  <SpaceBetween size="m">
                    <Box variant="h2">7-Day Forecast</Box>
                    <Grid gridDefinition={weatherData.daily.time.map(() => ({ colspan: { default: 12, xs: 6, s: 4, m: 3, l: 2, xl: 2 } }))}>
                      {weatherData.daily.time.map((date, index) => (
                        <Box key={date} textAlign="center" padding="s">
                          <Box variant="small">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </Box>
                          <Box fontSize="heading-m" padding={{ top: 'xs', bottom: 'xs' }}>
                            {getCurrentWeatherIcon(weatherData.daily.weather_code[index])}
                          </Box>
                          <Box variant="small">
                            <strong>{Math.round(weatherData.daily.temperature_2m_max[index])}°</strong> /{' '}
                            {Math.round(weatherData.daily.temperature_2m_min[index])}°
                          </Box>
                          <Box variant="small" color="text-status-info">
                            {Math.round(weatherData.daily.precipitation_sum[index])}mm
                          </Box>
                        </Box>
                      ))}
                    </Grid>
                  </SpaceBetween>
                </Container>

                <Container>
                  <LineChart
                    series={[
                      {
                        title: 'Daily High Temperature (°F)',
                        type: 'line',
                        data: formatDailyTemperatureChart(),
                      },
                    ]}
                    xDomain={[
                      formatDailyTemperatureChart()[0]?.x,
                      formatDailyTemperatureChart()[formatDailyTemperatureChart().length - 1]?.x,
                    ]}
                    yTitle="Temperature (°F)"
                    xTitle="Date"
                    height={300}
                    hideFilter
                    hideLegend
                    i18nStrings={{
                      filterLabel: 'Filter displayed data',
                      filterPlaceholder: 'Filter data',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: '7-day temperature forecast in Fahrenheit',
                    }}
                  />
                </Container>
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
