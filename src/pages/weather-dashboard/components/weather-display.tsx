import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import Spinner from '@cloudscape-design/components/spinner';
import { ForecastData, getWeatherDescription, getWeatherIcon } from '../api';
import '../styles/weather-display.scss';

interface WeatherDisplayProps {
  data: ForecastData | null;
  locationName: string;
  isLoading: boolean;
}

export function WeatherDisplay({ data, locationName, isLoading }: WeatherDisplayProps) {
  if (isLoading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  const current = data.current;
  const daily = data.daily;

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h2">
            Current Weather in {locationName}
          </Header>
        }
      >
        <Box className="current-weather">
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
            ]}
          >
            <Box className="weather-card">
              <div className="weather-icon">
                {getWeatherIcon(current.weather_code)}
              </div>
              <div className="weather-description">
                {getWeatherDescription(current.weather_code)}
              </div>
            </Box>
            <Box className="weather-card">
              <div className="weather-label">Temperature</div>
              <div className="weather-value">{Math.round(current.temperature_2m)}°F</div>
            </Box>
            <Box className="weather-card">
              <div className="weather-label">Humidity</div>
              <div className="weather-value">{current.relative_humidity_2m}%</div>
            </Box>
            <Box className="weather-card">
              <div className="weather-label">Wind Speed</div>
              <div className="weather-value">{Math.round(current.wind_speed_10m)} mph</div>
            </Box>
          </Grid>
        </Box>
      </Container>

      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box className="forecast-container">
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
              { colspan: { default: 12, s: 6, l: 3 } },
            ]}
          >
            {daily.time.map((date, index) => (
              <Box key={index} className="forecast-card">
                <div className="forecast-date">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(daily.weather_code[index])}
                </div>
                <div className="forecast-temps">
                  <div className="forecast-max">{Math.round(daily.temperature_2m_max[index])}°F</div>
                  <div className="forecast-min">{Math.round(daily.temperature_2m_min[index])}°F</div>
                </div>
                <div className="forecast-precip">
                  💧 {Math.round(daily.precipitation_sum[index] * 10) / 10}mm
                </div>
              </Box>
            ))}
          </Grid>
        </Box>
      </Container>
    </SpaceBetween>
  );
}
