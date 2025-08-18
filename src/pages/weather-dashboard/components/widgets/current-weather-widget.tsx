// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';
import Spinner from '@cloudscape-design/components/spinner';

import { CurrentWeather, WeatherLocation, WEATHER_CODES } from '../../types';

interface CurrentWeatherWidgetProps {
  data?: CurrentWeather;
  location: WeatherLocation;
  loading: boolean;
}

export function CurrentWeatherWidget({ data, location, loading }: CurrentWeatherWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box textAlign="center" color="text-status-error">
          No weather data available
        </Box>
      </Container>
    );
  }

  const weatherInfo = WEATHER_CODES[data.weathercode] || { description: 'Unknown', icon: 'question' };
  const isDaytime = data.is_day === 1;

  return (
    <Container
      header={
        <Header variant="h2" info={<Badge color={isDaytime ? 'blue' : 'grey'}>{isDaytime ? 'Day' : 'Night'}</Badge>}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box variant="h1" textAlign="center" fontSize="heading-xl">
          <SpaceBetween direction="horizontal" size="s" alignItems="center">
            <Icon name={weatherInfo.icon} size="large" />
            <span>{Math.round(data.temperature)}°C</span>
          </SpaceBetween>
        </Box>

        <Box textAlign="center">
          <Box variant="h3" color="text-status-info">
            {location.name}
          </Box>
          <Box variant="p" color="text-body-secondary">
            {weatherInfo.description}
          </Box>
        </Box>

        <SpaceBetween size="s">
          <Box>
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Icon name="status-positive" />
              <span>Wind: {Math.round(data.windspeed)} km/h</span>
            </SpaceBetween>
          </Box>
          <Box>
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Icon name="angle" />
              <span>Direction: {data.winddirection}°</span>
            </SpaceBetween>
          </Box>
          <Box>
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Icon name="status-info" />
              <span>Updated: {new Date(data.time).toLocaleTimeString()}</span>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
