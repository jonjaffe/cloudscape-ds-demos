// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Cards from '@cloudscape-design/components/cards';
import Badge from '@cloudscape-design/components/badge';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import { WeatherData, Location, getWeatherDescription, getWeatherIcon } from './api';

interface WeatherDisplayProps {
  location: Location;
  weather: WeatherData;
}

export function WeatherDisplay({ location, weather }: WeatherDisplayProps) {
  const current = weather.current_weather;
  const daily = weather.daily;
  const today = new Date(daily.time[0]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const dailyForecasts = daily.time.slice(0, 7).map((time, index) => ({
    date: time,
    dateFormatted: formatDate(time),
    maxTemp: Math.round(daily.temperature_2m_max[index]),
    minTemp: Math.round(daily.temperature_2m_min[index]),
    precipitation: daily.precipitation_sum[index],
    weatherCode: daily.weathercode[index],
  }));

  return (
    <SpaceBetween size="l">
      {/* Current Weather */}
      <Container
        header={
          <Header
            variant="h2"
            description={`${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`}
          >
            Current Weather
          </Header>
        }
      >
        <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 6, m: 6, l: 3 } }]}>
          <Box textAlign="center" padding={{ vertical: 'l', horizontal: 'm' }}>
            <div
              style={{
                fontSize: '64px',
                marginBottom: '12px',
              }}
            >
              {getWeatherIcon(current.weathercode, current.is_day)}
            </div>
            <Box variant="h3" margin={{ bottom: 's' }}>
              {Math.round(current.temperature)}°F
            </Box>
            <Box variant="p" color="text-body-secondary" margin={{ bottom: 'm' }}>
              {getWeatherDescription(current.weathercode)}
            </Box>
            <Badge content="Current" color="blue" />
          </Box>

          <Box padding={{ vertical: 'l', horizontal: 'm' }}>
            <Box margin={{ bottom: 's' }}>
              <Box variant="small" color="text-body-secondary">
                Wind Speed
              </Box>
              <Box variant="h4">{Math.round(current.windspeed)} mph</Box>
            </Box>

            <Box margin={{ bottom: 's' }}>
              <Box variant="small" color="text-body-secondary">
                Temperature Range (Today)
              </Box>
              <Box variant="h4">
                {dailyForecasts[0].maxTemp}°F / {dailyForecasts[0].minTemp}°F
              </Box>
            </Box>

            <Box>
              <Box variant="small" color="text-body-secondary">
                Precipitation
              </Box>
              <Box variant="h4">{dailyForecasts[0].precipitation.toFixed(2)} in</Box>
            </Box>
          </Box>

          <Box padding={{ vertical: 'l', horizontal: 'm' }}>
            <Box margin={{ bottom: 's' }}>
              <Box variant="small" color="text-body-secondary">
                Coordinates
              </Box>
              <Box variant="h4">{weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°W</Box>
            </Box>

            <Box margin={{ bottom: 's' }}>
              <Box variant="small" color="text-body-secondary">
                Timezone
              </Box>
              <Box variant="h4">{weather.timezone}</Box>
            </Box>
          </Box>
        </Grid>
      </Container>

      {/* 7-Day Forecast */}
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Cards
          cardDefinition={{
            header: item => (
              <Box margin={{ bottom: 's' }}>
                <strong>{item.dateFormatted}</strong>
              </Box>
            ),
            sections: [
              {
                id: 'icon',
                content: item => (
                  <Box
                    textAlign="center"
                    padding={{ vertical: 'm' }}
                    style={{
                      fontSize: '48px',
                    }}
                  >
                    {getWeatherIcon(item.weatherCode)}
                  </Box>
                ),
              },
              {
                id: 'conditions',
                content: item => (
                  <Box padding={{ vertical: 's' }}>
                    <Box margin={{ bottom: 's' }}>
                      <Box variant="small" color="text-body-secondary">
                        Conditions
                      </Box>
                      <Box variant="p">{getWeatherDescription(item.weatherCode)}</Box>
                    </Box>
                  </Box>
                ),
              },
              {
                id: 'temperatures',
                content: item => (
                  <Box padding={{ vertical: 's' }}>
                    <Box margin={{ bottom: 's' }}>
                      <Box variant="small" color="text-body-secondary">
                        Temperature
                      </Box>
                      <Box variant="h4">
                        {item.maxTemp}°F / {item.minTemp}°F
                      </Box>
                    </Box>

                    <Box>
                      <Box variant="small" color="text-body-secondary">
                        Precipitation
                      </Box>
                      <Box variant="p">{item.precipitation.toFixed(2)} in</Box>
                    </Box>
                  </Box>
                ),
              },
            ],
          }}
          items={dailyForecasts}
          cardsPerRow={[
            { cards: 1, minWidth: 0 },
            { cards: 2, minWidth: 600 },
            { cards: 3, minWidth: 900 },
            { cards: 4, minWidth: 1200 },
          ]}
          trackBy="date"
          visibleSections={['icon', 'conditions', 'temperatures']}
        />
      </Container>
    </SpaceBetween>
  );
}
