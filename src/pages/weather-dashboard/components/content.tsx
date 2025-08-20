// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import { BaseWeatherWidget, currentWeather, temperatureChart, weatherAlerts, weeklyForecast } from '../widgets';

export function WeatherContent() {
  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 4, m: 6, default: 12 } }, // Current Weather
        { colspan: { l: 4, m: 6, default: 12 } }, // Weather Alerts
        { colspan: { l: 4, m: 12, default: 12 } }, // Weekly Forecast (spans remaining)
        { colspan: { l: 12, m: 12, default: 12 } }, // Temperature Chart (full width)
      ]}
    >
      {[currentWeather, weatherAlerts, weeklyForecast, temperatureChart].map((widget, index) => (
        <BaseWeatherWidget key={index} config={widget.data} />
      ))}
    </Grid>
  );
}
