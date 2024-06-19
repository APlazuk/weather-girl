import {Component, OnInit} from '@angular/core';
import {Coordinates} from "../../openapi";
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

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.updateCoordinates();
  }

  onEnter(value: string): void {
    this.providedCity = value;
    this.weatherService.getLocationCoordinates(value);
  }

  updateCoordinates() {
    this.weatherService.currentCoordinates
      .subscribe(coordinate => this.coordinates = coordinate);
    console.log("Coordinates has been updated:" + this.coordinates.lat?.toString());
  }
}
