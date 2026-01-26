import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { CitySearch } from './components/city-search';
import { WeatherDisplay } from './components/weather-display';
import { getWeatherForecast, ForecastData, Location } from './api';

import '../../styles/base.scss';

export function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location);
    setIsLoading(true);

    try {
      const data = await getWeatherForecast(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomAppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout header={<Header variant="h1">Weather Dashboard</Header>}>
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Find Weather by Location</Header>}>
              <CitySearch onLocationSelect={handleLocationSelect} isLoading={isLoading} />
            </Container>

            {selectedLocation && (
              <WeatherDisplay
                data={weatherData}
                locationName={`${selectedLocation.name}${selectedLocation.admin1 ? ', ' + selectedLocation.admin1 : ''}`}
                isLoading={isLoading}
              />
            )}

            {!selectedLocation && !weatherData && (
              <Container>
                <Box textAlign="center" padding="xxl" color="text-status-inactive">
                  <Box variant="p">Search for a city above to see the weather forecast</Box>
                </Box>
              </Container>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
      breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/' }]} />}
      notifications={<Notifications />}
    />
  );
}
