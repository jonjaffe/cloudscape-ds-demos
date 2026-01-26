import React, { useState, useEffect } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { searchLocations, Location } from '../api';
import '../styles/city-search.scss';

interface CitySearchProps {
  onLocationSelect: (location: Location) => void;
  isLoading?: boolean;
}

export function CitySearch({ onLocationSelect, isLoading = false }: CitySearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      return;
    }

    setIsFetching(true);
    const timer = setTimeout(async () => {
      const results = await searchLocations(searchValue);
      setSuggestions(results);
      setIsFetching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSelect = (location: Location) => {
    setSearchValue('');
    setSuggestions([]);
    onLocationSelect(location);
  };

  return (
    <SpaceBetween size="xs">
      <Autosuggest
        onChange={({ detail }) => setSearchValue(detail.value)}
        value={searchValue}
        options={suggestions.map(location => ({
          value: location.id.toString(),
          label: `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`,
          location,
        }))}
        onSelect={({ detail }) => {
          if (detail.value && detail.value.location) {
            handleSelect(detail.value.location);
          }
        }}
        placeholder="Search for a city..."
        loading={isFetching}
        disabled={isLoading}
        className="city-search"
        ariaLabel="Search for a city"
      />
    </SpaceBetween>
  );
}
