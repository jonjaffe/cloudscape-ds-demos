// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';

import { WeatherAPI, WeatherData, WeatherLocation, DEFAULT_LOCATIONS } from '../services/weather-api';
import { CurrentWeatherWidget } from '../widgets/current-weather';
import { HourlyForecastWidget } from '../widgets/hourly-forecast';
import { DailyForecastWidget } from '../widgets/daily-forecast';
import { LocationSelector } from '../widgets/location-selector';

export function WeatherContent() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<WeatherLocation>(DEFAULT_LOCATIONS[0]);

  const fetchWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);

    try {
      const data = await WeatherAPI.getCurrentWeather(location);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(currentLocation);
  }, [currentLocation]);

  const handleLocationChange = (location: WeatherLocation) => {
    setCurrentLocation(location);
  };

  if (loading && !weatherData) {
    return (
      <Box textAlign="center" padding="xxl">
        <SpaceBetween size="m" alignItems="center">
          <Spinner size="large" />
          <Box variant="p">Loading weather data...</Box>
        </SpaceBetween>
      </Box>
    );
  }

  return (
    <SpaceBetween size="l">
      {error && <Alert type="error">{error}</Alert>}

      <Grid
        gridDefinition={[
          { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 4, xl: 4 } },
          { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 8, xl: 8 } },
        ]}
      >
        <LocationSelector currentLocation={currentLocation} onLocationChange={handleLocationChange} loading={loading} />
        {weatherData && <CurrentWeatherWidget weather={weatherData.current} location={weatherData.location} />}
      </Grid>

      {weatherData && (
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
            { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
          ]}
        >
          <HourlyForecastWidget forecast={weatherData.hourly} />
          <DailyForecastWidget forecast={weatherData.daily} />
        </Grid>
      )}
    </SpaceBetween>
  );
}
