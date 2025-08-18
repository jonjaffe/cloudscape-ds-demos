// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherResponse } from '../../types';

interface WeatherStatsWidgetProps {
  data?: WeatherResponse;
  loading: boolean;
}

export function WeatherStatsWidget({ data, loading }: WeatherStatsWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Weather Stats</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container header={<Header variant="h2">Weather Stats</Header>}>
        <Box textAlign="center" color="text-status-error">
          No data available
        </Box>
      </Container>
    );
  }

  // Calculate stats from hourly data
  const hourlyData = data.hourly;
  let avgTemp = 0;
  let maxTemp = -Infinity;
  let minTemp = Infinity;
  let totalPrecipitation = 0;
  let maxWind = 0;

  if (hourlyData) {
    // Take first 24 hours for daily stats
    const temps = hourlyData.temperature_2m.slice(0, 24);
    const precip = hourlyData.precipitation.slice(0, 24);
    const winds = hourlyData.windspeed_10m.slice(0, 24);

    avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    maxTemp = Math.max(...temps);
    minTemp = Math.min(...temps);
    totalPrecipitation = precip.reduce((a, b) => a + b, 0);
    maxWind = Math.max(...winds);
  }

  const statsItems = [
    {
      label: 'Location',
      value: `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`,
    },
    {
      label: 'Timezone',
      value: data.timezone_abbreviation,
    },
    {
      label: 'Elevation',
      value: `${data.elevation}m`,
    },
    {
      label: "Today's High",
      value: `${Math.round(maxTemp)}°C`,
    },
    {
      label: "Today's Low",
      value: `${Math.round(minTemp)}°C`,
    },
    {
      label: 'Average Temp',
      value: `${Math.round(avgTemp)}°C`,
    },
    {
      label: 'Precipitation (24h)',
      value: `${totalPrecipitation.toFixed(1)}mm`,
    },
    {
      label: 'Max Wind (24h)',
      value: `${Math.round(maxWind)} km/h`,
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="24-hour weather statistics">
          Weather Stats
        </Header>
      }
    >
      <KeyValuePairs columns={2} items={statsItems} />
    </Container>
  );
}
