import { Component, OnInit } from '@angular/core';
import { WeatherService }       from '../weather.service';

interface WeatherData {
  city: string;
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
  error = '';

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
  }
}
