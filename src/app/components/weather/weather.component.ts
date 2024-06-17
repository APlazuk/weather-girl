import {Component, OnInit} from '@angular/core';
import {Coordinates, LocationControllerService} from "../../openapi";
import {FormsModule} from "@angular/forms";
import {MapComponent} from "../map/map.component";


@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    FormsModule,
    MapComponent
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {

  city = '';
  providedCity = '';
  coordinate: Coordinates = {};

  //zrobic tutorial dla maxboxa
  //https://medium.com/@gisjohnecs/creating-a-simple-mapbox-component-in-angular-b25aeec706c
  constructor(private locationControllerService: LocationControllerService) {
  }

  ngOnInit(): void {
  }

  onEnter(value: string): void {
    this.providedCity = value;
    this.getLocationCoordinates(value);
  }

  public getLocationCoordinates(city: string): void {
    this.locationControllerService.getLocationCoordinates(city).subscribe(
      {
        next: response => this.coordinate = response,
        error: (error) => console.log(error)
      }
    );
  }
}
