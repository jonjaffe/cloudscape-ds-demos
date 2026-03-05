// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Grid from '@cloudscape-design/components/grid';
import Table from '@cloudscape-design/components/table';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';

import '../../styles/base.scss';
import styles from './network-admin-dashboard.module.scss';

const i18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close menu',
};

const networkTrafficData = [
  { x: 'x1', site1: 3.2, site2: 3.5 },
  { x: 'x2', site1: 3.0, site2: 3.3 },
  { x: 'x3', site1: 2.9, site2: 3.1 },
  { x: 'x4', site1: 3.1, site2: 3.6 },
  { x: 'x5', site1: 3.4, site2: 4.0 },
  { x: 'x6', site1: 3.6, site2: 4.4 },
  { x: 'x7', site1: 3.8, site2: 4.6 },
  { x: 'x8', site1: 4.0, site2: 4.3 },
  { x: 'x9', site1: 4.2, site2: 4.8 },
  { x: 'x10', site1: 4.5, site2: 5.0 },
  { x: 'x11', site1: 4.3, site2: 4.7 },
  { x: 'x12', site1: 4.1, site2: 4.5 },
];

const creditUsageData = [
  { x: 'x1', value: 4.2 },
  { x: 'x2', value: 5.5 },
  { x: 'x3', value: 4.8 },
  { x: 'x4', value: 3.2 },
  { x: 'x5', value: 4.6 },
];

