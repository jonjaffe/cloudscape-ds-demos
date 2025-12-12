// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import AreaChart from '@cloudscape-design/components/area-chart';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';

export function NetworkTrafficChart() {
  const series = [
    {
      title: 'Site 1',
      type: 'area' as const,
      data: [
        { x: new Date(2023, 0, 1), y: 3 },
        { x: new Date(2023, 0, 2), y: 3.2 },
        { x: new Date(2023, 0, 3), y: 3.5 },
        { x: new Date(2023, 0, 4), y: 3.8 },
        { x: new Date(2023, 0, 5), y: 4.2 },
        { x: new Date(2023, 0, 6), y: 4.5 },
        { x: new Date(2023, 0, 7), y: 4.8 },
        { x: new Date(2023, 0, 8), y: 5 },
        { x: new Date(2023, 0, 9), y: 5.2 },
        { x: new Date(2023, 0, 10), y: 5 },
        { x: new Date(2023, 0, 11), y: 4.8 },
        { x: new Date(2023, 0, 12), y: 4.5 },
      ],
      valueFormatter: (value: number) => `${value.toFixed(1)}`,
    },
    {
      title: 'Site 2',
      type: 'area' as const,
      data: [
        { x: new Date(2023, 0, 1), y: 2 },
        { x: new Date(2023, 0, 2), y: 2.2 },
        { x: new Date(2023, 0, 3), y: 2.1 },
        { x: new Date(2023, 0, 4), y: 1.9 },
        { x: new Date(2023, 0, 5), y: 2.3 },
        { x: new Date(2023, 0, 6), y: 3 },
        { x: new Date(2023, 0, 7), y: 3.5 },
        { x: new Date(2023, 0, 8), y: 3.4 },
        { x: new Date(2023, 0, 9), y: 3.2 },
        { x: new Date(2023, 0, 10), y: 2.8 },
        { x: new Date(2023, 0, 11), y: 2.5 },
        { x: new Date(2023, 0, 12), y: 2.3 },
      ],
      valueFormatter: (value: number) => `${value.toFixed(1)}`,
    },
  ];

  return (
    <Container>
      <AreaChart
        series={series}
        xDomain={[new Date(2023, 0, 1), new Date(2023, 0, 12)]}
        yDomain={[0, 6]}
        height={300}
        ariaLabel="Network traffic area chart"
        xTitle="Day"
        yTitle="Network traffic"
        legendTitle="Legend"
        i18nStrings={{
          xTickFormatter: (value) => {
            const date = value as Date;
            return `x${date.getDate()}`;
          },
          yTickFormatter: (value) => `y${value}`,
        }}
        hideFilter
        statusType="finished"
      />
    </Container>
  );
}
