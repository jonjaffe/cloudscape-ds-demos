// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useCallback, useState } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import { Location, searchLocations } from './api';

interface CitySearchProps {
  onLocationSelect: (location: Location) => void;
  loading?: boolean;
}

interface LocationOption {
  value: string;
  label: string;
  location: Location;
}

export function CitySearch({ onLocationSelect, loading = false }: CitySearchProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = useCallback(
    async (event: { detail: { value: string } }) => {
      const searchValue = event.detail.value;
      setValue(searchValue);

      if (searchValue.length < 2) {
        setSuggestions([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchLocations(searchValue);
        const options = results.map(location => ({
          value: `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`,
          label: `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`,
          location,
        }));
        setSuggestions(options);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    },
    []
  );

  const handleSelect = useCallback(
    (event: { detail: { selectedOption: LocationOption } }) => {
      const selected = event.detail.selectedOption;
      if (selected) {
        setValue(selected.value);
        setSuggestions([]);
        onLocationSelect(selected.location);
      }
    },
    [onLocationSelect]
  );

  return (
    <Autosuggest
      value={value}
      options={suggestions}
      onChange={handleSearch}
      onSelect={handleSelect}
      placeholder="Search for a city..."
      loading={searchLoading || loading}
      loadingText="Searching..."
      ariaLabel="Search cities"
      empty="No matches found"
      filteringType="none"
    />
  );
}
