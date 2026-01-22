// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useCallback, useState } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import { Location, searchLocations } from './api';

interface CitySearchProps {
  onLocationSelect: (location: Location) => void;
  loading?: boolean;
}

export function CitySearch({ onLocationSelect, loading = false }: CitySearchProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSearch = useCallback(
    async (detail: { value: string }) => {
      setValue(detail.value);
      setSelectedLocation(null);

      if (detail.value.length < 2) {
        setSuggestions([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchLocations(detail.value);
        setSuggestions(results);
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
    (detail: { value: string; selectedOption?: any }) => {
      const selected = detail.selectedOption as Location | undefined;
      if (selected) {
        setSelectedLocation(selected);
        setValue(`${selected.name}${selected.admin1 ? ', ' + selected.admin1 : ''}, ${selected.country}`);
        setSuggestions([]);
        onLocationSelect(selected);
      }
    },
    [onLocationSelect]
  );

  return (
    <Autosuggest
      value={value}
      options={suggestions.map(location => ({
        value: `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`,
        label: `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`,
        ...location,
      }))}
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
