// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import AppLayout from '@cloudscape-design/components/app-layout';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Flashbar from '@cloudscape-design/components/flashbar';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import './network-dashboard.scss';

// ── Top Navigation ────────────────────────────────────────────────────────────

const topNavI18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close menu',
};

// ── Chart data ────────────────────────────────────────────────────────────────

const networkTrafficSite1 = [
  { x: 1, y: 2.5 },
  { x: 2, y: 3.0 },
  { x: 3, y: 3.2 },
  { x: 4, y: 3.5 },
  { x: 5, y: 3.0 },
  { x: 6, y: 3.2 },
  { x: 7, y: 3.5 },
  { x: 8, y: 3.0 },
  { x: 9, y: 3.5 },
  { x: 10, y: 3.8 },
  { x: 11, y: 3.5 },
  { x: 12, y: 3.2 },
];

const networkTrafficSite2 = [
  { x: 1, y: 3.5 },
  { x: 2, y: 4.0 },
  { x: 3, y: 4.5 },
  { x: 4, y: 4.7 },
  { x: 5, y: 4.2 },
  { x: 6, y: 5.5 },
  { x: 7, y: 5.2 },
  { x: 8, y: 5.0 },
  { x: 9, y: 4.8 },
  { x: 10, y: 5.8 },
  { x: 11, y: 5.5 },
  { x: 12, y: 4.0 },
];

const creditUsageData = [
  { x: 'x1', y: 4.3 },
  { x: 'x2', y: 5.7 },
  { x: 'x3', y: 5.0 },
  { x: 'x4', y: 3.0 },
  { x: 'x5', y: 4.7 },
];

// ── Device table data ─────────────────────────────────────────────────────────

interface Device {
  id: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  col6: string;
  col7: string;
}

const deviceRows: Device[] = Array.from({ length: 13 }, (_, i) => ({
  id: `device-${i + 1}`,
  col1: 'Cell Value',
  col2: 'Cell Value',
  col3: 'Cell Value',
  col4: 'Cell Value',
  col5: 'Cell Value',
  col6: 'Cell Value',
  col7: 'Cell Value',
}));

const deviceColumnDefinitions = [
  { id: 'col1', header: 'Column header', cell: (item: Device) => item.col1, sortingField: 'col1', minWidth: 140 },
  { id: 'col2', header: 'Column header', cell: (item: Device) => item.col2, sortingField: 'col2', minWidth: 140 },
  { id: 'col3', header: 'Column header', cell: (item: Device) => item.col3, sortingField: 'col3', minWidth: 140 },
  { id: 'col4', header: 'Column header', cell: (item: Device) => item.col4, sortingField: 'col4', minWidth: 140 },
  { id: 'col5', header: 'Column header', cell: (item: Device) => item.col5, sortingField: 'col5', minWidth: 140 },
  { id: 'col6', header: 'Column header', cell: (item: Device) => item.col6, sortingField: 'col6', minWidth: 140 },
  { id: 'col7', header: 'Column header', cell: (item: Device) => item.col7, sortingField: 'col7', minWidth: 140 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface DemoHeaderPortalProps {
  children: React.ReactNode;
}

function DemoHeaderPortal({ children }: DemoHeaderPortalProps) {
  const domNode = document.querySelector('#h');
  if (!domNode) return null;
  return createPortal(children, domNode);
}

function NetworkTrafficChart() {
  return (
    <Container
      header={<Header variant="h2">Network traffic</Header>}
    >
      <AreaChart
        series={[
          {
            title: 'Site 1',
            type: 'area',
            data: networkTrafficSite1,
            color: '#688AE8',
          },
          {
            title: 'Site 2',
            type: 'area',
            data: networkTrafficSite2,
            color: '#C33D69',
          },
          {
            title: 'Performance goal',
            type: 'threshold',
            y: 3.2,
            color: '#5F6B7A',
          },
        ]}
        xDomain={[1, 12]}
        yDomain={[0, 6]}
        xTitle="Day"
        height={260}
        hideFilter
        loadingText="Loading chart"
        errorText="Error loading data."
        recoveryText="Retry"
        ariaLabel="Network traffic chart"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'area chart',
          xAxisAriaRoleDescription: 'x axis',
          yAxisAriaRoleDescription: 'y axis',
          xTickFormatter: (v: number) => `x${v}`,
          yTickFormatter: (v: number) => `y${v}`,
          detailTotalLabel: 'Total',
          detailPopoverDismissAriaLabel: 'Dismiss',
        }}
      />
    </Container>
  );
}

