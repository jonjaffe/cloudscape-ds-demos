// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';

export function CreditUsageChart() {
  // Generate sample data for 5 days
  const data = [
    { x: 'x1', y: 4 },
    { x: 'x2', y: 5.5 },
    { x: 'x3', y: 4.5 },
    { x: 'x4', y: 2.5 },
    { x: 'x5', y: 4.3 },
  ];

  return (
    <Container fitHeight>
      <BarChart
        series={[
          {
            title: 'Site 1',
            type: 'bar',
            data: data,
            valueFormatter: value => `y${Math.floor(value)}`,
          },
          {
            title: 'Performance goal',
            type: 'threshold',
            y: 3,
            valueFormatter: () => 'y3',
          },
        ]}
        xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
        yDomain={[0, 6]}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          xTickFormatter: e => e,
          yTickFormatter: value => `y${Math.floor(value)}`,
        }}
        ariaLabel="Credit usage bar chart"
        errorText="Error loading data"
        height={300}
        hideFilter
        hideLegend={false}
        loadingText="Loading chart"
        recoveryText="Retry"
        xScaleType="categorical"
        xTitle="Day"
        yTitle="Credit Usage"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              There is no data available
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box variant="p" color="inherit">
              There is no matching data to display
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
