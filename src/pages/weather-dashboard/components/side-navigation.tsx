// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/weather-dashboard"
      header={{ href: '#/', text: 'Weather Service' }}
      items={[
        {
          type: 'section',
          text: 'Dashboard',
          items: [
            { type: 'link', text: 'Current Weather', href: '#/weather-dashboard' },
            { type: 'link', text: 'Forecasts', href: '#/weather-dashboard/forecasts' },
            { type: 'link', text: 'Historical Data', href: '#/weather-dashboard/historical' },
          ],
        },
        {
          type: 'section',
          text: 'Settings',
          items: [
            { type: 'link', text: 'Locations', href: '#/weather-dashboard/locations' },
            { type: 'link', text: 'Units', href: '#/weather-dashboard/units' },
            { type: 'link', text: 'Alerts', href: '#/weather-dashboard/alerts' },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'link',
          text: 'API Documentation',
          href: 'https://open-meteo.com/',
          external: true,
        },
      ]}
    />
  );
}
