// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';

export function WeatherDashboardHeader() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Header
      variant="h1"
      description="Real-time weather information and forecasts"
      actions={
        <Button variant="primary" iconName="refresh" onClick={refreshPage}>
          Refresh Weather Data
        </Button>
      }
    >
      Weather Dashboard
    </Header>
  );
}