const deviceItems = Array.from({ length: 11 }, (_, i) => ({
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
  { id: 'col1', header: 'Column header', cell: (item: { col1: string }) => item.col1 },
  { id: 'col2', header: 'Column header', cell: (item: { col2: string }) => item.col2 },
  { id: 'col3', header: 'Column header', cell: (item: { col3: string }) => item.col3 },
  { id: 'col4', header: 'Column header', cell: (item: { col4: string }) => item.col4 },
  { id: 'col5', header: 'Column header', cell: (item: { col5: string }) => item.col5 },
  { id: 'col6', header: 'Column header', cell: (item: { col6: string }) => item.col6 },
  { id: 'col7', header: 'Column header', cell: (item: { col7: string }) => item.col7 },
];

export default function NetworkAdminDashboard() {
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [warningVisible, setWarningVisible] = useState(true);
  const [selectedItems, setSelectedItems] = useState<(typeof deviceItems)[0][]>([]);

  return (
    <div className={styles['dashboard-wrapper']}>
      <div id="top-nav">
        <TopNavigation
          i18nStrings={i18nStrings}
          identity={{
            href: '#',
            title: 'Service name',
            logo: {
              src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
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
              ariaLabel: 'Notifications',
              badge: true,
              disableUtilityCollapse: false,
            },
            {
              type: 'button',
              iconName: 'settings',
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
      </div>

      <AppLayout
        navigationHide
        toolsHide
        headerSelector="#top-nav"
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Service', href: '/' },
              { text: 'Administrative Dashboard', href: '#' },
            ]}
          />
        }
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

                <div className={styles['filter-pagination-row']}>
                  <div className={styles['filter-container']}>
                    <TextFilter
                      filteringText={filterText}
                      filteringPlaceholder="Placeholder"
                      filteringAriaLabel="Filter devices"
                      onChange={({ detail }) => setFilterText(detail.filteringText)}
                    />
                  </div>
                  <div className={styles['pagination-controls']}>
                    <Pagination
                      currentPageIndex={currentPage}
                      pagesCount={5}
                      onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
                      ariaLabels={{
                        nextPageLabel: 'Next page',
                        previousPageLabel: 'Previous page',
                        pageLabel: n => `Page ${n}`,
                      }}
                    />
                    <Button iconName="settings" variant="icon" ariaLabel="Collection preferences" />
                  </div>
                </div>

                {warningVisible && (
                  <div className={styles['warning-banner']}>
                    <div className={styles['warning-banner-content']}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                          <path
                            d="M8.125 5.647V8.784M8.125 10.667H8.131M14.4 8c0 3.465-2.809 6.274-6.275 6.274C4.66 14.274 1.85 11.465 1.85 8 1.85 4.535 4.66 1.725 8.125 1.725c3.466 0 6.275 2.81 6.275 6.275Z"
                            stroke="#946C00"
                            strokeWidth="1.882"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className={styles['warning-text']}>This is a warning message</span>
                    </div>
                    <button className={styles['warning-dismiss']} onClick={() => setWarningVisible(false)}>
                      Dismiss
                    </button>
                  </div>
                )}
              </SpaceBetween>
            }
          >
            <SpaceBetween size="l">
              {/* Charts Section */}
              <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }, { colspan: { default: 12, s: 6 } }]}>
                {/* Area Chart - Network Traffic */}
                <div className={styles['chart-card']}>
                  <AreaChart
                    series={[
                      {
                        title: 'Site 1',
                        type: 'area',
                        data: networkTrafficData.map(d => ({ x: d.x, y: d.site1 })),
                        color: '#688AE8',
                      },
                      {
                        title: 'Site 2',
                        type: 'area',
                        data: networkTrafficData.map(d => ({ x: d.x, y: d.site2 })),
                        color: '#C33D69',
                      },
                      {
                        title: 'Performance goal',
                        type: 'threshold',
                        y: 3.5,
                        color: '#5F6B7A',
                      },
                    ]}
                    xDomain={networkTrafficData.map(d => d.x)}
                    yDomain={[0, 6]}
                    i18nStrings={{
                      xTickFormatter: (v: string) => v,
                      yTickFormatter: (v: number) => `y${Math.round(v)}`,
                      filterLabel: 'Filter series',
                      filterPlaceholder: 'Filter series',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'area chart',
                      xAxisAriaRoleDescription: 'x axis',
                      yAxisAriaRoleDescription: 'y axis',
                      detailTotalLabel: 'Total',
                    }}
                    xTitle="Day"
                    yTitle="Network traffic"
                    hideFilter
                    height={300}
                    ariaLabel="Network traffic chart"
                    loadingText="Loading chart"
                    errorText="Error loading data"
                    recoveryText="Retry"
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>No data</b>
                      </Box>
                    }
                    noMatch={
                      <Box textAlign="center" color="inherit">
                        <b>No matching data</b>
                      </Box>
                    }
                  />
                </div>

                {/* Bar Chart - Credit Usage */}
                <div className={styles['chart-card']}>
                  <BarChart
                    series={[
                      {
                        title: 'Site 1',
                        type: 'bar',
                        data: creditUsageData.map(d => ({ x: d.x, y: d.value })),
                        color: '#539FE5',
                      },
                      {
                        title: 'Performance goal',
                        type: 'threshold',
                        y: 3.5,
                        color: '#5F6B7A',
                      },
                    ]}
                    xDomain={creditUsageData.map(d => d.x)}
                    yDomain={[0, 6]}
                    i18nStrings={{
                      xTickFormatter: (v: string) => v,
                      yTickFormatter: (v: number) => `y${Math.round(v)}`,
                      filterLabel: 'Filter series',
                      filterPlaceholder: 'Filter series',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'bar chart',
                      xAxisAriaRoleDescription: 'x axis',
                      yAxisAriaRoleDescription: 'y axis',
                      detailTotalLabel: 'Total',
                      detailTotalFormatter: (v: number) => `${v}`,
                    }}
                    xTitle="Day"
                    yTitle="Credit Usage"
                    hideFilter
                    height={300}
                    ariaLabel="Credit usage chart"
                    loadingText="Loading chart"
                    errorText="Error loading data"
                    recoveryText="Retry"
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>No data</b>
                      </Box>
                    }
                    noMatch={
                      <Box textAlign="center" color="inherit">
                        <b>No matching data</b>
                      </Box>
                    }
                  />
                </div>
              </Grid>

              {/* Devices Table */}
              <Table
                selectionType="multi"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                columnDefinitions={deviceColumnDefinitions}
                items={deviceItems}
                trackBy="id"
                header={
                  <Header
                    variant="h2"
                    description="Devices on your local network"
                    counter={`(${deviceItems.length})`}
                    actions={
                      <Button variant="primary" iconName="external" iconAlign="right">
                        Add Device
                      </Button>
                    }
                  >
                    My Devices
                  </Header>
                }
                stickyHeader
                enableKeyboardNavigation
              />
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </div>
  );
}
