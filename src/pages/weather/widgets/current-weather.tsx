// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';

import { CurrentWeather, WeatherLocation, WeatherAPI } from '../services/weather-api';

interface CurrentWeatherWidgetProps {
  weather: CurrentWeather;
  location: WeatherLocation;
}

export function CurrentWeatherWidget({ weather, location }: CurrentWeatherWidgetProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  return (
    <Container
      header={
        <Header variant="h2" description={`${location.name}, ${location.country || ''}`}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={4} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Temperature</Box>
            <Box fontSize="heading-xl" fontWeight="bold">
              {Math.round(weather.temperature)}°C
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Conditions</Box>
            <Badge color="blue">{WeatherAPI.getWeatherDescription(weather.weatherCode)}</Badge>
          </div>
          <div>
            <Box variant="awsui-key-label">Humidity</Box>
            <Box fontSize="heading-m">{weather.humidity}%</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Wind Speed</Box>
            <Box fontSize="heading-m">{Math.round(weather.windSpeed)} km/h</Box>
          </div>
        </ColumnLayout>

        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Wind Direction</Box>
            <Box fontSize="heading-s">{weather.windDirection}°</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Precipitation</Box>
            <Box fontSize="heading-s">{weather.precipitation} mm</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Last Updated</Box>
            <Box fontSize="heading-s">{formatTime(weather.time)}</Box>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
