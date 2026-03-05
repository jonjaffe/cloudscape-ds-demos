import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Flashbar from '@cloudscape-design/components/flashbar';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import { commonChartProps } from '../dashboard/widgets/chart-commons';
import styles from './styles.module.scss';

const networkTrafficSeries = [
  {
    title: 'Site 1',
    type: 'area' as const,
    color: '#688AE8',
    data: [
      { x: 'x1', y: 3.2 },
      { x: 'x2', y: 3.5 },
      { x: 'x3', y: 3.8 },
      { x: 'x4', y: 4.0 },
      { x: 'x5', y: 3.7 },
      { x: 'x6', y: 4.2 },
      { x: 'x7', y: 4.5 },
      { x: 'x8', y: 4.8 },
      { x: 'x9', y: 4.3 },
      { x: 'x10', y: 4.6 },
      { x: 'x11', y: 4.4 },
      { x: 'x12', y: 4.7 },
    ],
  },
  {
    title: 'Site 2',
    type: 'area' as const,
    color: '#C33D69',
    data: [
      { x: 'x1', y: 3.0 },
      { x: 'x2', y: 3.2 },
      { x: 'x3', y: 3.6 },
      { x: 'x4', y: 3.9 },
      { x: 'x5', y: 4.8 },
      { x: 'x6', y: 4.5 },
      { x: 'x7', y: 4.2 },
      { x: 'x8', y: 4.9 },
      { x: 'x9', y: 5.1 },
      { x: 'x10', y: 4.7 },
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

const creditUsageSeries = [
  {
    title: 'Site 1',
    type: 'bar' as const,
    color: '#688AE8',
    data: [
      { x: 'x1', y: 4.2 },
      { x: 'x2', y: 5.7 },
      { x: 'x3', y: 5.0 },
      { x: 'x4', y: 3.2 },
      { x: 'x5', y: 4.8 },
    ],
  },
  {
    title: 'Performance goal',
    type: 'threshold' as const,
    y: 4.0,
    color: '#5F6B7A',
  },
];

const deviceRows = Array.from({ length: 12 }, (_, i) => ({
  id: `device-${i + 1}`,
  col1: 'Cell Value',
  col2: 'Cell Value',
  col3: 'Cell Value',
  col4: 'Cell Value',
  col5: 'Cell Value',
  col6: 'Cell Value',
  col7: 'Cell Value',
}));

const columnDefinitions = [
  { id: 'col1', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col1, sortingField: 'col1' },
  { id: 'col2', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col2, sortingField: 'col2' },
  { id: 'col3', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col3, sortingField: 'col3' },
  { id: 'col4', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col4, sortingField: 'col4' },
  { id: 'col5', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col5, sortingField: 'col5' },
  { id: 'col6', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col6, sortingField: 'col6' },
  { id: 'col7', header: 'Column header', cell: (item: (typeof deviceRows)[0]) => item.col7, sortingField: 'col7' },
];

export default function NetworkAdminDashboard() {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<typeof deviceRows>([]);

  return (
    <>
      <div id="nav-header">
        <TopNavigation
          identity={{
            href: '/',
            title: 'Service name',
            logo: {
              src: '',
              alt: 'Logo',
            },
          }}
          search={
            <TextFilter
              filteringText=""
              filteringPlaceholder="Search"
              filteringAriaLabel="Search"
              onChange={() => {}}
            />
          }
          utilities={[
            {
              type: 'button',
              text: 'Link',
              href: '#',
              external: true,
              externalIconAriaLabel: '(opens in a new tab)',
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
      </div>

      <AppLayout
        headerSelector="#nav-header"
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

                <div className={styles.filterRow}>
                  <div className={styles.filterInput}>
                    <TextFilter
                      filteringText={filterText}
                      filteringPlaceholder="Placeholder"
                      filteringAriaLabel="Filter devices"
                      onChange={({ detail }) => setFilterText(detail.filteringText)}
                    />
                  </div>
                  <div className={styles.paginationControls}>
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
                    <Button iconName="settings" variant="icon" ariaLabel="Preferences" />
                  </div>
                </div>

                {!warningDismissed && (
                  <Flashbar
                    items={[
                      {
                        type: 'warning',
                        content: 'This is a warning message',
                        dismissible: true,
                        dismissLabel: 'Dismiss',
                        onDismiss: () => setWarningDismissed(true),
                        id: 'warning-1',
                      },
                    ]}
                  />
                )}
              </SpaceBetween>
            }
          >
            <SpaceBetween size="l">
              {/* Charts section */}
              <Grid gridDefinition={[{ colspan: { default: 12, m: 6 } }, { colspan: { default: 12, m: 6 } }]}>
                <Container
                  header={<Header variant="h3">Network traffic</Header>}
                >
                  <AreaChart
                    {...commonChartProps}
                    series={networkTrafficSeries}
                    xDomain={['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11', 'x12']}
                    yDomain={[0, 6]}
                    xScaleType="categorical"
                    xTitle="Day"
                    yTitle=""
                    ariaLabel="Network traffic chart"
                    height={300}
                    hideFilter
                    i18nStrings={{
                      ...commonChartProps.i18nStrings,
                      chartAriaRoleDescription: 'area chart',
                    }}
                    fitHeight={false}
                  />
                </Container>

                <Container
                  header={<Header variant="h3">Credit Usage</Header>}
                >
                  <BarChart
                    {...commonChartProps}
                    series={creditUsageSeries}
                    xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
                    yDomain={[0, 6]}
                    xScaleType="categorical"
                    xTitle="Day"
                    yTitle=""
                    ariaLabel="Credit usage chart"
                    height={300}
                    hideFilter
                    i18nStrings={{
                      ...commonChartProps.i18nStrings,
                      chartAriaRoleDescription: 'bar chart',
                    }}
                    fitHeight={false}
                  />
                </Container>
              </Grid>

              {/* Devices table */}
              <Table
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
                columnDefinitions={columnDefinitions}
                items={deviceRows}
                selectionType="multi"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                trackBy="id"
                variant="full-page"
                stickyHeader
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No devices</b>
                    <Box variant="p" color="inherit">
                      No devices found on your network.
                    </Box>
                  </Box>
                }
              />
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </>
  );
}
