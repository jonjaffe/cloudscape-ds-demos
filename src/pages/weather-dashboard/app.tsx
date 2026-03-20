import { useState, useEffect, useRef } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Grid from '@cloudscape-design/components/grid';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherCard } from './components/weather-card';
import { ForecastCard } from './components/forecast-card';
import { fetchWeatherData, fetchGeocoding } from './services/weather-api';
import { WeatherData, Location } from './types';
import styles from './styles.module.scss';

export function App() {
  const [location, setLocation] = useState('New York');
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);
  const [suggestions, setSuggestions] = useState<SelectProps.Option[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const locationsCache = useRef<Map<number, Location>>(new Map());

  const loadWeather = async (selectedLocation: Location | string) => {
    setLoading(true);
    setError(null);

    try {
      let coords: Location;

      if (typeof selectedLocation === 'string') {
        if (!selectedLocation.trim()) {
          setError('Please enter a location');
          setLoading(false);
          return;
        }
        // Geocode the location to get coordinates
        const locations = await fetchGeocoding(selectedLocation);

        if (!locations || locations.length === 0) {
          setError('Location not found. Please try another search.');
          setLoading(false);
          return;
        }
        coords = locations[0];
      } else {
        coords = selectedLocation;
      }

      // Fetch weather data for the coordinates
      const data = await fetchWeatherData(coords.latitude, coords.longitude);

      const locationName = typeof selectedLocation === 'string' ? selectedLocation : coords.name;
      setWeatherData(data);
      setLocation(locationName);
      setSelectedOption(null);
      setSuggestions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async ({ detail }: { detail: { value: string } }) => {
    const value = detail.value;

    if (!value.trim()) {
      setSuggestions([]);
      setSelectedOption(null);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setLoadingSuggestions(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const locations = await fetchGeocoding(value);
        locationsCache.current.clear();
        const formattedSuggestions = locations.map((loc, index) => {
          locationsCache.current.set(index, loc);
          return {
            label: `${loc.name}${loc.admin1 ? ', ' + loc.admin1 : ''}${loc.country ? ', ' + loc.country : ''}`,
            value: index.toString(),
            description: `${loc.latitude.toFixed(2)}°N, ${loc.longitude.toFixed(2)}°E`,
          };
        });
        setSuggestions(formattedSuggestions);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = ({ detail }: { detail: { selectedOption: SelectProps.Option } }) => {
    const option = detail.selectedOption;
    if (option && option.value) {
      const locationIndex = parseInt(option.value);
      const location = locationsCache.current.get(locationIndex);
      if (location) {
        loadWeather(location);
        setSelectedOption(option);
      }
    }
  };

  // Load weather for initial location
  useEffect(() => {
    loadWeather(location);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <CustomAppLayout
      contentType="default"
      content={
        <Container>
          <SpaceBetween size="l">
            {/* Search Section */}
            <Box padding="l" className={styles['search-box']}>
              <Header variant="h2" description="Search for weather in any location">
                Find Weather
              </Header>
              <FormField label="Location" stretch>
                <Select
                  selectedOption={selectedOption}
                  onChange={handleSelectSuggestion}
                  onInputChange={handleInputChange}
                  options={suggestions}
                  placeholder="Enter city name (e.g., Boston)"
                  disabled={loading}
                  filteringType="auto"
                  statusText={loadingSuggestions ? 'Loading suggestions...' : ''}
                  noMatch="No matches found"
                />
              </FormField>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <Box textAlign="center" padding="l">
                <Spinner size="large" />
              </Box>
            )}

            {/* Weather Content */}
            {weatherData && !loading && (
              <SpaceBetween size="l">
                {/* Current Weather */}
                <div>
                  <Header variant="h2">Current Weather in {location}</Header>
                  <WeatherCard data={weatherData} />
                </div>

                {/* Forecast */}
                <div>
                  <Header variant="h2">7-Day Forecast</Header>
                  <Grid gridDefinition={[{ colspan: { default: 12, s: 6, m: 4, l: 3, xl: 3 } }]}>
                    {weatherData.daily.time.map((date, index) => (
                      <ForecastCard
                        key={date}
                        date={date}
                        maxTemp={weatherData.daily.temperature_2m_max[index]}
                        minTemp={weatherData.daily.temperature_2m_min[index]}
                        precipitation={weatherData.daily.precipitation_sum[index]}
                        weatherCode={weatherData.daily.weather_code[index]}
                      />
                    ))}
                  </Grid>
                </div>

                {/* Hourly Forecast */}
                <div>
                  <Header variant="h2">24-Hour Forecast</Header>
                  <Grid gridDefinition={[{ colspan: { default: 12, s: 6, m: 4, l: 2, xl: 2 } }]}>
                    {weatherData.hourly.time.slice(0, 24).map((time, index) => (
                      <Box key={time} className={styles['hourly-card']}>
                        <div className={styles['hourly-time']}>
                          {new Date(time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </div>
                        <div className={styles['hourly-temp']}>
                          {Math.round(weatherData.hourly.temperature_2m[index])}°C
                        </div>
                        <div className={styles['hourly-wind']}>
                          {Math.round(weatherData.hourly.wind_speed_10m[index])} km/h
                        </div>
                      </Box>
                    ))}
                  </Grid>
                </div>
              </SpaceBetween>
            )}
          </SpaceBetween>
        </Container>
      }
    />
  );
}
