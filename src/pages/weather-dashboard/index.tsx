// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useCallback } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Button from '@cloudscape-design/components/button';
import Flashbar from '@cloudscape-design/components/flashbar';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import { CitySearch } from './city-search';
import { WeatherDisplay } from './weather-display';
import { Location, WeatherData, getWeatherForecast } from './api';

export default function WeatherDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleLocationSelect = useCallback(async (location: Location) => {
    setSelectedLocation(location);
    setLoading(true);
    setError(null);

    try {
      const forecast = await getWeatherForecast(location.latitude, location.longitude);
      setWeather(forecast);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSelectedLocation(null);
    setWeather(null);
    setError(null);
  }, []);

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header variant="h1">Weather Dashboard</Header>
              <Flashbar
                items={[
                  {
                    type: 'info',
                    content:
                      'Get current weather conditions and 7-day forecasts for any location worldwide. Powered by Open-Meteo API.',
                    dismissible: true,
                  },
                ]}
              />
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            {/* Search Section */}
            <Container header={<Header variant="h2">Search Location</Header>}>
              <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 6, m: 5, l: 4 } }]}>
                <SpaceBetween size="m">
                  <CitySearch onLocationSelect={handleLocationSelect} loading={loading} />
                  {selectedLocation && (
                    <Button onClick={handleReset} variant="normal">
                      Clear Selection
                    </Button>
                  )}
                </SpaceBetween>
              </Grid>
            </Container>

            {/* Loading State */}
            {loading && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'l' }}>
                  <Spinner size="large" />
                  <Box variant="p" margin={{ top: 'm' }}>
                    Loading weather data...
                  </Box>
                </Box>
              </Container>
            )}

            {/* Error State */}
            {error && !loading && (
              <Alert type="error" header="Unable to Load Weather Data">
                {error}. Please try selecting a different location.
              </Alert>
            )}

            {/* Weather Display */}
            {weather && selectedLocation && !loading && (
              <WeatherDisplay location={selectedLocation} weather={weather} />
            )}

            {/* Initial State */}
            {!selectedLocation && !loading && !error && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'xxl', horizontal: 'l' }}>
                  <Box variant="h3" margin={{ bottom: 'm' }}>
                    Search for a city to get started
                  </Box>
                  <Box variant="p" color="text-body-secondary">
                    Use the search box above to find any city worldwide and view its current weather and 7-day forecast.
                  </Box>
                </Box>
              </Container>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
