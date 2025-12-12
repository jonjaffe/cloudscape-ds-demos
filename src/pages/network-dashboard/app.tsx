// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Flashbar from '@cloudscape-design/components/flashbar';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Icon from '@cloudscape-design/components/icon';

import { NetworkTrafficChart } from './components/network-traffic-chart';
import { CreditUsageChart } from './components/credit-usage-chart';
import { DevicesTable } from './components/devices-table';
import './styles.css';

export function App() {
  const [filteringText, setFilteringText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Service', href: '#' },
            { text: 'Administrative Dashboard', href: '#' },
          ]}
        />
      }
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                description="Network Traffic, Credit Usage, and Your Devices"
                actions={
                  <Button variant="primary" iconName="external" iconAlign="right">
                    Refresh Data
                  </Button>
                }
              >
                Network Adminstration Dashboard
              </Header>
              <Flashbar
                items={[
                  {
                    type: 'warning',
                    dismissible: true,
                    content: 'This is a warning message',
                    id: 'warning-1',
                  },
                ]}
              />
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <div className="search-pagination-wrapper">
              <Grid
                gridDefinition={[
                  { colspan: { default: 12, s: 8 } },
                  { colspan: { default: 12, s: 4 } },
                ]}
              >
                <TextFilter
                  filteringText={filteringText}
                  filteringPlaceholder="Placeholder"
                  filteringAriaLabel="Filter content"
                  onChange={({ detail }) => setFilteringText(detail.filteringText)}
                />
                <div className="pagination-controls">
                  <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                    <Pagination
                      currentPageIndex={currentPageIndex}
                      pagesCount={5}
                      onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                    />
                    <Button iconName="settings" variant="icon" />
                  </SpaceBetween>
                </div>
              </Grid>
            </div>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, m: 6 } },
                { colspan: { default: 12, m: 6 } },
              ]}
            >
              <NetworkTrafficChart />
              <CreditUsageChart />
            </Grid>

            <DevicesTable />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