function CreditUsageChart() {
  return (
    <Container
      header={<Header variant="h2">Credit Usage</Header>}
    >
      <BarChart
        series={[
          {
            title: 'Site 1',
            type: 'bar',
            data: creditUsageData,
            color: '#688AE8',
          },
          {
            title: 'Performance goal',
            type: 'threshold',
            y: 3.5,
            color: '#5F6B7A',
          },
        ]}
        xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
        yDomain={[0, 6]}
        xScaleType="categorical"
        xTitle="Day"
        height={260}
        hideFilter
        loadingText="Loading chart"
        errorText="Error loading data."
        recoveryText="Retry"
        ariaLabel="Credit usage chart"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          xAxisAriaRoleDescription: 'x axis',
          yAxisAriaRoleDescription: 'y axis',
          yTickFormatter: (v: number) => `y${v}`,
          detailPopoverDismissAriaLabel: 'Dismiss',
        }}
      />
    </Container>
  );
}

function DevicesTable() {
  const [selectedItems, setSelectedItems] = useState<Device[]>([]);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Table
      items={deviceRows}
      columnDefinitions={deviceColumnDefinitions}
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      trackBy="id"
      enableKeyboardNavigation
      sortingDisabled={false}
      header={
        <Header
          variant="h2"
          description="Devices on your local network"
          counter={`(${deviceRows.length})`}
          actions={
            <Button variant="primary" iconAlign="right" iconName="external">
              Add Device
            </Button>
          }
        >
          My Devices
        </Header>
      }
      filter={
        <TextFilter
          filteringText={filterText}
          filteringPlaceholder="Search devices"
          filteringAriaLabel="Filter devices"
          onChange={({ detail }) => setFilterText(detail.filteringText)}
        />
      }
      pagination={
        <Pagination
          currentPageIndex={currentPage}
          pagesCount={5}
          onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
          ariaLabels={{
            nextPageLabel: 'Next page',
            previousPageLabel: 'Previous page',
            pageLabel: pageNumber => `Page ${pageNumber} of 5`,
          }}
        />
      }
      empty={
        <Box textAlign="center" color="inherit" margin={{ vertical: 'xxl' }}>
          <b>No devices found</b>
        </Box>
      }
    />
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [warningDismissed, setWarningDismissed] = useState(false);

  return (
    <>
      <DemoHeaderPortal>
        <TopNavigation
          i18nStrings={topNavI18nStrings}
          identity={{
            href: '/network-dashboard',
            title: 'Service name',
          }}
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
          utilities={[
            {
              type: 'button',
              text: 'Link',
              iconName: 'external',
              ariaLabel: 'External link',
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
              items: [
                { id: 'profile', text: 'Profile' },
                { id: 'signout', text: 'Sign out' },
              ],
            },
          ]}
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
        notifications={
          !warningDismissed ? (
            <Flashbar
              items={[
                {
                  type: 'warning',
                  content: 'This is a warning message',
                  dismissible: true,
                  dismissLabel: 'Dismiss',
                  onDismiss: () => setWarningDismissed(true),
                  id: 'warning-banner',
                },
              ]}
            />
          ) : undefined
        }
        content={
          <ContentLayout
            header={
              <div className="dashboard-page-header">
                <SpaceBetween size="s">
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

                  <div className="dashboard-filter-row">
                    <div className="dashboard-search-wrapper">
                      <TextFilter
                        filteringText={filterText}
                        filteringPlaceholder="Placeholder"
                        filteringAriaLabel="Filter dashboard"
                        onChange={({ detail }) => setFilterText(detail.filteringText)}
                      />
                    </div>
                    <div className="dashboard-pagination-wrapper">
                      <Pagination
                        currentPageIndex={currentPage}
                        pagesCount={5}
                        onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
                        ariaLabels={{
                          nextPageLabel: 'Next page',
                          previousPageLabel: 'Previous page',
                          pageLabel: pageNumber => `Page ${pageNumber} of 5`,
                        }}
                      />
                    </div>
                  </div>
                </SpaceBetween>
              </div>
            }
          >
            <SpaceBetween size="l">
              <Grid
                gridDefinition={[
                  { colspan: { default: 12, s: 6 } },
                  { colspan: { default: 12, s: 6 } },
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
    </>
  );
}
