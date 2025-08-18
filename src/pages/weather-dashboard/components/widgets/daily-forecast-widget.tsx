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

import { DailyData, WEATHER_CODES } from '../../types';

interface DailyForecastWidgetProps {
  data?: DailyData;
  timezone?: string;
  loading: boolean;
}

export function DailyForecastWidget({ data, timezone, loading }: DailyForecastWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  if (!data || !data.time) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box textAlign="center" color="text-status-error">
          No forecast data available
        </Box>
      </Container>
    );
  }

  const dailyItems = data.time.slice(0, 7).map((time, index) => {
    const date = new Date(time);
    const maxTemp = Math.round(data.temperature_2m_max[index]);
    const minTemp = Math.round(data.temperature_2m_min[index]);
    const precipitation = data.precipitation_sum[index];
    const weatherCode = data.weathercode[index];
    const maxWind = Math.round(data.windspeed_10m_max[index]);

    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: 'question' };
    const isToday = index === 0;
    const isTomorrow = index === 1;

    let dayLabel = date.toLocaleDateString([], { weekday: 'short' });
    if (isToday) dayLabel = 'Today';
    else if (isTomorrow) dayLabel = 'Tomorrow';

    return {
      date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      day: dayLabel,
      maxTemp,
      minTemp,
      precipitation,
      weatherInfo,
      maxWind,
      isToday,
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="Daily weather forecast for the next 7 days">
          7-Day Forecast
        </Header>
      }
    >
      <SpaceBetween size="s">
        {dailyItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              border: '1px solid var(--color-border-divider-default)',
              borderRadius: '8px',
              backgroundColor: item.isToday ? 'var(--color-background-layout-toggle-selected-default)' : 'transparent',
            }}
          >
            <div style={{ flex: '1', minWidth: '80px' }}>
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <Box variant="h5">{item.day}</Box>
                {item.isToday && <Badge color="blue">Today</Badge>}
              </SpaceBetween>
              <Box variant="small" color="text-body-secondary">
                {item.date}
              </Box>
            </div>

            <div style={{ flex: '1', textAlign: 'center' }}>
              <SpaceBetween size="xs" alignItems="center">
                <Icon name={item.weatherInfo.icon} size="medium" />
                <Box variant="small" textAlign="center">
                  {item.weatherInfo.description}
                </Box>
              </SpaceBetween>
            </div>

            <div style={{ flex: '1', textAlign: 'right' }}>
              <SpaceBetween size="xs">
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Box variant="h5">{item.maxTemp}°</Box>
                  <Box variant="small" color="text-body-secondary">
                    {item.minTemp}°
                  </Box>
                </SpaceBetween>

                <SpaceBetween size="xs">
                  {item.precipitation > 0 && <Box variant="small">💧 {item.precipitation}mm</Box>}
                  <Box variant="small">💨 {item.maxWind}km/h</Box>
                </SpaceBetween>
              </SpaceBetween>
            </div>
          </div>
        ))}
      </SpaceBetween>
    </Container>
  );
}
