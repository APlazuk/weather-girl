import {Component, OnInit} from '@angular/core';
import {Coordinates, LocationControllerService} from "../../openapi";
import {FormsModule} from "@angular/forms";
import {MapComponent} from "../map/map.component";
import {WeatherService} from "../../service/weather.service";


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
  coordinates: Coordinates = {};

  constructor(private locationControllerService: LocationControllerService,
              private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.updateCoordinates();
  }

  onEnter(value: string): void {
    this.providedCity = value;
    this.getLocationCoordinates(value);
  }

  public getLocationCoordinates(city: string): void {
    this.locationControllerService.getLocationCoordinates(city).subscribe(
      {
        next: response => this.coordinates = response,
        complete: () => this.changeCoordinates(),
        error: (error) => console.log(error)
      }
    );
  }

  changeCoordinates(): void {
    this.weatherService.changeCoordinates(this.coordinates);
    console.log("Coordinates has been changed:" + this.coordinates.lng?.toString(), this.coordinates.lat?.toString());
  }

  updateCoordinates() {
    this.weatherService.currentCoordinates
      .subscribe(coordinate => this.coordinates = coordinate);
    console.log("Coordinates has been updated:" + this.coordinates);
  }
}
