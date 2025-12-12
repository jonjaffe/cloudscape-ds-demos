// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Container from '@cloudscape-design/components/container';

export function CreditUsageChart() {
  const series = [
    {
      title: 'Site 1',
      type: 'bar' as const,
      data: [
        { x: 'x1', y: 183 },
        { x: 'x2', y: 257 },
        { x: 'x3', y: 213 },
        { x: 'x4', y: 122 },
        { x: 'x5', y: 210 },
      ],
    },
  ];

  return (
    <Container>
      <BarChart
        series={series}
        height={300}
        ariaLabel="Credit usage bar chart"
        xTitle="Day"
        yTitle="Credit Usage"
        hideFilter
        statusType="finished"
      />
    </Container>
  );
}
