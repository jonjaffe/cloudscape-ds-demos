import { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Input,
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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (searchLocation: string) => {
    if (!searchLocation.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Geocode the location to get coordinates
      const locations = await fetchGeocoding(searchLocation);
      
      if (!locations || locations.length === 0) {
        setError('Location not found. Please try another search.');
        setLoading(false);
        return;
      }

      const selectedLocation = locations[0];
      
      // Fetch weather data for the coordinates
      const data = await fetchWeatherData(selectedLocation.latitude, selectedLocation.longitude);
      
      setWeatherData(data);
      setLocation(searchLocation);
      setInputValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.detail.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city name"
                    disabled={loading}
                  />
                </FormField>
                <Button onClick={handleSearch} disabled={loading} variant="primary">
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
