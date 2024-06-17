import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Coordinates} from "../openapi";


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private coordinatesSource = new BehaviorSubject<Coordinates>({lng: -74.0060152, lat: 40.7127281});
  currentCoordinates = this.coordinatesSource.asObservable();

  constructor() { }

  changeCoordinates(coordinates: Coordinates) {
    console.log(coordinates);
    if (coordinates.lat?.valueOf() && coordinates.lng?.valueOf()) {
      this.coordinatesSource.next({lat: coordinates.lat, lng: coordinates.lng})
    }
  }
}
