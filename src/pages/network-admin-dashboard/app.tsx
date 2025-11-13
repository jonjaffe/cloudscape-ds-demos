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
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import Modal from '@cloudscape-design/components/modal';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';

import '@cloudscape-design/global-styles/index.css';
import './styles.scss';

// Mock data for the charts
const networkTrafficData = [
  {
    title: 'Site 1',
    type: 'area',
    data: [
      { x: 'x1', y: 3 },
      { x: 'x2', y: 3.5 },
      { x: 'x3', y: 3.2 },
      { x: 'x4', y: 3.8 },
      { x: 'x5', y: 4 },
      { x: 'x6', y: 4.2 },
      { x: 'x7', y: 3.9 },
      { x: 'x8', y: 3.5 },
      { x: 'x9', y: 3.7 },
      { x: 'x10', y: 4.5 },
      { x: 'x11', y: 4.8 },
      { x: 'x12', y: 4.3 },
    ],
  },
  {
    title: 'Site 2',
    type: 'area',
    data: [
      { x: 'x1', y: 1.8 },
      { x: 'x2', y: 1.5 },
      { x: 'x3', y: 1.3 },
      { x: 'x4', y: 1.1 },
      { x: 'x5', y: 0.6 },
      { x: 'x6', y: 0.7 },
      { x: 'x7', y: 0.8 },
      { x: 'x8', y: 0.9 },
      { x: 'x9', y: 1.0 },
      { x: 'x10', y: 0.5 },
      { x: 'x11', y: 0.2 },
      { x: 'x12', y: 0.4 },
    ],
  },
];

const creditUsageData = [
  { x: 'x1', y: 183 },
  { x: 'x2', y: 257 },
  { x: 'x3', y: 213 },
  { x: 'x4', y: 122 },
  { x: 'x5', y: 210 },
];

// Mock table data
const createTableItem = () => ({
  col1: 'Cell Value',
  col2: 'Cell Value',
  col3: 'Cell Value',
  col4: 'Cell Value',
  col5: 'Cell Value',
  col6: 'Cell Value',
  col7: 'Cell Value',
});

const initialTableItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  ...createTableItem(),
}));

