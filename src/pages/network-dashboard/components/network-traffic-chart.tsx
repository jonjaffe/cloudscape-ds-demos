// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import AreaChart from '@cloudscape-design/components/area-chart';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';

export function NetworkTrafficChart() {
  // Generate sample data for 12 days
  const generateData = () => {
    const data = [];
    for (let i = 1; i <= 12; i++) {
      data.push({ x: `x${i}`, y: Math.floor(Math.random() * 6) + 1 });
    }
    return data;
  };

  const site1Data = generateData();
  const site2Data = generateData();

  return (
    <Container fitHeight>
      <AreaChart
        series={[
          {
            title: 'Site 1',
            type: 'area',
            data: site1Data.map(d => ({ x: d.x, y: d.y })),
            valueFormatter: value => `y${value}`,
          },
          {
            title: 'Site 2',
            type: 'area',
            data: site2Data.map(d => ({ x: d.x, y: d.y })),
            valueFormatter: value => `y${value}`,
          },
          {
            title: 'Performance goal',
            type: 'threshold',
            y: 3,
            valueFormatter: () => 'y3',
          },
        ]}
        xDomain={[
          'x1',
          'x2',
          'x3',
          'x4',
          'x5',
          'x6',
          'x7',
          'x8',
          'x9',
          'x10',
          'x11',
          'x12',
        ]}
        yDomain={[0, 6]}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'area chart',
          xTickFormatter: e => e,
          yTickFormatter: value => `y${Math.floor(value)}`,
        }}
        ariaLabel="Network traffic area chart"
        errorText="Error loading data"
        height={300}
        hideFilter
        hideLegend={false}
        loadingText="Loading chart"
        recoveryText="Retry"
        xScaleType="categorical"
        xTitle="Day"
        yTitle="Network traffic"
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
