// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import AreaChart from '@cloudscape-design/components/area-chart';
import Container from '@cloudscape-design/components/container';

export function NetworkTrafficChart() {
  const series = [
    {
      title: 'Site 1',
      type: 'area' as const,
      data: [
        { x: 'x1', y: 3 },
        { x: 'x2', y: 3.2 },
        { x: 'x3', y: 3.5 },
        { x: 'x4', y: 3.8 },
        { x: 'x5', y: 4.2 },
        { x: 'x6', y: 4.5 },
        { x: 'x7', y: 4.8 },
        { x: 'x8', y: 5 },
        { x: 'x9', y: 5.2 },
        { x: 'x10', y: 5 },
        { x: 'x11', y: 4.8 },
        { x: 'x12', y: 4.5 },
      ],
    },
    {
      title: 'Site 2',
      type: 'area' as const,
      data: [
        { x: 'x1', y: 2 },
        { x: 'x2', y: 2.2 },
        { x: 'x3', y: 2.1 },
        { x: 'x4', y: 1.9 },
        { x: 'x5', y: 2.3 },
        { x: 'x6', y: 3 },
        { x: 'x7', y: 3.5 },
        { x: 'x8', y: 3.4 },
        { x: 'x9', y: 3.2 },
        { x: 'x10', y: 2.8 },
        { x: 'x11', y: 2.5 },
        { x: 'x12', y: 2.3 },
      ],
    },
  ];

  return (
    <Container>
      <AreaChart
        series={series}
        height={300}
        ariaLabel="Network traffic area chart"
        xTitle="Day"
        yTitle="Network traffic"
        hideFilter
        statusType="finished"
      />
    </Container>
  );
}
