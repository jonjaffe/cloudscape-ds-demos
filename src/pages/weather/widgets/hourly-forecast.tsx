// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';

import { HourlyForecast } from '../services/weather-api';

interface HourlyForecastWidgetProps {
  forecast: HourlyForecast;
}

export function HourlyForecastWidget({ forecast }: HourlyForecastWidgetProps) {
  const formatHour = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const items = forecast.time.map((time, index) => ({
    time,
    temperature: forecast.temperature[index],
    humidity: forecast.humidity[index],
    precipitation: forecast.precipitation[index],
    windSpeed: forecast.windSpeed[index],
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="Next 24 hours">
          Hourly Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'time',
            header: 'Time',
            cell: item => formatHour(item.time),
            sortingField: 'time',
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: item => `${Math.round(item.temperature)}°C`,
            sortingField: 'temperature',
          },
          {
            id: 'humidity',
            header: 'Humidity',
            cell: item => `${item.humidity}%`,
            sortingField: 'humidity',
          },
          {
            id: 'precipitation',
            header: 'Precipitation',
            cell: item => <Badge color={item.precipitation > 0 ? 'blue' : 'grey'}>{item.precipitation} mm</Badge>,
            sortingField: 'precipitation',
          },
          {
            id: 'windSpeed',
            header: 'Wind Speed',
            cell: item => `${Math.round(item.windSpeed)} km/h`,
            sortingField: 'windSpeed',
          },
        ]}
        items={items.slice(0, 12)} // Show next 12 hours
        loadingText="Loading forecast..."
        sortingDisabled
        empty="No forecast data available"
        variant="embedded"
      />
    </Container>
  );
}
