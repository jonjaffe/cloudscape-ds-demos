// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import AreaChart from '@cloudscape-design/components/area-chart';
import AppLayout from '@cloudscape-design/components/app-layout';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Flashbar from '@cloudscape-design/components/flashbar';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import '../../styles/base.scss';
import '../../styles/top-navigation.scss';

const i18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close menu',
};

const profileActions = [
  { id: 'profile', text: 'Profile' },
  { id: 'preferences', text: 'Preferences' },
  { id: 'security', text: 'Security' },
  { id: 'signout', text: 'Sign out' },
];

// Network traffic area chart data
const networkTrafficSeries = [
  {
    title: 'Site 1',
    type: 'area' as const,
    color: '#688AE8',
    data: [
      { x: 'x1', y: 3.2 },
      { x: 'x2', y: 2.8 },
      { x: 'x3', y: 3.0 },
      { x: 'x4', y: 3.5 },
      { x: 'x5', y: 3.1 },
      { x: 'x6', y: 3.4 },
      { x: 'x7', y: 3.8 },
      { x: 'x8', y: 4.0 },
      { x: 'x9', y: 4.2 },
      { x: 'x10', y: 3.9 },
      { x: 'x11', y: 4.4 },
      { x: 'x12', y: 4.8 },
    ],
  },
  {
    title: 'Site 2',
    type: 'area' as const,
    color: '#C33D69',
    data: [
      { x: 'x1', y: 2.8 },
      { x: 'x2', y: 3.5 },
      { x: 'x3', y: 3.2 },
      { x: 'x4', y: 3.8 },
      { x: 'x5', y: 4.0 },
      { x: 'x6', y: 4.5 },
      { x: 'x7', y: 4.2 },
      { x: 'x8', y: 4.8 },
      { x: 'x9', y: 5.0 },
      { x: 'x10', y: 4.6 },
      { x: 'x11', y: 5.2 },
      { x: 'x12', y: 4.9 },
    ],
  },
  {
    title: 'Performance goal',
    type: 'threshold' as const,
    y: 3.5,
    color: '#5F6B7A',
  },
];

// Credit usage bar chart data
const creditUsageSeries = [
  {
    title: 'Site 1',
    type: 'bar' as const,
    color: '#688AE8',
    data: [
      { x: 'x1', y: 4.2 },
      { x: 'x2', y: 5.8 },
      { x: 'x3', y: 4.8 },
      { x: 'x4', y: 3.2 },
      { x: 'x5', y: 4.6 },
    ],
  },
  {
    title: 'Performance goal',
    type: 'threshold' as const,
    y: 3.8,
    color: '#5F6B7A',
  },
];

// Device table data (13 rows)
const deviceRows = Array.from({ length: 13 }, (_, i) => ({
  id: `device-${i}`,
  col1: 'Cell Value',
  col2: 'Cell Value',
  col3: 'Cell Value',
  col4: 'Cell Value',
  col5: 'Cell Value',
  col6: 'Cell Value',
  col7: 'Cell Value',
}));

const deviceColumnDefinitions = [
  { id: 'col1', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col1, sortingField: 'col1' },
  { id: 'col2', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col2, sortingField: 'col2' },
  { id: 'col3', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col3, sortingField: 'col3' },
  { id: 'col4', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col4, sortingField: 'col4' },
  { id: 'col5', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col5, sortingField: 'col5' },
  { id: 'col6', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col6, sortingField: 'col6' },
  { id: 'col7', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col7, sortingField: 'col7' },
];

interface DemoHeaderPortalProps {
  children: React.ReactNode;
}

