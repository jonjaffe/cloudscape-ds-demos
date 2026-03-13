// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import '../../styles/base.scss';
import './styles.scss';

// --- Chart Data ---

const networkTrafficSite1 = [
  { x: 1, y: 3.2 },
  { x: 2, y: 2.8 },
  { x: 3, y: 3.5 },
  { x: 4, y: 3.0 },
  { x: 5, y: 3.8 },
  { x: 6, y: 3.6 },
  { x: 7, y: 4.0 },
  { x: 8, y: 3.9 },
  { x: 9, y: 4.2 },
  { x: 10, y: 4.5 },
  { x: 11, y: 4.3 },
  { x: 12, y: 4.1 },
];

const networkTrafficSite2 = [
  { x: 1, y: 3.0 },
  { x: 2, y: 3.5 },
  { x: 3, y: 3.2 },
  { x: 4, y: 3.8 },
  { x: 5, y: 4.2 },
  { x: 6, y: 3.9 },
  { x: 7, y: 4.5 },
  { x: 8, y: 4.1 },
  { x: 9, y: 4.8 },
  { x: 10, y: 5.1 },
  { x: 11, y: 4.9 },
  { x: 12, y: 4.6 },
];

const creditUsageData = [
  { x: 'x1', y: 4.2 },
  { x: 'x2', y: 5.8 },
  { x: 'x3', y: 5.0 },
  { x: 'x4', y: 3.4 },
  { x: 'x5', y: 4.7 },
];

// --- Device Table Data ---

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

const deviceRows: Device[] = Array.from({ length: 12 }, (_, i) => ({
  id: `device-${i + 1}`,
  col1: 'Cell Value',
  col2: 'Cell Value',
  col3: 'Cell Value',
  col4: 'Cell Value',
  col5: 'Cell Value',
  col6: 'Cell Value',
  col7: 'Cell Value',
}));

const deviceColumns = [
  { id: 'col1', header: 'Column header', cell: (item: Device) => item.col1, sortingField: 'col1' },
  { id: 'col2', header: 'Column header', cell: (item: Device) => item.col2, sortingField: 'col2' },
  { id: 'col3', header: 'Column header', cell: (item: Device) => item.col3, sortingField: 'col3' },
  { id: 'col4', header: 'Column header', cell: (item: Device) => item.col4, sortingField: 'col4' },
  { id: 'col5', header: 'Column header', cell: (item: Device) => item.col5, sortingField: 'col5' },
  { id: 'col6', header: 'Column header', cell: (item: Device) => item.col6, sortingField: 'col6' },
  { id: 'col7', header: 'Column header', cell: (item: Device) => item.col7, sortingField: 'col7' },
];

const chartI18nStrings = {
  filterLabel: 'Filter displayed data',
  filterPlaceholder: 'Filter data',
  filterSelectedAriaLabel: 'selected',
  detailPopoverDismissAriaLabel: 'Dismiss',
  legendAriaLabel: 'Legend',
  chartAriaRoleDescription: 'chart',
  xAxisAriaRoleDescription: 'x axis',
  yAxisAriaRoleDescription: 'y axis',
};

// --- Warning Banner Component ---

function WarningBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="warning-banner" role="alert">
      <div className="warning-banner-left">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#warning-clip)">
            <path
              d="M8.125 5.647V8.784M8.125 10.667H8.131M14.4 8c0 3.465-2.81 6.275-6.275 6.275C4.66 14.275 1.85 11.465 1.85 8 1.85 4.535 4.66 1.725 8.125 1.725 11.59 1.725 14.4 4.535 14.4 8Z"
              stroke="#946C00"
              strokeWidth="1.882"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="warning-clip">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span className="warning-banner-text">This is a warning message</span>
      </div>
      <button className="warning-banner-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}

// --- Main Component ---

export default function NetworkAdministrationDashboard() {
  const [filterText, setFilterText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [warningDismissed, setWarningDismissed] = useState(false);

  return (
    <div className="network-dashboard-root">
      <TopNavigation
        identity={{
          href: '/',
          title: 'Service name',
          logo: {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="43" height="31"><rect width="43" height="31" rx="2" fill="none" stroke="%23D1D5DB" stroke-width="1"/><text x="6" y="21" font-family="Open Sans,sans-serif" font-size="14" fill="%23FBFBFB">Logo</text></svg>',
            alt: 'Logo',
          },
        }}
        utilities={[
          {
            type: 'button',
            text: 'Link',
            href: '#',
            external: true,
            externalIconAriaLabel: '(opens in new tab)',
          },
          {
            type: 'button',
            iconName: 'notification',
            title: 'Notifications',
            ariaLabel: 'Notifications (1 unread)',
            badge: true,
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
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
      />

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
          <ContentLayout
            header={
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
                  <div className="dashboard-filter-input">
                    <TextFilter
                      filteringText={filterText}
                      filteringPlaceholder="Placeholder"
                      filteringAriaLabel="Filter devices"
                      onChange={({ detail }) => setFilterText(detail.filteringText)}
                    />
                  </div>
                  <div className="dashboard-pagination">
                    <Pagination
                      currentPageIndex={currentPageIndex}
                      pagesCount={5}
                      onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: pageNumber => `Page ${pageNumber}`,
                      }}
                    />
                  </div>
                </div>

                {!warningDismissed && <WarningBanner onDismiss={() => setWarningDismissed(true)} />}
              </SpaceBetween>
            }
          >
            <SpaceBetween size="l">
              {/* Charts Section */}
              <Grid gridDefinition={[{ colspan: { default: 12, m: 6 } }, { colspan: { default: 12, m: 6 } }]}>
                {/* Network Traffic Area Chart */}
                <Container header={<Header variant="h2">Network traffic</Header>}>
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
                        y: 3.5,
                        color: '#5F6B7A',
                      },
                    ]}
                    xDomain={[1, 12]}
                    yDomain={[1, 6]}
                    i18nStrings={{
                      ...chartI18nStrings,
                      xTickFormatter: (value: number) => `x${value}`,
                      yTickFormatter: (value: number) => `y${value}`,
                      chartAriaRoleDescription: 'area chart',
                    }}
                    ariaLabel="Network traffic chart"
                    height={250}
                    hideFilter
                    xTitle="Day"
                    xScaleType="linear"
                  />
                </Container>

                {/* Credit Usage Bar Chart */}
                <Container header={<Header variant="h2">Credit Usage</Header>}>
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
                    yDomain={[1, 6]}
                    i18nStrings={{
                      ...chartI18nStrings,
                      yTickFormatter: (value: number) => `y${value}`,
                      chartAriaRoleDescription: 'bar chart',
                    }}
                    ariaLabel="Credit usage chart"
                    height={250}
                    hideFilter
                    xTitle="Day"
                  />
                </Container>
              </Grid>

              {/* My Devices Table */}
              <Table
                columnDefinitions={deviceColumns}
                items={deviceRows}
                selectionType="multi"
                selectedItems={selectedDevices}
                onSelectionChange={({ detail }) => setSelectedDevices(detail.selectedItems)}
                trackBy="id"
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
                    <Box variant="p">No devices found.</Box>
                  </Box>
                }
                variant="container"
              />
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </div>
  );
}
