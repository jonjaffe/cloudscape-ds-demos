import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Autocomplete,
  Button,
  FormField,
  Grid,
  ColumnLayout,
  Spinner,
  Alert,
} from '@cloudscape-design/components';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherCard } from './components/weather-card';
import { ForecastCard } from './components/forecast-card';
import { fetchWeatherData, fetchGeocoding } from './services/weather-api';
import { WeatherData, Location } from './types';
import styles from './styles.module.scss';

export function App() {
  const [location, setLocation] = useState('New York');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ label: string; value: Location }>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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
      setInputValue('');
      setSuggestions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setInputValue(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setLoadingSuggestions(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const locations = await fetchGeocoding(value);
        const formattedSuggestions = locations.map((loc) => ({
          label: `${loc.name}${loc.admin1 ? ', ' + loc.admin1 : ''}${loc.country ? ', ' + loc.country : ''}`,
          value: loc,
        }));
        setSuggestions(formattedSuggestions);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (location: Location) => {
    loadWeather(location);
  };

  // Load weather for initial location
  useEffect(() => {
    loadWeather(location);
  }, []);

  const handleSearch = () => {
    if (inputValue.trim()) {
      loadWeather(inputValue);
    }
  };

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
              <SpaceBetween size="s" direction="horizontal">
                <FormField label="Location" stretch>
                  <Autocomplete
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.detail.value)}
                    onSelect={(e) => handleSelectSuggestion(e.detail.value)}
                    options={suggestions}
                    placeholder="Enter city name (e.g., Boston)"
                    disabled={loading}
                    loading={loadingSuggestions}
                    statusText={loadingSuggestions ? 'Loading suggestions...' : ''}
                    empty="No matches found"
                  />
                </FormField>
                <Button onClick={handleSearch} disabled={loading || !inputValue.trim()} variant="primary">
                  {loading ? 'Loading...' : 'Search'}
                </Button>
              </SpaceBetween>
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
