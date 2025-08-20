// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { BoardProps } from '@cloudscape-design/board-components/board';

export interface WeatherWidgetDataType {
  icon: string;
  title: string;
  description: string;
  disableContentPaddings?: boolean;
  provider?: React.JSXElementConstructor<{ children: React.ReactElement }>;
  header: React.JSXElementConstructor<Record<string, never>>;
  content: React.JSXElementConstructor<Record<string, never>>;
  footer?: React.JSXElementConstructor<Record<string, never>>;
  staticMinHeight?: number;
}

export type WeatherDashboardWidgetItem = BoardProps.Item<WeatherWidgetDataType>;

export type WeatherWidgetConfig = Pick<WeatherDashboardWidgetItem, 'definition' | 'data'>;
