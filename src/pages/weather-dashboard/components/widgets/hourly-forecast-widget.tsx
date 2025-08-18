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

import { HourlyData, WEATHER_CODES } from '../../types';

interface HourlyForecastWidgetProps {
  data?: HourlyData;
  timezone?: string;
  loading: boolean;
}

export function HourlyForecastWidget({ data, timezone, loading }: HourlyForecastWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  if (!data || !data.time) {
    return (
      <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
        <Box textAlign="center" color="text-status-error">
          No forecast data available
        </Box>
      </Container>
    );
  }

  // Show next 24 hours
  const hourlyItems = data.time.slice(0, 24).map((time, index) => {
    const hour = new Date(time);
    const temp = Math.round(data.temperature_2m[index]);
    const precipitation = data.precipitation[index];
    const weatherCode = data.weathercode[index];
    const windSpeed = Math.round(data.windspeed_10m[index]);
    const humidity = (data as any).relative_humidity_2m ? (data as any).relative_humidity_2m[index] : 0;

    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: 'question' };

    return {
      time: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp,
      precipitation,
      weatherInfo,
      windSpeed,
      humidity,
      isCurrentHour: index === 0,
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="Hourly weather forecast for the next 24 hours">
          24-Hour Forecast
        </Header>
      }
    >
      <Box>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', padding: '8px 0' }}>
          {hourlyItems.map((item, index) => (
            <div
              key={index}
              style={{
                minWidth: '120px',
                padding: '12px',
                border: '1px solid var(--color-border-divider-default)',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: item.isCurrentHour
                  ? 'var(--color-background-layout-toggle-selected-default)'
                  : 'transparent',
              }}
            >
              <SpaceBetween size="xs">
                <Box variant="small" color={item.isCurrentHour ? 'text-status-info' : 'text-body-secondary'}>
                  {item.time}
                  {item.isCurrentHour && (
                    <Badge color="blue" style={{ marginLeft: '4px' }}>
                      Now
                    </Badge>
                  )}
                </Box>

                <Icon name={item.weatherInfo.icon} size="medium" />

                <Box variant="h4">{item.temp}°C</Box>

                <SpaceBetween size="xxs">
                  <Box variant="small">💧 {item.precipitation}mm</Box>
                  <Box variant="small">💨 {item.windSpeed}km/h</Box>
                  {item.humidity > 0 && <Box variant="small">💦 {Math.round(item.humidity)}%</Box>}
                </SpaceBetween>
              </SpaceBetween>
            </div>
          ))}
        </div>
      </Box>
    </Container>
  );
}