const DemoHeaderPortal = ({ children }: DemoHeaderPortalProps) => {
  const domNode = document.querySelector('#h');
  if (!domNode) return null;
  return createPortal(children, domNode);
};

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<(typeof deviceRows)[0][]>([]);

  return (
    <>
      <DemoHeaderPortal>
        <TopNavigation
          i18nStrings={i18nStrings}
          identity={{
            href: '#',
            title: 'Service name',
            logo: {
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='43' height='31'%3E%3Crect width='43' height='31' rx='2' fill='none' stroke='%23D1D5DB' stroke-width='1'/%3E%3Ctext x='6' y='21' font-family='Open Sans' font-size='14' fill='%23FBFBFB'%3ELogo%3C/text%3E%3C/svg%3E",
              alt: 'Logo',
            },
          }}
          utilities={[
            {
              type: 'button',
              text: 'Link',
              iconName: 'external',
              ariaLabel: 'Link',
              href: '#',
              external: true,
              disableUtilityCollapse: true,
            },
            {
              type: 'button',
              iconName: 'notification',
              ariaLabel: 'Notifications',
              badge: true,
              disableUtilityCollapse: true,
            },
            {
              type: 'button',
              iconName: 'settings',
              title: 'Settings',
              ariaLabel: 'Settings',
              disableUtilityCollapse: true,
            },
            {
              type: 'menu-dropdown',
              text: 'Customer name',
              iconName: 'user-profile',
              items: profileActions,
            },
          ]}
          search={
            <Input
              ariaLabel="Search"
              clearAriaLabel="Clear"
              value={searchValue}
              type="search"
              placeholder="Search"
              onChange={({ detail }) => setSearchValue(detail.value)}
            />
          }
        />
      </DemoHeaderPortal>

      <AppLayout
        navigationHide
        toolsHide
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Service', href: '#' },
              { text: 'Administrative Dashboard', href: '#' },
            ]}
            ariaLabel="Breadcrumbs"
          />
        }
        content={
          <SpaceBetween size="l">
            {/* Page header */}
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

            {/* Search + Pagination row */}
            <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }, { colspan: { default: 12, s: 4 } }]}>
              <TextFilter
                filteringText={filterText}
                filteringPlaceholder="Placeholder"
                filteringAriaLabel="Filter"
                onChange={({ detail }) => setFilterText(detail.filteringText)}
              />
              <Box float="right" display="inline">
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <Pagination
                    currentPageIndex={currentPage}
                    pagesCount={5}
                    onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
                    ariaLabels={{
                      nextPageLabel: 'Next page',
                      previousPageLabel: 'Previous page',
                      pageLabel: pageNumber => `Page ${pageNumber}`,
                    }}
                  />
                </SpaceBetween>
              </Box>
            </Grid>

            {/* Warning banner */}
            {!warningDismissed && (
              <Flashbar
                items={[
                  {
                    type: 'warning',
                    content: 'This is a warning message',
                    dismissible: true,
                    onDismiss: () => setWarningDismissed(true),
                    dismissLabel: 'Dismiss',
                  },
                ]}
              />
            )}

            {/* Charts row */}
            <ColumnLayout columns={2} variant="text-grid">
              <Container header={<Header variant="h3">Network traffic</Header>}>
                <AreaChart
                  series={networkTrafficSeries as any}
                  xTitle="Day"
                  ariaLabel="Network traffic area chart"
                  height={300}
                  xScaleType="categorical"
                  yDomain={[0, 6]}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data',
                    filterPlaceholder: 'Filter data',
                    filterSelectedAriaLabel: 'selected',
                    detailPopoverDismissAriaLabel: 'Dismiss',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'area chart',
                    xTickFormatter: v => String(v),
                    yTickFormatter: (v: number) => `y${v}`,
                  }}
                  hideFilter
                />
              </Container>

              <Container header={<Header variant="h3">Credit Usage</Header>}>
                <BarChart
                  series={creditUsageSeries as any}
                  xTitle="Day"
                  ariaLabel="Credit usage bar chart"
                  height={300}
                  xScaleType="categorical"
                  yDomain={[0, 6]}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data',
                    filterPlaceholder: 'Filter data',
                    filterSelectedAriaLabel: 'selected',
                    detailPopoverDismissAriaLabel: 'Dismiss',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'bar chart',
                    xTickFormatter: v => String(v),
                    yTickFormatter: (v: number) => `y${v}`,
                  }}
                  hideFilter
                />
              </Container>
            </ColumnLayout>

            {/* My Devices table */}
            <Table
              columnDefinitions={deviceColumnDefinitions}
              items={deviceRows}
              selectionType="multi"
              selectedItems={selectedDevices}
              onSelectionChange={({ detail }) => setSelectedDevices(detail.selectedItems)}
              trackBy="id"
              sortingDisabled={false}
              enableKeyboardNavigation
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
              ariaLabels={{
                selectionGroupLabel: 'Device selection',
                allItemsSelectionLabel: () => 'Select all devices',
                itemSelectionLabel: (_, item) => `Select device ${item.id}`,
              }}
            />
          </SpaceBetween>
        }
      />
    </>
  );
}

export default function NetworkAdminDashboardDemo() {
  return <App />;
}
