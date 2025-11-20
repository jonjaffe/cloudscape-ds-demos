// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Flashbar from '@cloudscape-design/components/flashbar';
import Grid from '@cloudscape-design/components/grid';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';

export function App() {
  const [filteringText, setFilteringText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [flashbarItems, setFlashbarItems] = useState([
    {
      type: 'warning' as const,
      content: 'This is a warning message',
      dismissible: true,
      dismissLabel: 'Dismiss',
      onDismiss: () => setFlashbarItems([]),
      id: 'warning-message',
    },
  ]);

  // Network traffic chart data
  const networkTrafficData = [
    {
      title: 'Site 1',
      type: 'area',
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 3.2 },
        { x: 3, y: 3.5 },
        { x: 4, y: 3.8 },
        { x: 5, y: 4.2 },
        { x: 6, y: 4.8 },
        { x: 7, y: 4.5 },
        { x: 8, y: 4.2 },
        { x: 9, y: 4.5 },
        { x: 10, y: 5 },
        { x: 11, y: 5.2 },
        { x: 12, y: 5 },
      ],
    },
    {
      title: 'Site 2',
      type: 'area',
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 2.2 },
        { x: 3, y: 2.1 },
        { x: 4, y: 2.3 },
        { x: 5, y: 2.5 },
        { x: 6, y: 3.2 },
        { x: 7, y: 3.8 },
        { x: 8, y: 3.5 },
        { x: 9, y: 3.2 },
        { x: 10, y: 2.8 },
        { x: 11, y: 2.5 },
        { x: 12, y: 2.3 },
      ],
    },
  ];

  // Credit usage chart data
  const creditUsageData = [
    { x: 1, y: 183 },
    { x: 2, y: 257 },
    { x: 3, y: 213 },
    { x: 4, y: 122 },
    { x: 5, y: 210 },
  ];

  // Mock table data
  const deviceItems = Array.from({ length: 12 }, (_, i) => ({
    id: `device-${i + 1}`,
    name: 'Cell Value',
    status: 'Cell Value',
    type: 'Cell Value',
    location: 'Cell Value',
    owner: 'Cell Value',
    modified: 'Cell Value',
    tags: 'Cell Value',
  }));

  const columnDefinitions = [
    {
      id: 'name',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.name,
      sortingField: 'name',
    },
    {
      id: 'status',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.status,
      sortingField: 'status',
    },
    {
      id: 'type',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.type,
      sortingField: 'type',
    },
    {
      id: 'location',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.location,
      sortingField: 'location',
    },
    {
      id: 'owner',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.owner,
      sortingField: 'owner',
    },
    {
      id: 'modified',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.modified,
      sortingField: 'modified',
    },
    {
      id: 'tags',
      header: 'Column header',
      cell: (item: typeof deviceItems[0]) => item.tags,
      sortingField: 'tags',
    },
  ];

  return (
    <div>
      <TopNavigation
        identity={{
          href: '#',
          title: 'Service name',
          logo: {
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%230F1B2A"/%3E%3Ctext x="20" y="25" text-anchor="middle" fill="%23FFF" font-family="sans-serif" font-size="14"%3ELogo%3C/text%3E%3C/svg%3E',
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
            ariaLabel: 'Notifications (unread)',
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
            description: 'customer@example.com',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'security', text: 'Security' },
              {
                id: 'support-group',
                text: 'Support',
                items: [
                  {
                    id: 'documentation',
                    text: 'Documentation',
                    href: '#',
                    external: true,
                    externalIconAriaLabel: ' (opens in new tab)',
                  },
                  { id: 'support', text: 'Support' },
                  { id: 'feedback', text: 'Feedback' },
                ],
              },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
        i18nStrings={{
          searchIconAriaLabel: 'Search',
          searchDismissIconAriaLabel: 'Close search',
          overflowMenuTriggerText: 'More',
          overflowMenuTitleText: 'All',
          overflowMenuBackIconAriaLabel: 'Back',
          overflowMenuDismissIconAriaLabel: 'Close menu',
        }}
      />

      <AppLayout
        contentType="dashboard"
        navigationHide
        toolsHide
        content={
          <SpaceBetween size="l">
            <div>
              <BreadcrumbGroup
                items={[
                  { text: 'Service', href: '#' },
                  { text: 'Administrative Dashboard', href: '#' },
                ]}
                ariaLabel="Breadcrumbs"
              />
            </div>

            <Header
              variant="h1"
              description="Network Traffic, Credit Usage, and Your Devices"
              actions={
                <Button variant="primary" iconAlign="right" iconName="external">
                  Refresh Data
                </Button>
              }
            >
              Network Administration Dashboard
            </Header>

            <SpaceBetween size="m">
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder="Placeholder"
                filteringAriaLabel="Filter instances"
                onChange={({ detail }) => setFilteringText(detail.filteringText)}
              />

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                <Pagination
                  currentPageIndex={currentPageIndex}
                  pagesCount={5}
                  onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                  ariaLabels={{
                    nextPageLabel: 'Next page',
                    previousPageLabel: 'Previous page',
                    pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
                  }}
                />
                <ButtonDropdown items={[{ id: 'settings', text: 'Settings', iconName: 'settings' }]}>
                  <Box variant="span">
                    <span className="awsui-util-action-stripe-group">
                      <span className="awsui-util-action-stripe-group">Settings</span>
                    </span>
                  </Box>
                </ButtonDropdown>
              </div>
            </SpaceBetween>

            <Flashbar items={flashbarItems} />

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <Container>
                <AreaChart
                  series={networkTrafficData}
                  xDomain={[1, 12]}
                  yDomain={[0, 6]}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data',
                    filterPlaceholder: 'Filter data',
                    filterSelectedAriaLabel: 'selected',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'area chart',
                    xTickFormatter: (value) => `x${value}`,
                    yTickFormatter: (value) => `y${value}`,
                  }}
                  ariaLabel="Network traffic area chart"
                  height={300}
                  hideFilter
                  hideLegend={false}
                  legendTitle="Legend"
                  statusType="finished"
                  xScaleType="linear"
                  xTitle="Day"
                  yTitle="Network traffic"
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
                />
              </Container>

              <Container>
                <BarChart
                  series={[
                    {
                      title: 'Site 1',
                      type: 'bar',
                      data: creditUsageData,
                    },
                  ]}
                  xDomain={[1, 2, 3, 4, 5]}
                  yDomain={[0, 300]}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data',
                    filterPlaceholder: 'Filter data',
                    filterSelectedAriaLabel: 'selected',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'bar chart',
                    xTickFormatter: (value) => `x${value}`,
                    yTickFormatter: (value) => `y${value}`,
                  }}
                  ariaLabel="Credit usage bar chart"
                  height={300}
                  hideFilter
                  hideLegend={false}
                  legendTitle="Legend"
                  statusType="finished"
                  xScaleType="categorical"
                  xTitle="Day"
                  yTitle="Credit Usage"
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
                />
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
                columnDefinitions={columnDefinitions}
                items={deviceItems}
                loadingText="Loading devices"
                selectionType="multi"
                trackBy="id"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems as any)}
                empty={
                  <Box textAlign="center" color="inherit">
                    <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                      <b>No devices</b>
                    </Box>
                    <Button>Add device</Button>
                  </Box>
                }
                header={<Header>Devices ({deviceItems.length})</Header>}
              />
            </Container>
          </SpaceBetween>
        }
      />
    </div>
  );
}
