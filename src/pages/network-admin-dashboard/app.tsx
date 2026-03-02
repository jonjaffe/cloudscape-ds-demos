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
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import enMessages from '@cloudscape-design/components/i18n/messages/all.en.json';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import '../../styles/base.scss';
import '../../styles/top-navigation.scss';

// ── Side Navigation ─────────────────────────────────────────────────────────

const navItems: SideNavigationProps.Item[] = [
  {
    type: 'section',
    text: 'Network',
    items: [
      { type: 'link', text: 'Overview', href: '#/overview' },
      { type: 'link', text: 'Traffic', href: '#/traffic' },
      { type: 'link', text: 'Credit Usage', href: '#/credit-usage' },
    ],
  },
  {
    type: 'section',
    text: 'Devices',
    items: [
      { type: 'link', text: 'My Devices', href: '#/devices' },
      { type: 'link', text: 'Device Groups', href: '#/device-groups' },
    ],
  },
];

// ── Chart Data ───────────────────────────────────────────────────────────────

const days = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11', 'x12'];

const site1TrafficData = days.map((day, i) => ({ x: day, y: [2, 3, 3, 4, 3, 3.5, 4, 4.5, 4, 4.5, 4.2, 4.5][i] }));
const site2TrafficData = days.map((day, i) => ({ x: day, y: [3, 3.5, 4, 4.5, 4, 4.5, 4.5, 5, 4.5, 5, 4.8, 4.8][i] }));
const performanceGoalTraffic = days.map(day => ({ x: day, y: 3.5 }));

const creditDays = ['x1', 'x2', 'x3', 'x4', 'x5'];
const site1CreditData = creditDays.map((day, i) => ({ x: day, y: [4, 6, 5, 3, 4.5][i] }));
const performanceGoalCredit = creditDays.map(day => ({ x: day, y: 3.5 }));

// ── Table Data ───────────────────────────────────────────────────────────────

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

const deviceItems: Device[] = Array.from({ length: 12 }, (_, i) => ({
  id: `device-${i}`,
  col1: 'Cell Value',
  col2: 'Cell Value',
  col3: 'Cell Value',
  col4: 'Cell Value',
  col5: 'Cell Value',
  col6: 'Cell Value',
  col7: 'Cell Value',
}));

const deviceColumnDefs = [
  { id: 'col1', header: 'Column header', cell: (item: Device) => item.col1, sortingField: 'col1' },
  { id: 'col2', header: 'Column header', cell: (item: Device) => item.col2, sortingField: 'col2' },
  { id: 'col3', header: 'Column header', cell: (item: Device) => item.col3, sortingField: 'col3' },
  { id: 'col4', header: 'Column header', cell: (item: Device) => item.col4, sortingField: 'col4' },
  { id: 'col5', header: 'Column header', cell: (item: Device) => item.col5, sortingField: 'col5' },
  { id: 'col6', header: 'Column header', cell: (item: Device) => item.col6, sortingField: 'col6' },
  { id: 'col7', header: 'Column header', cell: (item: Device) => item.col7, sortingField: 'col7' },
];

// ── Top Nav Portal ────────────────────────────────────────────────────────────

const i18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close menu',
};

interface TopNavPortalProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
}

function TopNavPortal({ searchValue, onSearchChange }: TopNavPortalProps) {
  const domNode = document.querySelector('#h');
  if (!domNode) return null;

  return createPortal(
    <TopNavigation
      i18nStrings={i18nStrings}
      identity={{ href: '#', title: 'Service name' }}
      search={
        <Input
          ariaLabel="Search"
          clearAriaLabel="Clear"
          value={searchValue}
          type="search"
          placeholder="Search"
          onChange={({ detail }) => onSearchChange(detail.value)}
        />
      }
      utilities={[
        { type: 'button', text: 'Link', href: '#', external: true },
        { type: 'button', iconName: 'notification', ariaLabel: 'Notifications', disableUtilityCollapse: true },
        { type: 'button', iconName: 'settings', title: 'Settings', ariaLabel: 'Settings' },
        {
          type: 'menu-dropdown',
          text: 'Customer name',
          iconName: 'user-profile',
          items: [
            { id: 'profile', text: 'Profile' },
            { id: 'preferences', text: 'Preferences' },
            { id: 'signout', text: 'Sign out' },
          ],
        },
      ]}
    />,
    domNode,
  );
}

// ── Warning Banner ────────────────────────────────────────────────────────────

interface WarningBannerProps {
  onDismiss: () => void;
}

