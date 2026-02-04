// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import Container from '@cloudscape-design/components/container';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

// Sample data for Network Traffic chart
const networkTrafficData = [
  { x: 'x1', y1: 2.8, y2: 2.5 },
  { x: 'x2', y1: 3.2, y2: 2.8 },
  { x: 'x3', y1: 3.5, y2: 3.0 },
  { x: 'x4', y1: 3.8, y2: 3.2 },
  { x: 'x5', y1: 4.0, y2: 3.3 },
  { x: 'x6', y1: 4.2, y2: 3.5 },
  { x: 'x7', y1: 4.5, y2: 3.6 },
  { x: 'x8', y1: 4.7, y2: 3.8 },
  { x: 'x9', y1: 5.0, y2: 4.0 },
  { x: 'x10', y1: 5.2, y2: 4.2 },
  { x: 'x11', y1: 4.8, y2: 3.9 },
  { x: 'x12', y1: 4.2, y2: 3.5 },
];

// Sample data for Credit Usage chart
const creditUsageData = [
  { x: 'x1', y: 4.2 },
  { x: 'x2', y: 5.5 },
  { x: 'x3', y: 5.0 },
  { x: 'x4', y: 3.5 },
  { x: 'x5', y: 5.2 },
];

// Sample device data
const deviceItems = [
  { id: '1', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '2', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '3', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '4', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '5', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '6', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '7', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '8', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '9', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '10', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '11', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
  { id: '12', name: 'Cell Value', status: 'Cell Value', type: 'Cell Value', ip: 'Cell Value', mac: 'Cell Value', location: 'Cell Value', lastSeen: 'Cell Value' },
];

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedItems, setSelectedItems] = useState<typeof deviceItems>([]);
  const [flashbarItems, setFlashbarItems] = useState<FlashbarProps.MessageDefinition[]>([
    {
      type: 'warning',
      dismissible: true,
      dismissLabel: 'Dismiss',
      buttonText: 'Dismiss',
      content: 'This is a warning message',
      id: 'warning-1',
    },
  ]);

  return (
    <>
      <TopNavigation
        identity={{
          href: '#',
          title: 'Service name',
          logo: {
            src: '',
            alt: 'Logo',
          },
        }}
        utilities={[
          {
            type: 'button',
            text: 'Link',
            href: '#',
            external: true,
            externalIconAriaLabel: ' (opens in a new tab)',
          },
          {
            type: 'button',
            iconName: 'notification',
            title: 'Notifications',
            ariaLabel: 'Notifications',
          },
          {
            type: 'button',
            iconName: 'settings',
            title: 'Settings',
            ariaLabel: 'Settings',
          },
          {
            type: 'menu-dropdown',
            text: 'Customer name',
            description: '',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
      />
      <AppLayout
        navigation={
          <div style={{ padding: '16px' }}>
            <SpaceBetween size="xs">
              <div style={{ color: '#0972d3', fontSize: '14px' }}>Service</div>
              <div style={{ fontSize: '14px' }}>Administrative Dashboard</div>
            </SpaceBetween>
          </div>
        }
        toolsHide
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <BreadcrumbGroup
                  items={[
                    { text: 'Service', href: '#' },
                    { text: 'Administrative Dashboard', href: '#' },
                  ]}
                  ariaLabel="Breadcrumbs"
                />
                <Header
                  variant="h1"
                  description="Network Traffic, Credit Usage, and Your Devices"
                  actions={
                    <Button variant="primary" iconAlign="right" iconName="external">
                      Refresh Data
                    </Button>
                  }
                >
                  Network Adminstration Dashboard
                </Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input
                    value={searchValue}
                    onChange={({ detail }) => setSearchValue(detail.value)}
                    placeholder="Placeholder"
                    type="search"
                  />
                  <Pagination
                    currentPageIndex={currentPageIndex}
                    onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                    pagesCount={5}
                    ariaLabels={{
                      nextPageLabel: 'Next page',
                      previousPageLabel: 'Previous page',
                      pageLabel: pageNumber => `Page ${pageNumber}`,
                    }}
                  />
                  <div
                    style={{
                      width: '2px',
                      height: '24px',
                      background: 'var(--grey-600, #414D5C)',
                    }}
                  />
                  <Button variant="icon" iconName="settings" />
                </div>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="l">
              {flashbarItems.length > 0 && (
                <Flashbar
                  items={flashbarItems.map(item => ({
                    ...item,
                    onDismiss: () => setFlashbarItems(prev => prev.filter(i => i.id !== item.id)),
                  }))}
                />
              )}

              <Grid
                gridDefinition={[
                  { colspan: { default: 12, s: 6 } },
                  { colspan: { default: 12, s: 6 } },
                ]}
              >
                <Container
                  header={
                    <Header variant="h2" description="">
                      Network traffic
                    </Header>
                  }
                >
                  <AreaChart
                    series={[
                      {
                        title: 'Site 1',
                        type: 'area',
                        data: networkTrafficData.map(d => ({ x: d.x, y: d.y1 })),
                        color: '#C6A9E1',
                      },
                      {
                        title: 'Site 2',
                        type: 'area',
                        data: networkTrafficData.map(d => ({ x: d.x, y: d.y2 })),
                        color: '#9DC4E8',
                      },
                    ]}
                    xDomain={networkTrafficData.map(d => d.x)}
                    yDomain={[0, 6]}
                    i18nStrings={{
                      filterLabel: 'Filter displayed data',
                      filterPlaceholder: 'Filter data',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'area chart',
                      xTickFormatter: (value: string) => value,
                      yTickFormatter: (value: number) => `y${value}`,
                    }}
                    ariaLabel="Network traffic chart"
                    height={300}
                    hideFilter
                    statusType="finished"
                    xScaleType="categorical"
                    xTitle="Day"
                    yTitle=""
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>No data available</b>
                      </Box>
                    }
                    noMatch={
                      <Box textAlign="center" color="inherit">
                        <b>No matching data</b>
                      </Box>
                    }
                  />
                  <div style={{ marginTop: '16px', fontSize: '12px' }}>
                    <span style={{ color: '#C6A9E1', marginRight: '16px' }}>■ Site 1</span>
                    <span style={{ color: '#9DC4E8', marginRight: '16px' }}>■ Site 2</span>
                    <span style={{ color: '#666' }}>- - Performance goal</span>
                  </div>
                </Container>

                <Container
                  header={
                    <Header variant="h2" description="">
                      Credit Usage
                    </Header>
                  }
                >
                  <BarChart
                    series={[
                      {
                        title: 'Site 1',
                        type: 'bar',
                        data: creditUsageData,
                        color: '#5B8FF9',
                      },
                    ]}
                    xDomain={creditUsageData.map(d => d.x)}
                    yDomain={[0, 6]}
                    i18nStrings={{
                      filterLabel: 'Filter displayed data',
                      filterPlaceholder: 'Filter data',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'bar chart',
                      xTickFormatter: (value: string) => value,
                      yTickFormatter: (value: number) => `y${value}`,
                    }}
                    ariaLabel="Credit usage chart"
                    height={300}
                    hideFilter
                    statusType="finished"
                    xScaleType="categorical"
                    xTitle="Day"
                    yTitle=""
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>No data available</b>
                      </Box>
                    }
                    noMatch={
                      <Box textAlign="center" color="inherit">
                        <b>No matching data</b>
                      </Box>
                    }
                  />
                  <div style={{ marginTop: '16px', fontSize: '12px' }}>
                    <span style={{ color: '#5B8FF9', marginRight: '16px' }}>■ Site 1</span>
                    <span style={{ color: '#666' }}>- - Performance goal</span>
                  </div>
                </Container>
              </Grid>

              <Container
                header={
                  <Header
                    variant="h2"
                    description="Devices on your local network"
                    actions={
                      <Button variant="primary" iconAlign="right" iconName="external">
                        Add Device
                      </Button>
                    }
                  >
                    My Devices
                  </Header>
                }
              >
                <Table
                  columnDefinitions={[
                    {
                      id: 'name',
                      header: 'Column header',
                      cell: item => item.name,
                      sortingField: 'name',
                    },
                    {
                      id: 'status',
                      header: 'Column header',
                      cell: item => item.status,
                      sortingField: 'status',
                    },
                    {
                      id: 'type',
                      header: 'Column header',
                      cell: item => item.type,
                      sortingField: 'type',
                    },
                    {
                      id: 'ip',
                      header: 'Column header',
                      cell: item => item.ip,
                      sortingField: 'ip',
                    },
                    {
                      id: 'mac',
                      header: 'Column header',
                      cell: item => item.mac,
                      sortingField: 'mac',
                    },
                    {
                      id: 'location',
                      header: 'Column header',
                      cell: item => item.location,
                      sortingField: 'location',
                    },
                    {
                      id: 'lastSeen',
                      header: 'Column header',
                      cell: item => item.lastSeen,
                      sortingField: 'lastSeen',
                    },
                  ]}
                  items={deviceItems}
                  selectionType="multi"
                  selectedItems={selectedItems}
                  onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                  ariaLabels={{
                    selectionGroupLabel: 'Items selection',
                    allItemsSelectionLabel: () => 'select all',
                    itemSelectionLabel: ({ selectedItems }, item) => item.name,
                  }}
                  variant="container"
                  empty={
                    <Box textAlign="center" color="inherit">
                      <b>No devices</b>
                      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                        No devices to display.
                      </Box>
                    </Box>
                  }
                />
              </Container>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </>
  );
}
