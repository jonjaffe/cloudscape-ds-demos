// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      header={{ text: 'Weather Dashboard', href: '/weather' }}
      items={[
        {
          type: 'section',
          text: 'Current Weather',
          items: [
            { type: 'link', text: 'Overview', href: '#overview' },
            { type: 'link', text: 'Current Conditions', href: '#current' },
          ],
        },
        {
          type: 'section',
          text: 'Forecasts',
          items: [
            { type: 'link', text: 'Hourly Forecast', href: '#hourly' },
            { type: 'link', text: 'Daily Forecast', href: '#daily' },
          ],
        },
        {
          type: 'section',
          text: 'Locations',
          items: [
            { type: 'link', text: 'Add Location', href: '#add-location' },
            { type: 'link', text: 'Manage Locations', href: '#manage' },
          ],
        },
      ]}
    />
  );
}
