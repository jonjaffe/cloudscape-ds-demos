// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherLocation } from '../../types';

interface WeatherMapWidgetProps {
  location: WeatherLocation;
  loading: boolean;
}

export function WeatherMapWidget({ location, loading }: WeatherMapWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Location Info</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
        </Box>
      </Container>
    );
  }

  const locationItems = [
    {
      label: 'City',
      value: location.name,
    },
    {
      label: 'Country',
      value: location.country || 'Unknown',
    },
    {
      label: 'Latitude',
      value: `${location.latitude.toFixed(4)}°`,
    },
    {
      label: 'Longitude',
      value: `${location.longitude.toFixed(4)}°`,
    },
    {
      label: 'Timezone',
      value: location.timezone || 'Auto',
    },
  ];

  // Generate map URLs for external services
  const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=12`;

  return (
    <Container
      header={
        <Header variant="h2" description="Location details and map links">
          Location Info
        </Header>
      }
    >
      <SpaceBetween size="l">
        <KeyValuePairs columns={1} items={locationItems} />

        <SpaceBetween size="m">
          <Box variant="h4">Quick Links</Box>
          <SpaceBetween size="s">
            <Link href={googleMapsUrl} external>
              View on Google Maps
            </Link>
            <Link href={openStreetMapUrl} external>
              View on OpenStreetMap
            </Link>
            <Link href="https://open-meteo.com/" external>
              Open-Meteo API
            </Link>
          </SpaceBetween>
        </SpaceBetween>

        <Box>
          <Box variant="h4" padding={{ bottom: 's' }}>
            Coordinates
          </Box>
          <Box
            variant="code"
            padding="s"
            style={{
              backgroundColor: 'var(--color-background-input-default)',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          >
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Box>
        </Box>
      </SpaceBetween>
    </Container>
  );
}
