// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

interface DeviceItem {
  id: string;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
  column7: string;
}

// Generate sample data
const generateDevices = (count: number): DeviceItem[] => {
  const devices: DeviceItem[] = [];
  for (let i = 1; i <= count; i++) {
    devices.push({
      id: `device-${i}`,
      column1: 'Cell Value',
      column2: 'Cell Value',
      column3: 'Cell Value',
      column4: 'Cell Value',
      column5: 'Cell Value',
      column6: 'Cell Value',
      column7: 'Cell Value',
    });
  }
  return devices;
};

const allDevices = generateDevices(50);

export function DevicesTable() {
  const [selectedItems, setSelectedItems] = useState<DeviceItem[]>([]);
  const [filteringText, setFilteringText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const pageSize = 10;

  // Filter devices based on search text
  const filteredDevices = allDevices.filter(
    device =>
      device.column1.toLowerCase().includes(filteringText.toLowerCase()) ||
      device.column2.toLowerCase().includes(filteringText.toLowerCase()) ||
      device.column3.toLowerCase().includes(filteringText.toLowerCase()),
  );

  // Paginate the filtered devices
  const paginatedDevices = filteredDevices.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize,
  );

  return (
    <Table
      onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
      selectedItems={selectedItems}
      ariaLabels={{
        selectionGroupLabel: 'Items selection',
        allItemsSelectionLabel: ({ selectedItems }) =>
          `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
        itemSelectionLabel: ({ selectedItems }, item) => {
          const isItemSelected = selectedItems.filter(i => i.id === item.id).length;
          return `${item.id} is ${isItemSelected ? '' : 'not'} selected`;
        },
      }}
      columnDefinitions={[
        {
          id: 'column1',
          header: 'Column header',
          cell: item => item.column1,
          sortingField: 'column1',
        },
        {
          id: 'column2',
          header: 'Column header',
          cell: item => item.column2,
          sortingField: 'column2',
        },
        {
          id: 'column3',
          header: 'Column header',
          cell: item => item.column3,
          sortingField: 'column3',
        },
        {
          id: 'column4',
          header: 'Column header',
          cell: item => item.column4,
          sortingField: 'column4',
        },
        {
          id: 'column5',
          header: 'Column header',
          cell: item => item.column5,
          sortingField: 'column5',
        },
        {
          id: 'column6',
          header: 'Column header',
          cell: item => item.column6,
          sortingField: 'column6',
        },
        {
          id: 'column7',
          header: 'Column header',
          cell: item => item.column7,
          sortingField: 'column7',
        },
      ]}
      items={paginatedDevices}
      loadingText="Loading devices"
      selectionType="multi"
      trackBy="id"
      empty={
        <SpaceBetween size="m">
          <b>No devices</b>
          <Button>Add device</Button>
        </SpaceBetween>
      }
      filter={
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Placeholder"
          filteringAriaLabel="Filter devices"
          onChange={({ detail }) => {
            setFilteringText(detail.filteringText);
            setCurrentPageIndex(1);
          }}
        />
      }
      header={
        <Header
          counter={selectedItems.length > 0 ? `(${selectedItems.length}/${filteredDevices.length})` : undefined}
          description="Devices on your local network"
          actions={
            <Button variant="primary" iconName="external" iconAlign="right">
              Add Device
            </Button>
          }
        >
          My Devices
        </Header>
      }
      pagination={
        <Pagination
          currentPageIndex={currentPageIndex}
          pagesCount={Math.ceil(filteredDevices.length / pageSize)}
          onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
          ariaLabels={{
            nextPageLabel: 'Next page',
            previousPageLabel: 'Previous page',
            pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
          }}
        />
      }
    />
  );
}
