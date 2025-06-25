import { Injectable } from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { Observable }       from 'rxjs';
import { map }              from 'rxjs/operators';
import { environment }      from '../environments/environment';

interface OwmResponse {
  name: string;
  main: { temp: number, humidity: number };
  weather: { description: string, icon: string }[];
}

interface ForecastEntryDto {
  dt: number;
  main: { temp: number, humidity: number }
  weather: { description: string, icon: string }[];
}

interface ForecastResponse {
  city: { name: string; };
  list: ForecastEntryDto[];
}


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherApiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  constructor(private http: HttpClient) {}

  getByCity(city: string): Observable<OwmResponse> {
    const url = `${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`;
    return this.http.get<OwmResponse>(url);
  }

  getForecastByCity(city: string): Observable<ForecastResponse> {
    const url = `${this.forecastUrl}?q=${city}&units=metric&appid=${this.apiKey}`;
    return this.http.get<ForecastResponse>(url);
  }
}
