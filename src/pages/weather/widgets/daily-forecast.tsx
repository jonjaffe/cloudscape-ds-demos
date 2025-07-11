// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { DailyForecast, WeatherAPI } from '../services/weather-api';

interface DailyForecastWidgetProps {
  forecast: DailyForecast;
}

export function DailyForecastWidget({ forecast }: DailyForecastWidgetProps) {
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
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const items = forecast.time.map((time, index) => ({
    date: time,
    displayDate: formatDate(time),
    temperatureMax: forecast.temperatureMax[index],
    temperatureMin: forecast.temperatureMin[index],
    precipitation: forecast.precipitation[index],
    windSpeedMax: forecast.windSpeedMax[index],
    weatherCode: forecast.weatherCode[index],
    conditions: WeatherAPI.getWeatherDescription(forecast.weatherCode[index]),
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="7-day outlook">
          Daily Forecast
        </Header>
      }
    >
      <Cards
        ariaLabels={{
          itemSelectionLabel: (e, n) => `select ${n.displayDate}`,
          selectionGroupLabel: 'Daily forecast selection',
        }}
        cardDefinition={{
          header: item => (
            <Box fontSize="heading-s" fontWeight="bold">
              {item.displayDate}
            </Box>
          ),
          sections: [
            {
              id: 'temperature',
              content: item => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Box variant="span" fontSize="heading-m" fontWeight="bold">
                    {Math.round(item.temperatureMax)}°
                  </Box>
                  <Box variant="span" color="text-body-secondary">
                    / {Math.round(item.temperatureMin)}°
                  </Box>
                </SpaceBetween>
              ),
            },
            {
              id: 'conditions',
              content: item => <Badge color="blue">{item.conditions}</Badge>,
            },
            {
              id: 'details',
              content: item => (
                <SpaceBetween size="xs">
                  <Box variant="small">Precipitation: {item.precipitation} mm</Box>
                  <Box variant="small">Wind: {Math.round(item.windSpeedMax)} km/h</Box>
                </SpaceBetween>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 400 },
          { cards: 3, minWidth: 600 },
          { cards: 4, minWidth: 800 },
          { cards: 7, minWidth: 1200 },
        ]}
        items={items}
        loadingText="Loading forecast..."
        trackBy="date"
        visibleSections={['temperature', 'conditions', 'details']}
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No forecast data available
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
