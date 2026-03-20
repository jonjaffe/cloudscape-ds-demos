import { Box } from '@cloudscape-design/components';
import { getWeatherIcon } from '../services/weather-api';
import styles from '../styles.module.scss';

interface ForecastCardProps {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
}

export function ForecastCard({
  date,
  maxTemp,
  minTemp,
  precipitation,
  weatherCode,
}: ForecastCardProps) {
  const icon = getWeatherIcon(weatherCode);
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Box className={styles['forecast-card']}>
      <div className={styles['forecast-date']}>
        <div className={styles['day-name']}>{dayName}</div>
        <div className={styles['day-date']}>{dayDate}</div>
      </div>
      <div className={styles['forecast-icon']}>{icon}</div>
      <div className={styles['forecast-temps']}>
        <div className={styles['temp-max']}>{Math.round(maxTemp)}°</div>
        <div className={styles['temp-min']}>{Math.round(minTemp)}°</div>
      </div>
      {precipitation > 0 && (
        <div className={styles['forecast-precipitation']}>
          💧 {precipitation.toFixed(1)}mm
        </div>
      )}
    </Box>
  );
}
