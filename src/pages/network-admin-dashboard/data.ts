// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { LineChartProps } from '@cloudscape-design/components/line-chart';
import { BarChartProps } from '@cloudscape-design/components/bar-chart';

// Network traffic data (area chart - using line type with area styling)
export const networkTrafficSeries: LineChartProps<number>['series'] = [
  {
    title: 'Site 1',
    type: 'line',
    data: [
      { x: 0, y: 3 },
      { x: 1, y: 3.2 },
      { x: 2, y: 3.5 },
      { x: 3, y: 3.8 },
      { x: 4, y: 4.2 },
      { x: 5, y: 4.5 },
      { x: 6, y: 4.8 },
      { x: 7, y: 5.2 },
      { x: 8, y: 5.5 },
      { x: 9, y: 5.3 },
      { x: 10, y: 4.8 },
      { x: 11, y: 4.2 },
    ],
    valueFormatter: (value: number) => value.toFixed(1),
  },
  {
    title: 'Site 2',
    type: 'line',
    data: [
      { x: 0, y: 2 },
      { x: 1, y: 2.1 },
      { x: 2, y: 2.3 },
      { x: 3, y: 2.5 },
      { x: 4, y: 2.8 },
      { x: 5, y: 3.0 },
      { x: 6, y: 3.2 },
      { x: 7, y: 3.5 },
      { x: 8, y: 3.7 },
      { x: 9, y: 3.5 },
      { x: 10, y: 3.2 },
      { x: 11, y: 2.8 },
    ],
    valueFormatter: (value: number) => value.toFixed(1),
  },
  {
    title: 'Performance goal',
    type: 'threshold',
    y: 3.3,
    valueFormatter: (value: number) => value.toFixed(1),
  },
];

// Credit usage data (bar chart)
export const creditUsageSeries: BarChartProps<string>['series'] = [
  {
    title: 'Site 1',
    type: 'bar',
    data: [
      { x: 'x1', y: 4 },
      { x: 'x2', y: 5.5 },
      { x: 'x3', y: 5 },
      { x: 'x4', y: 3 },
      { x: 'x5', y: 5 },
    ],
    valueFormatter: (value: number) => value.toFixed(1),
  },
];

// Devices table data
export const devicesData = Array.from({ length: 12 }, (_, index) => ({
  id: `device-${index + 1}`,
  column1: 'Cell Value',
  column2: 'Cell Value',
  column3: 'Cell Value',
  column4: 'Cell Value',
  column5: 'Cell Value',
  column6: 'Cell Value',
  column7: 'Cell Value',
}));
