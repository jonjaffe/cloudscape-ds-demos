// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Flashbar from '@cloudscape-design/components/flashbar';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';

// Mock data for Network Traffic chart
const networkTrafficData = [
  {
    title: 'Site 1',
    type: 'area',
    data: [
      { x: 'x1', y: 3 },
      { x: 'x2', y: 3.2 },
      { x: 'x3', y: 3.5 },
      { x: 'x4', y: 3.7 },
      { x: 'x5', y: 4 },
      { x: 'x6', y: 4.2 },
      { x: 'x7', y: 4.5 },
      { x: 'x8', y: 4.7 },
      { x: 'x9', y: 5 },
      { x: 'x10', y: 5.2 },
      { x: 'x11', y: 5 },
      { x: 'x12', y: 4.5 },
    ],
    color: '#9ba7f2',
  },
  {
    title: 'Site 2',
    type: 'area',
    data: [
      { x: 'x1', y: 2.5 },
      { x: 'x2', y: 2.7 },
      { x: 'x3', y: 3 },
      { x: 'x4', y: 3.2 },
      { x: 'x5', y: 3.5 },
      { x: 'x6', y: 3.7 },
      { x: 'x7', y: 4 },
      { x: 'x8', y: 4.2 },
      { x: 'x9', y: 4.5 },
      { x: 'x10', y: 4.3 },
      { x: 'x11', y: 4 },
      { x: 'x12', y: 3.5 },
    ],
    color: '#e19ab5',
  },
];

// Mock data for Credit Usage chart
const creditUsageData = [
  {
    title: 'Site 1',
    type: 'bar',
    data: [
      { x: 'x1', y: 4 },
      { x: 'x2', y: 6 },
      { x: 'x3', y: 5 },
      { x: 'x4', y: 3 },
      { x: 'x5', y: 5 },
    ],
    color: '#5b7ee5',
  },
];

// Mock data for devices table
const devicesData = [
  { id: '1', name: 'Device 1', status: 'Active', ip: '192.168.1.10', mac: '00:1B:44:11:3A:B7', type: 'Computer' },
  { id: '2', name: 'Device 2', status: 'Active', ip: '192.168.1.11', mac: '00:1B:44:11:3A:B8', type: 'Mobile' },
  { id: '3', name: 'Device 3', status: 'Inactive', ip: '192.168.1.12', mac: '00:1B:44:11:3A:B9', type: 'Tablet' },
  { id: '4', name: 'Device 4', status: 'Active', ip: '192.168.1.13', mac: '00:1B:44:11:3A:BA', type: 'Computer' },
  { id: '5', name: 'Device 5', status: 'Active', ip: '192.168.1.14', mac: '00:1B:44:11:3A:BB', type: 'IoT Device' },
  { id: '6', name: 'Device 6', status: 'Inactive', ip: '192.168.1.15', mac: '00:1B:44:11:3A:BC', type: 'Computer' },
  { id: '7', name: 'Device 7', status: 'Active', ip: '192.168.1.16', mac: '00:1B:44:11:3A:BD', type: 'Mobile' },
  { id: '8', name: 'Device 8', status: 'Active', ip: '192.168.1.17', mac: '00:1B:44:11:3A:BE', type: 'Tablet' },
  { id: '9', name: 'Device 9', status: 'Active', ip: '192.168.1.18', mac: '00:1B:44:11:3A:BF', type: 'Computer' },
  { id: '10', name: 'Device 10', status: 'Inactive', ip: '192.168.1.19', mac: '00:1B:44:11:3A:C0', type: 'IoT Device' },
];

const columnDefinitions = [
  {
    id: 'name',
    header: 'Column header',
    cell: (item: any) => item.name,
    sortingField: 'name',
  },
  {
    id: 'status',
    header: 'Column header',
    cell: (item: any) => item.status,
    sortingField: 'status',
  },
  {
    id: 'ip',
    header: 'Column header',
    cell: (item: any) => item.ip,
    sortingField: 'ip',
  },
  {
    id: 'mac',
    header: 'Column header',
    cell: (item: any) => item.mac,
    sortingField: 'mac',
  },
  {
    id: 'type',
    header: 'Column header',
    cell: (item: any) => item.type,
    sortingField: 'type',
  },
  {
    id: 'extra1',
    header: 'Column header',
    cell: () => 'Cell Value',
  },
  {
    id: 'extra2',
    header: 'Column header',
    cell: () => 'Cell Value',
  },
];

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [flashbarVisible, setFlashbarVisible] = useState(true);

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <BreadcrumbGroup
                items={[
                  { text: 'Service', href: '#/' },
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

              <SpaceBetween size="s" direction="horizontal">
                <Input
                  type="search"
                  value={searchValue}
                  onChange={({ detail }) => setSearchValue(detail.value)}
                  placeholder="Placeholder"
                  className="search-input"
                />
                <Pagination
                  currentPageIndex={currentPageIndex}
                  onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                  pagesCount={5}
                />
                <ButtonDropdown items={[]} variant="icon" />
              </SpaceBetween>

              {flashbarVisible && (
                <Flashbar
                  items={[
                    {
                      type: 'warning',
                      content: 'This is a warning message',
                      dismissible: true,
                      onDismiss: () => setFlashbarVisible(false),
                      id: 'warning-message',
                    },
                  ]}
                />
              )}
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <Container>
                <AreaChart
                  series={networkTrafficData}
                  xDomain={['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11', 'x12']}
                  yDomain={[0, 6]}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data',
                    filterPlaceholder: 'Filter data',
                    filterSelectedAriaLabel: 'selected',
                    detailPopoverDismissAriaLabel: 'Dismiss',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'area chart',
                    xTickFormatter: value => value,
                    yTickFormatter: value => `y${value}`,
                  }}
                  ariaLabel="Network traffic"
                  height={300}
                  hideFilter
                  xScaleType="categorical"
                  xTitle="Day"
                  yTitle=""
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
                  legendTitle="Network traffic"
                  additionalFilters={
                    <Box variant="small" color="text-body-secondary">
                      Performance goal
                    </Box>
                  }
                />
              </Container>

              <Container>
                <BarChart
                  series={creditUsageData}
                  xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
                  yDomain={[0, 6]}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data',
                    filterPlaceholder: 'Filter data',
                    filterSelectedAriaLabel: 'selected',
                    detailPopoverDismissAriaLabel: 'Dismiss',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'bar chart',
                    xTickFormatter: value => value,
                    yTickFormatter: value => `y${value}`,
                  }}
                  ariaLabel="Credit Usage"
                  height={300}
                  hideFilter
                  xScaleType="categorical"
                  xTitle="Day"
                  yTitle=""
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
                  legendTitle="Credit Usage"
                  additionalFilters={
                    <Box variant="small" color="text-body-secondary">
                      Performance goal
                    </Box>
                  }
                />
              </Container>
            </Grid>

            <Table
              columnDefinitions={columnDefinitions}
              items={devicesData}
              selectionType="multi"
              selectedItems={selectedItems}
              onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
              variant="container"
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
              empty={
                <Box textAlign="center" color="inherit">
                  <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                    <b>No devices</b>
                  </Box>
                  <Box variant="p" color="inherit">
                    No devices to display.
                  </Box>
                </Box>
              }
            />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
