// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Autosuggest, { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';
import Icon from '@cloudscape-design/components/icon';
import { format, parseISO } from 'date-fns';

// Types for Open-Meteo Geocoding API
interface GeoResult {
  id: number;
  name: string;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface GeoResponse {
  results?: GeoResult[];
}

// Types for Open-Meteo Forecast API (minimal subset used)
interface ForecastResponse {
  timezone?: string;
  current_weather?: {
    temperature: number; // °C
    windspeed: number; // km/h
    winddirection: number; // °
    weathercode: number;
    time: string; // ISO
  };
  hourly?: {
    time: string[];
    // New naming (2024+) and legacy naming support
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
    wind_speed_10m?: number[];
    cloud_cover?: number[];
    uv_index?: number[];
    visibility?: number[];
    precipitation?: number[];
    pressure_msl?: number[];

    // legacy keys
    relativehumidity_2m?: number[];
    windspeed_10m?: number[];
    cloudcover?: number[];
  };
}

interface LocationOption extends AutosuggestProps.Option {
  value: string; // label used in input
  description?: string;
  label?: string;
  lat: number;
  lon: number;
  tz?: string;
}

interface HourRow {
  time: string;
  temperature?: number;
  humidity?: number;
  wind?: number;
  pressure?: number;
  clouds?: number;
  precip?: number;
  visibility?: number;
  uv?: number;
}

function buildLabel(r: GeoResult) {
  const parts = [r.name, r.admin1, r.country].filter(Boolean);
  return parts.join(', ');
}

function kphToMps(kph: number) {
  return kph / 3.6;
}

export function App() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selected, setSelected] = useState<LocationOption | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);
  const suggestionsAbort = useRef<AbortController | null>(null);
  const forecastAbort = useRef<AbortController | null>(null);

  // Fetch geocoding suggestions
  const fetchSuggestions = (text: string) => {
    if (suggestionsAbort.current) {
      suggestionsAbort.current.abort();
    }
    const controller = new AbortController();
    suggestionsAbort.current = controller;

    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', text);
    url.searchParams.set('count', '10');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');

    setLoadingSuggestions(true);
    fetch(url.toString(), { signal: controller.signal })
      .then(r => r.json())
      .then((data: GeoResponse) => {
        const results = (data.results ?? []).map<LocationOption>(r => ({
          value: buildLabel(r),
          label: buildLabel(r),
          description: r.country_code
            ? `${r.country_code} • ${r.latitude.toFixed(2)}, ${r.longitude.toFixed(2)}`
            : `${r.latitude}, ${r.longitude}`,
          lat: r.latitude,
          lon: r.longitude,
          tz: r.timezone,
        }));
        setOptions(results);
      })
      .catch(err => {
        if (err?.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => setLoadingSuggestions(false));
  };

  // Debounced query updates
  const onInputChange: AutosuggestProps['onChange'] = ({ detail }) => {
    setQuery(detail.value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (detail.value && detail.value.trim().length >= 2) {
      debounceRef.current = window.setTimeout(() => fetchSuggestions(detail.value.trim()), 300);
    } else {
      setOptions([]);
    }
  };

  const onSelect: AutosuggestProps['onSelect'] = ({ detail }) => {
    const match = options.find(o => o.value === detail.value);
    if (match) {
      setSelected(match);
    }
  };

  // Fetch forecast when a location is selected
  useEffect(() => {
    if (!selected) return;
    if (forecastAbort.current) forecastAbort.current.abort();
    const controller = new AbortController();
    forecastAbort.current = controller;

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(selected.lat));
    url.searchParams.set('longitude', String(selected.lon));
    url.searchParams.set('timezone', 'auto');

    // Current weather and hourly selection
    url.searchParams.set('current_weather', 'true');
    url.searchParams.set(
      'hourly',
      [
        'temperature_2m',
        'relative_humidity_2m',
        'wind_speed_10m',
        'pressure_msl',
        'cloud_cover',
        'uv_index',
        'visibility',
        'precipitation',
      ].join(','),
    );
    url.searchParams.set('forecast_days', '2');

    setLoadingForecast(true);
    setError(null);
    fetch(url.toString(), { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json();
      })
      .then((data: ForecastResponse) => setForecast(data))
      .catch(err => {
        if (err?.name === 'AbortError') return;
        console.error(err);
        setError('Failed to load weather data. Please try again.');
      })
      .finally(() => setLoadingForecast(false));
  }, [selected]);

  const hourlyRows: HourRow[] = useMemo(() => {
    if (!forecast?.hourly) return [];
    const h = forecast.hourly;
    const times = h.time || [];

    const pick = (keys: (keyof typeof h)[], i: number): number | undefined => {
      for (const k of keys) {
        const arr = h[k] as unknown as number[] | undefined;
        if (Array.isArray(arr) && typeof arr[i] === 'number') return arr[i];
      }
      return undefined;
    };

    // Try to start from the current hour index if present
    let startIdx = 0;
    if (forecast.current_weather?.time && times.length) {
      const idx = times.indexOf(forecast.current_weather.time);
      if (idx >= 0) startIdx = idx;
    }

    const endIdx = Math.min(startIdx + 24, times.length);
    const rows: HourRow[] = [];
    for (let i = startIdx; i < endIdx; i++) {
      rows.push({
        time: times[i],
        temperature: pick(['temperature_2m'], i),
        humidity: pick(['relative_humidity_2m', 'relativehumidity_2m'], i),
        wind: pick(['wind_speed_10m', 'windspeed_10m'], i),
        pressure: pick(['pressure_msl'], i),
        clouds: pick(['cloud_cover', 'cloudcover'], i),
        uv: pick(['uv_index'], i),
        visibility: pick(['visibility'], i),
        precip: pick(['precipitation'], i),
      });
    }
    return rows;
  }, [forecast]);

  const currentPanel = (
    <Container header={<Header variant="h2">Current weather</Header>}>
      {loadingForecast && <StatusIndicator type="loading">Loading current conditions</StatusIndicator>}
      {!loadingForecast && selected && forecast?.current_weather && (
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
          ]}
        >
          <Box>
            <Box variant="awsui-key-label">Location</Box>
            <Box>{selected.value}</Box>
            {selected.tz && <Box variant="small">Timezone: {selected.tz}</Box>}
          </Box>
          <Box>
            <Box variant="awsui-key-label">Temperature</Box>
            <Box fontWeight="bold">{forecast.current_weather.temperature.toFixed(1)} °C</Box>
            <Box variant="small">As of {format(parseISO(forecast.current_weather.time), 'PPpp')}</Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Wind</Box>
            <Box>{forecast.current_weather.windspeed.toFixed(0)} km/h</Box>
            <Box variant="small">Direction {forecast.current_weather.winddirection.toFixed(0)}°</Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Conditions</Box>
            <Box display="flex" alignItems="center">
              <Icon name="status-info" />
              <Box margin={{ left: 'xs' }}>Code {forecast.current_weather.weathercode}</Box>
            </Box>
            <Box variant="small">Local time zone: {forecast.timezone ?? 'auto'}</Box>
          </Box>
        </Grid>
      )}
      {!loadingForecast && selected && !forecast?.current_weather && (
        <StatusIndicator type="warning">Current weather not available</StatusIndicator>
      )}
      {!selected && <StatusIndicator type="info">Search for a city to view current conditions</StatusIndicator>}
    </Container>
  );

  const hourlyPanel = (
    <Container header={<Header variant="h2">Hourly forecast (next 24 hours)</Header>}>
      {loadingForecast && <StatusIndicator type="loading">Loading hourly forecast</StatusIndicator>}
      {!loadingForecast && selected && hourlyRows.length === 0 && (
        <StatusIndicator type="warning">Hourly data not available</StatusIndicator>
      )}
      {!loadingForecast && hourlyRows.length > 0 && (
        <Table
          items={hourlyRows}
          trackBy={row => row.time}
          columnDefinitions={[
            {
              id: 'time',
              header: 'Time',
              cell: item => format(parseISO(item.time), 'PPpp'),
            },
            {
              id: 'temp',
              header: 'Temp (°C)',
              cell: item => (typeof item.temperature === 'number' ? item.temperature.toFixed(1) : '—'),
            },
            {
              id: 'hum',
              header: 'Humidity (%)',
              cell: item => (typeof item.humidity === 'number' ? item.humidity.toFixed(0) : '—'),
            },
            {
              id: 'wind',
              header: 'Wind (km/h)',
              cell: item => (typeof item.wind === 'number' ? item.wind.toFixed(0) : '—'),
            },
            {
              id: 'press',
              header: 'Pressure (hPa)',
              cell: item => (typeof item.pressure === 'number' ? item.pressure.toFixed(0) : '—'),
            },
            {
              id: 'clouds',
              header: 'Clouds (%)',
              cell: item => (typeof item.clouds === 'number' ? item.clouds.toFixed(0) : '—'),
            },
            {
              id: 'vis',
              header: 'Visibility (m)',
              cell: item => (typeof item.visibility === 'number' ? item.visibility.toFixed(0) : '—'),
            },
            {
              id: 'uv',
              header: 'UV Index',
              cell: item => (typeof item.uv === 'number' ? item.uv.toFixed(1) : '—'),
            },
            {
              id: 'precip',
              header: 'Precip (mm)',
              cell: item => (typeof item.precip === 'number' ? item.precip.toFixed(1) : '—'),
            },
          ]}
          header={<Header counter={`(${hourlyRows.length})`}>Hourly data</Header>}
          ariaLabels={{
            selectionGroupLabel: 'weather rows',
            itemSelectionLabel: (e, item) => `select row at ${item.time}`,
          }}
          stickyHeader
          resizableColumns
          variant="embedded"
        />
      )}
    </Container>
  );

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              actions={
                <SpaceBetween size="xs" direction="horizontal">
                  {selected && <Badge color="blue">{selected.value}</Badge>}
                </SpaceBetween>
              }
            >
              Weather dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Search location</Header>}>
              <Autosuggest
                onChange={onInputChange}
                onSelect={onSelect}
                value={query}
                placeholder="Type a city name..."
                statusType={loadingSuggestions ? 'loading' : 'finished'}
                loadingText="Loading suggestions"
                empty="No matches"
                options={options}
                ariaLabel="Choose a location"
                expandToViewport
              />
              <Box variant="small" margin={{ top: 's' }}>
                Data by Open-Meteo •{' '}
                <Link href="https://open-meteo.com/" external>
                  open-meteo.com
                </Link>
              </Box>
            </Container>

            {error && (
              <Container>
                <StatusIndicator type="error">{error}</StatusIndicator>
              </Container>
            )}

            {currentPanel}
            {hourlyPanel}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