export function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [tableItems, setTableItems] = useState(initialTableItems);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState({ label: 'Router', value: 'router' });
  const [deviceIp, setDeviceIp] = useState('');
  const [deviceStatus, setDeviceStatus] = useState({ label: 'Active', value: 'active' });
  const [flashbarItems, setFlashbarItems] = useState([
    {
      type: 'warning' as const,
      content: 'This is a warning message',
      dismissible: true,
      onDismiss: () => setFlashbarItems([]),
      id: 'warning-message',
    },
  ]);

  const handleAddDevice = () => {
    const newDevice = {
      id: tableItems.length + 1,
      col1: deviceName || 'Cell Value',
      col2: deviceType.label || 'Cell Value',
      col3: deviceIp || 'Cell Value',
      col4: deviceStatus.label || 'Cell Value',
      col5: 'Cell Value',
      col6: 'Cell Value',
      col7: 'Cell Value',
    };
    setTableItems([...tableItems, newDevice]);
    setIsModalVisible(false);
    setDeviceName('');
    setDeviceType({ label: 'Router', value: 'router' });
    setDeviceIp('');
    setDeviceStatus({ label: 'Active', value: 'active' });
  };

  return (
    <>
      <TopNavigation
        identity={{
          href: '#',
          title: 'Service name',
          logo: {
            src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23232F3E"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-family="sans-serif" font-size="14" text-anchor="middle" dy=".3em"%3ELogo%3C/text%3E%3C/svg%3E',
            alt: 'Service Logo',
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
            ariaLabel: 'Notifications',
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
            description: 'Customer name',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
        i18nStrings={{
          searchIconAriaLabel: 'Search',
          searchDismissIconAriaLabel: 'Close search',
          overflowMenuTriggerText: 'More',
        }}
      />

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
            }
          >
            <SpaceBetween size="l">
              {flashbarItems.length > 0 && <Flashbar items={flashbarItems} />}

              <Container
                header={
                  <Grid gridDefinition={[{ colspan: { default: 12, xs: 6 } }, { colspan: { default: 12, xs: 6 } }]}>
                    <TextFilter
                      filteringText={filterText}
                      filteringPlaceholder="Placeholder"
                      onChange={({ detail }) => setFilterText(detail.filteringText)}
                    />
                    <div className="pagination-container">
                      <Pagination
                        currentPageIndex={currentPageIndex}
                        pagesCount={5}
                        onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                      />
                    </div>
                  </Grid>
                }
              />

              <Grid
                gridDefinition={[
                  { colspan: { default: 12, xs: 12, s: 6 } },
                  { colspan: { default: 12, xs: 12, s: 6 } },
                ]}
              >
                <Container fitHeight>
                  <AreaChart
                    series={networkTrafficData}
                    xDomain={['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11', 'x12']}
                    yDomain={[0, 6]}
                    height={300}
                    xTitle="Day"
                    yTitle="Network traffic"
                    legendTitle="Legend"
                    i18nStrings={{
                      filterLabel: 'Filter displayed data',
                      filterPlaceholder: 'Filter data',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'area chart',
                    }}
                    ariaLabel="Network traffic area chart"
                    ariaDescription="Area chart showing network traffic over time for two sites with a performance goal threshold line."
                  >
                    <Box variant="small" color="text-status-inactive">
                      Performance goal
                    </Box>
                  </AreaChart>
                </Container>

                <Container fitHeight>
                  <BarChart
                    series={[
                      {
                        title: 'Site 1',
                        type: 'bar',
                        data: creditUsageData,
                      },
                    ]}
                    xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
                    yDomain={[0, 300]}
                    height={300}
                    xTitle="Day"
                    yTitle="Credit Usage"
                    legendTitle="Legend"
                    i18nStrings={{
                      filterLabel: 'Filter displayed data',
                      filterPlaceholder: 'Filter data',
                      filterSelectedAriaLabel: 'selected',
                      legendAriaLabel: 'Legend',
                      chartAriaRoleDescription: 'bar chart',
                    }}
                    ariaLabel="Credit usage bar chart"
                    ariaDescription="Bar chart showing credit usage over time."
                  />
                </Container>
              </Grid>

              <Table
                columnDefinitions={[
                  {
                    id: 'col1',
                    header: 'Column header',
                    cell: item => item.col1,
                    sortingField: 'col1',
                  },
                  {
                    id: 'col2',
                    header: 'Column header',
                    cell: item => item.col2,
                    sortingField: 'col2',
                  },
                  {
                    id: 'col3',
                    header: 'Column header',
                    cell: item => item.col3,
                    sortingField: 'col3',
                  },
                  {
                    id: 'col4',
                    header: 'Column header',
                    cell: item => item.col4,
                    sortingField: 'col4',
                  },
                  {
                    id: 'col5',
                    header: 'Column header',
                    cell: item => item.col5,
                    sortingField: 'col5',
                  },
                  {
                    id: 'col6',
                    header: 'Column header',
                    cell: item => item.col6,
                    sortingField: 'col6',
                  },
                  {
                    id: 'col7',
                    header: 'Column header',
                    cell: item => item.col7,
                    sortingField: 'col7',
                  },
                ]}
                items={tableItems}
                selectionType="multi"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                header={
                  <Header
                    variant="h2"
                    description="Devices on your local network"
                    actions={
                      <Button
                        variant="primary"
                        iconAlign="right"
                        iconName="external"
                        onClick={() => setIsModalVisible(true)}
                      >
                        Add Device
                      </Button>
                    }
                  >
                    My Devices
                  </Header>
                }
                loadingText="Loading devices"
                trackBy="id"
              />
            </SpaceBetween>
          </ContentLayout>
        }
      />

      <Modal
        onDismiss={() => setIsModalVisible(false)}
        visible={isModalVisible}
        header="Add New Device"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddDevice}>
                Add Device
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Form>
          <SpaceBetween size="m">
            <FormField label="Device Name" description="Enter a name for the device">
              <Input
                value={deviceName}
                onChange={({ detail }) => setDeviceName(detail.value)}
                placeholder="e.g., Office Router"
              />
            </FormField>

            <FormField label="Device Type" description="Select the type of device">
              <Select
                selectedOption={deviceType}
                onChange={({ detail }) => setDeviceType(detail.selectedOption)}
                options={[
                  { label: 'Router', value: 'router' },
                  { label: 'Switch', value: 'switch' },
                  { label: 'Access Point', value: 'access-point' },
                  { label: 'Firewall', value: 'firewall' },
                  { label: 'Server', value: 'server' },
                  { label: 'Workstation', value: 'workstation' },
                ]}
                placeholder="Select device type"
              />
            </FormField>

            <FormField label="IP Address" description="Enter the device IP address">
              <Input
                value={deviceIp}
                onChange={({ detail }) => setDeviceIp(detail.value)}
                placeholder="e.g., 192.168.1.1"
              />
            </FormField>

            <FormField label="Status" description="Current device status">
              <Select
                selectedOption={deviceStatus}
                onChange={({ detail }) => setDeviceStatus(detail.selectedOption)}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Maintenance', value: 'maintenance' },
                ]}
                placeholder="Select status"
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Modal>
    </>
  );
}
