// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Select from '@cloudscape-design/components/select';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';
import Alert from '@cloudscape-design/components/alert';

import { WeatherLocation, WeatherAPI, DEFAULT_LOCATIONS } from '../services/weather-api';

interface LocationSelectorProps {
  currentLocation: WeatherLocation;
  onLocationChange: (location: WeatherLocation) => void;
  loading?: boolean;
}

export function LocationSelector({ currentLocation, onLocationChange, loading }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const results = await WeatherAPI.searchLocations(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search locations. Please try again.');
      console.error('Location search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleLocationSelect = (location: WeatherLocation) => {
    onLocationChange(location);
    setSearchResults([]);
    setSearchQuery('');
  };

  const allLocations = [...DEFAULT_LOCATIONS, ...searchResults];
  const uniqueLocations = allLocations.filter(
    (location, index, self) =>
      index === self.findIndex(l => l.latitude === location.latitude && l.longitude === location.longitude),
  );

  const locationOptions = uniqueLocations.map(location => ({
    label: `${location.name}, ${location.country || ''}`,
    value: JSON.stringify(location),
    description: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
  }));

  const selectedOption = locationOptions.find(option => {
    const optionLocation = JSON.parse(option.value);
    return (
      optionLocation.latitude === currentLocation.latitude && optionLocation.longitude === currentLocation.longitude
    );
  });

  return (
    <Container
      header={
        <Header variant="h2" description="Search and select a location for weather data">
          Location
        </Header>
      }
    >
      <SpaceBetween size="m">
        {error && <Alert type="error">{error}</Alert>}

        <FormField label="Search for a location">
          <SpaceBetween size="xs" direction="horizontal">
            <Input
              value={searchQuery}
              onChange={({ detail }) => setSearchQuery(detail.value)}
              placeholder="Enter city name..."
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} loading={searching} iconName="search">
              Search
            </Button>
          </SpaceBetween>
        </FormField>

        <FormField label="Select location">
          <Select
            selectedOption={selectedOption || null}
            onChange={({ detail }) => {
              if (detail.selectedOption) {
                const location = JSON.parse(detail.selectedOption.value!);
                handleLocationSelect(location);
              }
            }}
            options={locationOptions}
            placeholder="Choose a location"
            loadingText="Loading locations..."
            disabled={loading}
            expandToViewport
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
}
