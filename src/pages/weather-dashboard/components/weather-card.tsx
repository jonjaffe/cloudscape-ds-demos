import { Box, ColumnLayout } from '@cloudscape-design/components';
import { WeatherData } from '../types';
import { getWeatherDescription, getWeatherIcon } from '../services/weather-api';
import styles from '../styles.module.scss';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const current = data.current;
  const weatherDesc = getWeatherDescription(current.weather_code);
  const icon = getWeatherIcon(current.weather_code);

  return (
    <Box className={styles['weather-card']}>
      <ColumnLayout columns={3} variant="text-grid">
        <div className={styles['weather-main']}>
          <div className={styles['weather-icon']}>{icon}</div>
          <div className={styles['weather-temp']}>{Math.round(current.temperature_2m)}°C</div>
          <div className={styles['weather-description']}>{weatherDesc}</div>
          <div className={styles['weather-feels-like']}>
            Feels like {Math.round(current.apparent_temperature)}°C
          </div>
        </div>
        <div className={styles['weather-details']}>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Humidity:</span>
            <span className={styles['detail-value']}>{current.relative_humidity_2m}%</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Wind Speed:</span>
            <span className={styles['detail-value']}>{Math.round(current.wind_speed_10m)} km/h</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Wind Direction:</span>
            <span className={styles['detail-value']}>{Math.round(current.wind_direction_10m)}°</span>
          </div>
        </div>
        <div className={styles['timezone-info']}>
          <div className={styles['detail-label']}>Timezone:</div>
          <div className={styles['detail-value']}>{data.timezone}</div>
          <div className={styles['coordinates']}>
            <div>{data.latitude.toFixed(2)}°N</div>
            <div>{data.longitude.toFixed(2)}°E</div>
          </div>
        </div>
      </ColumnLayout>
    </Box>
  );
}
