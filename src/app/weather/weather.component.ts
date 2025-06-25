import { Component, OnInit } from '@angular/core';
import { WeatherService }       from '../weather.service';

interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  description: string;
  iconUrl: string;
}

interface DailyForecast {
  date: string;
  high: number;
  low: number;
  iconUrl: string;
  description: string;
}

interface ForecastEntry {
  time: number;
  temp: number;
  humidity: number;
  description: string;
  iconUrl: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
city = '';
  data: WeatherData | null = null;
  forecastData: ForecastEntry[] = [];
  error = '';
  dailyForecasts: DailyForecast[] = [];

  constructor(private ws: WeatherService) {}

  search() {
    this.error = '';
    this.data = null;
    if (!this.city.trim()) { return; }

    this.ws.getByCity(this.city.trim()).subscribe({
      next: res => {
        this.data = {
          city: res.name,
          temp: res.main.temp,
          humidity: res.main.humidity,
          description: res.weather[0].description,
          iconUrl: `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
        };
      },
      error: err => {
        this.error = 'City not found or network error';
      }
    });
    this.ws.getForecastByCity(this.city.trim()).subscribe({
      next: res => {
        this.forecastData = res.list.map(item => ({
          time: item.dt,
          temp: item.main.temp,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          iconUrl: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        }));
        this.dailyForecasts = this.groupByDay(this.forecastData);
      },
      error: err => {
        this.error = 'City not found or network error'
      }
    });
  }

  private groupByDay(entries: ForecastEntry[]): DailyForecast[] {
    const groups: { [day: string]: ForecastEntry[] } = {};
    entries.forEach(e => {
      const dayKey = new Date(e.time * 1000).toISOString().slice(0,10);
      (groups[dayKey] = groups[dayKey] || []).push(e);
    });

    return Object.keys(groups).map(dayKey => {
      const dayEntries = groups[dayKey];
      const temps = dayEntries.map(d => d.temp);
      const high = Math.max(...temps);
      const low  = Math.min(...temps);
      // pick middle-of-the-day entry for icon/description
      const mid = dayEntries[Math.floor(dayEntries.length/2)];
      return {
        date: dayKey,
        high,
        low,
        iconUrl: mid.iconUrl,
        description: mid.description
      };
    });
  }
}
