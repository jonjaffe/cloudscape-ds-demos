// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Grid from '@cloudscape-design/components/grid';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Link from '@cloudscape-design/components/link';

interface LocationResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
    precipitation: number[];
    windspeed_10m: number[];
  };
}

const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Slight snow', icon: '❄️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌧️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '❄️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with hail', icon: '⛈️' },
};

export default function WeatherDashboard() {
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search for locations using Geocoding API
  const searchLocations = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setSearchLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en`
      );
      const data = await response.json();

      if (data.results) {
        setLocationSuggestions(data.results);
      } else {
        setLocationSuggestions([]);
      }
    } catch (err) {
      setError('Failed to search locations. Please try again.');
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch weather data for a selected location
  const fetchWeatherData = async (location: LocationResult) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${location.latitude}&longitude=${location.longitude}&` +
        `current_weather=true&` +
        `hourly=temperature_2m,weathercode,precipitation,windspeed_10m&` +
        `timezone=${encodeURIComponent(location.timezone || 'auto')}`
      );
      const data = await response.json();
      setWeatherData(data);
      setSelectedLocation(location);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (detail: { value: string }) => {
    const suggestion = locationSuggestions.find(s => s.id.toString() === detail.value);

    if (suggestion) {
      setLocationSearch('');
      setLocationSuggestions([]);
      fetchWeatherData(suggestion);
    }
  };

  const getWeatherDescription = (code: number) => {
    return weatherCodes[code] || { description: 'Unknown', icon: '❓' };
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header variant="h1">
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            {/* Location Search */}
            <Container header={<Header variant="h2">Search Weather by Location</Header>}>
              <SpaceBetween size="m">
                <Autosuggest
                  onChange={e => {
                    setLocationSearch(e.detail.value);
                    searchLocations(e.detail.value);
                  }}
                  value={locationSearch}
                  options={locationSuggestions.map(location => ({
                    value: location.id.toString(),
                    label: `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`,
                  }))}
                  onSelect={handleLocationSelect}
                  placeholder="Search for a city or location..."
                  empty={searchLoading ? <Spinner /> : 'No matches found'}
                  loadingText={searchLoading ? 'Searching...' : undefined}
                  statusText={`${locationSuggestions.length} location${locationSuggestions.length !== 1 ? 's' : ''} found`}
                />
              </SpaceBetween>
            </Container>

            {/* Error Alert */}
            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Weather Display */}
            {loading ? (
              <Container>
                <Box textAlign="center" padding="l">
                  <Spinner />
                </Box>
              </Container>
            ) : weatherData && selectedLocation ? (
              <SpaceBetween size="l">
                {/* Current Weather */}
                <Container
                  header={
                    <Header variant="h2">
                      {selectedLocation.name}
                      {selectedLocation.admin1 && `, ${selectedLocation.admin1}`}, {selectedLocation.country}
                    </Header>
                  }
                >
                  <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 6, m: 6, l: 6 } }]}>
                    <Box padding="m">
                      <SpaceBetween size="m">
                        <Box>
                          <Box variant="h3" color="text-status-info">
                            {getWeatherDescription(weatherData.current_weather.weathercode).icon}
                            {' '}
                            Current Weather
                          </Box>
                        </Box>
                        <Box>
                          <Box variant="h1" color="text-body-default">
                            {Math.round(weatherData.current_weather.temperature)}°C
                          </Box>
                        </Box>
                        <Box>
                          <Box variant="p">
                            {getWeatherDescription(weatherData.current_weather.weathercode).description}
                          </Box>
                        </Box>
                        <Box>
                          <Box variant="p">
                            Wind Speed: {Math.round(weatherData.current_weather.windspeed)} km/h
                          </Box>
                          <Box variant="p">
                            Wind Direction: {weatherData.current_weather.winddirection}°
                          </Box>
                        </Box>
                      </SpaceBetween>
                    </Box>
                    <Box padding="m">
                      <SpaceBetween size="m">
                        <Box variant="h3">Details</Box>
                        <ColumnLayout columns={2} variant="text-grid">
                          <div>
                            <Box variant="awsui-key-label">Timezone</Box>
                            <Box variant="p">{weatherData.timezone}</Box>
                          </div>
                          <div>
                            <Box variant="awsui-key-label">Updated</Box>
                            <Box variant="p">{formatTime(weatherData.current_weather.time)}</Box>
                          </div>
                        </ColumnLayout>
                      </SpaceBetween>
                    </Box>
                  </Grid>
                </Container>

                {/* Hourly Forecast */}
                <Container header={<Header variant="h2">Hourly Forecast (Next 24 Hours)</Header>}>
                  <Box padding="m">
                    <SpaceBetween size="m">
                      {weatherData.hourly.time.slice(0, 24).map((time, index) => (
                        <Box
                          key={time}
                          padding="s"
                          variant="div"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: index < 23 ? '1px solid #e5e5e5' : 'none',
                          }}
                        >
                          <Box>
                            <Box variant="p" fontWeight="bold">
                              {formatTime(time)}
                            </Box>
                          </Box>
                          <Box style={{ textAlign: 'center' }}>
                            <Box variant="p">
                              {getWeatherDescription(weatherData.hourly.weathercode[index]).icon}
                            </Box>
                            <Box variant="small">
                              {getWeatherDescription(weatherData.hourly.weathercode[index]).description}
                            </Box>
                          </Box>
                          <Box style={{ textAlign: 'right' }}>
                            <Box variant="p" fontWeight="bold">
                              {Math.round(weatherData.hourly.temperature_2m[index])}°C
                            </Box>
                            <Box variant="small">
                              {weatherData.hourly.windspeed_10m[index]} km/h
                            </Box>
                          </Box>
                          <Box style={{ textAlign: 'right' }}>
                            <Box variant="small">
                              Precipitation: {weatherData.hourly.precipitation[index]} mm
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </SpaceBetween>
                  </Box>
                </Container>

                {/* Attribution */}
                <Box variant="p" color="text-body-secondary">
                  Weather data provided by{' '}
                  <Link external href="https://open-meteo.com/">
                    Open-Meteo
                  </Link>
                  . No API key required. Non-commercial use only.
                </Box>
              </SpaceBetween>
            ) : (
              !loading && (
                <Container>
                  <Box padding="l" textAlign="center">
                    <Box variant="p" color="text-body-secondary">
                      Search for a location to view weather data
                    </Box>
                  </Box>
                </Container>
              )
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
