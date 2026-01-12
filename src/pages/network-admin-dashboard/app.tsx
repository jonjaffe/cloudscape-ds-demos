// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Flashbar from '@cloudscape-design/components/flashbar';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { CustomAppLayout, Navigation } from '../commons/common-components';
import { creditUsageSeries, devicesData, networkTrafficSeries } from './data';

export function App() {
  const [filteringText, setFilteringText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [showBanner, setShowBanner] = useState(true);

  const columnDefinitions = [
    {
      id: 'column1',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column1,
    },
    {
      id: 'column2',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column2,
    },
    {
      id: 'column3',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column3,
    },
    {
      id: 'column4',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column4,
    },
    {
      id: 'column5',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column5,
    },
    {
      id: 'column6',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column6,
    },
    {
      id: 'column7',
      header: 'Column header',
      cell: (item: typeof devicesData[0]) => item.column7,
    },
  ];

  return (
    <CustomAppLayout
      navigation={<Navigation activeHref="#/network-admin-dashboard" />}
      toolsHide
      content={
        <SpaceBetween size="l">
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
              <Button variant="primary" iconName="refresh">
                Refresh Data
              </Button>
            }
          >
            Network Administration Dashboard
          </Header>

          <SpaceBetween size="m">
            <div className="search-pagination-wrapper">
              <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                <TextFilter
                  filteringText={filteringText}
                  onChange={({ detail }) => setFilteringText(detail.filteringText)}
                  filteringPlaceholder="Placeholder"
                />
                <div className="pagination-controls">
                  <Pagination
                    currentPageIndex={currentPageIndex}
                    onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                    pagesCount={5}
                  />
                  <Button variant="icon" iconName="settings" />
                </div>
              </Grid>
            </div>

            {showBanner && (
              <Flashbar
                items={[
                  {
                    type: 'warning',
                    dismissible: true,
                    content: 'This is a warning message',
                    onDismiss: () => setShowBanner(false),
                    buttonText: 'Dismiss',
                    id: 'warning-message',
                  },
                ]}
              />
            )}

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <Container header={<Header variant="h2">Network traffic</Header>}>
                <SpaceBetween size="m">
                  <LineChart
                    series={networkTrafficSeries}
                    xDomain={[0, 11]}
                    yDomain={[0, 6]}
                    height={280}
                    hideFilter
                    hideLegend
                    statusType="finished"
                    detailPopoverSize="medium"
                    xTitle="Day"
                    yTitle=""
                    ariaLabel="Network traffic"
                    i18nStrings={{
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'area chart',
                      xTickFormatter: (value) => `x${Math.floor(value) + 1}`,
                      yTickFormatter: (value) => `y${value}`,
                    }}
                  />
                  <Box variant="small" color="text-body-secondary">
                    <SpaceBetween direction="horizontal" size="m">
                      <div className="chart-legend-item">
                        <span className="legend-marker site-1"></span>
                        Site 1
                      </div>
                      <div className="chart-legend-item">
                        <span className="legend-marker site-2"></span>
                        Site 2
                      </div>
                      <div className="chart-legend-item">
                        <span className="legend-marker performance-goal"></span>
                        Performance goal
                      </div>
                    </SpaceBetween>
                  </Box>
                </SpaceBetween>
              </Container>

              <Container header={<Header variant="h2">Credit Usage</Header>}>
                <SpaceBetween size="m">
                  <BarChart
                    series={creditUsageSeries}
                    xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
                    yDomain={[0, 6]}
                    height={280}
                    hideFilter
                    hideLegend
                    statusType="finished"
                    xTitle="Day"
                    yTitle=""
                    ariaLabel="Credit usage"
                    i18nStrings={{
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'bar chart',
                      yTickFormatter: (value) => `y${value}`,
                    }}
                  />
                  <Box variant="small" color="text-body-secondary">
                    <SpaceBetween direction="horizontal" size="m">
                      <div className="chart-legend-item">
                        <span className="legend-marker bar-site-1"></span>
                        Site 1
                      </div>
                      <div className="chart-legend-item">
                        <span className="legend-marker performance-goal"></span>
                        Performance goal
                      </div>
                    </SpaceBetween>
                  </Box>
                </SpaceBetween>
              </Container>
            </Grid>

            <Header
              variant="h2"
              description="Devices on your local network"
              actions={
                <Button variant="primary" iconName="add-plus">
                  Add Device
                </Button>
              }
            >
              My Devices
            </Header>

            <Table
              columnDefinitions={columnDefinitions}
              items={devicesData}
              selectionType="multi"
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
          </SpaceBetween>
        </SpaceBetween>
      }
    />
  );
}
