// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';

interface WeatherHeaderProps {
  actions?: React.ReactNode;
}

export function WeatherHeader({ actions }: WeatherHeaderProps) {
  return (
    <Header
      variant="h1"
      actions={actions}
      description="Real-time weather data and forecasts powered by Open-Meteo API"
      info={
        <SpaceBetween direction="horizontal" size="s">
          <Badge color="green">Live Data</Badge>
          <Badge>Open-Meteo API</Badge>
        </SpaceBetween>
      }
    >
      Weather Dashboard
    </Header>
  );
}