function WarningBanner({ onDismiss }: WarningBannerProps) {
  return (
    <div className="warning-banner">
      <div className="warning-banner__content">
        <svg className="warning-banner__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_warning)">
            <mask id="mask0_warning" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
              <path d="M15.6544 0.470581H0.595581V15.5294H15.6544V0.470581Z" fill="white" />
            </mask>
            <g mask="url(#mask0_warning)">
              <path
                d="M8.125 5.64703V8.78428M8.125 10.6666H8.13128M14.3995 7.99997C14.3995 11.4653 11.5903 14.2745 8.125 14.2745C4.65969 14.2745 1.85049 11.4653 1.85049 7.99997C1.85049 4.53466 4.65969 1.72546 8.125 1.72546C11.5903 1.72546 14.3995 4.53466 14.3995 7.99997Z"
                stroke="#946C00"
                strokeWidth="1.88235"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_warning">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span className="warning-banner__message">This is a warning message</span>
      </div>
      <button className="warning-banner__dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}

// ── Charts Section ────────────────────────────────────────────────────────────

function ChartsSection() {
  return (
    <ColumnLayout columns={2} borders="vertical">
      <Container header={<Header variant="h3">Network traffic</Header>}>
        <AreaChart
          series={[
            {
              title: 'Site 1',
              type: 'area',
              data: site1TrafficData,
              color: '#7B9FE0',
            },
            {
              title: 'Site 2',
              type: 'area',
              data: site2TrafficData,
              color: '#E8869A',
            },
            {
              title: 'Performance goal',
              type: 'threshold',
              y: 3.5,
              color: '#414D5C',
            },
          ]}
          xDomain={days}
          yDomain={[0, 6]}
          xScaleType="categorical"
          xTitle="Day"
          hideFilter
          statusType="finished"
          ariaLabel="Network traffic area chart"
          height={250}
          i18nStrings={{
            filterLabel: 'Filter displayed data',
            filterPlaceholder: 'Filter data',
            filterSelectedAriaLabel: 'selected',
            legendAriaLabel: 'Legend',
            chartAriaRoleDescription: 'area chart',
            xAxisAriaRoleDescription: 'x axis',
            yAxisAriaRoleDescription: 'y axis',
          }}
        />
      </Container>
      <Container header={<Header variant="h3">Credit Usage</Header>}>
        <BarChart
          series={[
            {
              title: 'Site 1',
              type: 'bar',
              data: site1CreditData,
              color: '#7B9FE0',
            },
            {
              title: 'Performance goal',
              type: 'threshold',
              y: 3.5,
              color: '#414D5C',
            },
          ]}
          xDomain={creditDays}
          yDomain={[0, 7]}
          xScaleType="categorical"
          xTitle="Day"
          hideFilter
          statusType="finished"
          ariaLabel="Credit usage bar chart"
          height={250}
          i18nStrings={{
            filterLabel: 'Filter displayed data',
            filterPlaceholder: 'Filter data',
            filterSelectedAriaLabel: 'selected',
            legendAriaLabel: 'Legend',
            chartAriaRoleDescription: 'bar chart',
            xAxisAriaRoleDescription: 'x axis',
            yAxisAriaRoleDescription: 'y axis',
          }}
        />
      </Container>
    </ColumnLayout>
  );
}

// ── Main Content ──────────────────────────────────────────────────────────────

function DashboardContent() {
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [warningVisible, setWarningVisible] = useState(true);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);

  return (
    <SpaceBetween size="l">
      {/* Page header with search and pagination */}
      <div className="dashboard-header-controls">
        <div className="dashboard-search-row">
          <div className="dashboard-search-input">
            <TextFilter
              filteringText={filterText}
              filteringPlaceholder="Placeholder"
              filteringAriaLabel="Filter resources"
              onChange={({ detail }) => setFilterText(detail.filteringText)}
            />
          </div>
          <div className="dashboard-pagination-row">
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
      </div>

      {/* Warning banner */}
      {warningVisible && <WarningBanner onDismiss={() => setWarningVisible(false)} />}

      {/* Charts */}
      <ChartsSection />

      {/* My Devices table */}
      <Table
        header={
          <Header
            variant="h1"
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
        columnDefinitions={deviceColumnDefs}
        items={deviceItems}
        selectionType="multi"
        selectedItems={selectedDevices}
        onSelectionChange={({ detail }) => setSelectedDevices(detail.selectedItems)}
        variant="container"
        trackBy="id"
        ariaLabels={{
          selectionGroupLabel: 'Device selection',
          allItemsSelectionLabel: () => 'select all devices',
          itemSelectionLabel: (_, item) => `select ${item.col1}`,
        }}
        empty={
          <Box textAlign="center" color="inherit" margin={{ vertical: 'xl' }}>
            <Box variant="p" color="inherit">
              No devices found
            </Box>
          </Box>
        }
      />
    </SpaceBetween>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <I18nProvider locale="en" messages={[enMessages]}>
      <TopNavPortal searchValue={searchValue} onSearchChange={setSearchValue} />
      <AppLayout
        navigation={
          <SideNavigation
            activeHref="#/devices"
            header={{ text: 'Service', href: '#/' }}
            items={navItems}
          />
        }
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Service', href: '#/' },
              { text: 'Administrative Dashboard', href: '#/network-admin-dashboard' },
            ]}
            expandAriaLabel="Show path"
            ariaLabel="Breadcrumbs"
          />
        }
        content={
          <div className="dashboard-content-wrapper">
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
            <DashboardContent />
          </div>
        }
        stickyNotifications
        toolsHide
      />
    </I18nProvider>
  );
}
