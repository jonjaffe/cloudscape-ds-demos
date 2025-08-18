// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Select from '@cloudscape-design/components/select';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';

import { CurrentWeatherWidget } from './widgets/current-weather-widget';
import { HourlyForecastWidget } from './widgets/hourly-forecast-widget';
import { DailyForecastWidget } from './widgets/daily-forecast-widget';
import { WeatherMapWidget } from './widgets/weather-map-widget';
import { WeatherStatsWidget } from './widgets/weather-stats-widget';

import { WeatherApiService, DEFAULT_LOCATIONS } from '../weather-api';
import { WeatherResponse, WeatherLocation } from '../types';

export function WeatherContent() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locationOptions = DEFAULT_LOCATIONS.map(location => ({
    label: `${location.name}, ${location.country}`,
    value: location.name,
    description: `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`,
  }));

  const loadWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await WeatherApiService.getCompleteWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (selectedOption: any) => {
    const location = DEFAULT_LOCATIONS.find(loc => loc.name === selectedOption.detail.selectedOption.value);
    if (location) {
      setSelectedLocation(location);
    }
  };

  if (error) {
    return (
      <Alert
        type="error"
        header="Weather Data Error"
        action={{
          children: 'Retry',
          onClick: () => loadWeatherData(selectedLocation),
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <SpaceBetween size="l">
      <Grid gridDefinition={[{ colspan: { default: 12, s: 6, m: 4 } }]}>
        <Box>
          <Select
            selectedOption={locationOptions.find(opt => opt.value === selectedLocation.name) || null}
            onChange={handleLocationChange}
            options={locationOptions}
            placeholder="Choose a location"
            expandToViewport={true}
            filteringType="auto"
          />
        </Box>
      </Grid>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, s: 12, m: 6, l: 4 } },
          { colspan: { default: 12, s: 12, m: 6, l: 4 } },
          { colspan: { default: 12, s: 12, m: 12, l: 4 } },
        ]}
      >
        <CurrentWeatherWidget 
          data={weatherData?.current_weather} 
          location={selectedLocation}
          loading={loading}
        />
        <WeatherStatsWidget 
          data={weatherData} 
          loading={loading}
        />
        <WeatherMapWidget 
          location={selectedLocation}
          loading={loading}
        />
      </Grid>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 8 } },
          { colspan: { default: 12, l: 4 } },
        ]}
      >
        <HourlyForecastWidget 
          data={weatherData?.hourly} 
          timezone={weatherData?.timezone}
          loading={loading}
        />
        <DailyForecastWidget 
          data={weatherData?.daily} 
          timezone={weatherData?.timezone}
          loading={loading}
        />
      </Grid>
    </SpaceBetween>
  );
}
