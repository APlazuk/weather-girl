import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Coordinates, Instant, Timeseries, WeatherControllerService} from "../openapi";


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private coordinatesSource = new BehaviorSubject<Coordinates>({lng: -74.0060152, lat: 40.7127281});
  currentCoordinates = this.coordinatesSource.asObservable();

  private weatherInfoSource = new BehaviorSubject<Instant>({})
  currentWeatherInfo = this.weatherInfoSource.asObservable();

  constructor(private weatherControllerService: WeatherControllerService) {
  }

  changeCoordinates(coordinates: Coordinates) {
    if (coordinates.lat?.valueOf() && coordinates.lng?.valueOf()) {
      this.coordinatesSource.next({lat: coordinates.lat, lng: coordinates.lng})
    }
    console.log("Coordinates has been changed:" + coordinates.lng?.toString(), coordinates.lat?.toString());
  }

  changeWeatherInfo(timeseries: Timeseries) {
    if (timeseries.data && timeseries.data.instant) {
      this.weatherInfoSource.next({details: timeseries.data.instant.details})
      console.log(timeseries.data.instant.details)
    }
  }

  public getLocationCoordinates(city: string): void {
    let coordinates: Coordinates;
    this.weatherControllerService.getLocationCoordinates(city).subscribe(
      {
        next: response => coordinates = response,
        complete: () => this.changeCoordinates(coordinates),
        error: error => console.log(error)
      }
    );
  }

  public getWeatherInfo(coordinates: Coordinates): void {
    let timeseries: Timeseries;
    this.weatherControllerService.getWeatherInfo(coordinates.lat!.toString(), coordinates.lng!.toString()).subscribe(
      {
        next: response => {
          timeseries = response
          this.changeWeatherInfo(timeseries)
        },
        error: error => console.log(error)
      }
    );
  }
}