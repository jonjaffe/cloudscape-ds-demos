// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';
import Link from '@cloudscape-design/components/link';

export function WeatherHeader({ actions }: { actions: React.ReactNode }) {
  return (
    <Header variant="h1" actions={actions}>
      Weather Dashboard
    </Header>
  );
}

export function WeatherMainInfo() {
  return (
    <HelpPanel header={<h2>Weather Dashboard</h2>}>
      <p>
        This weather dashboard displays real-time weather information using the Open Meteo API. View current conditions,
        hourly forecasts, and weekly predictions for any location worldwide.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Current weather conditions</li>
        <li>Hourly forecasts for the next 24 hours</li>
        <li>7-day weather outlook</li>
        <li>Multiple location support</li>
        <li>Temperature, humidity, wind speed, and precipitation data</li>
      </ul>
      <h3>Data Source</h3>
      <p>
        Weather data is provided by{' '}
        <Link external href="https://open-meteo.com">
          Open Meteo API
        </Link>
        , a free and open-source weather service.
      </p>
    </HelpPanel>
  );
}
