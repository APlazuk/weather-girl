import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Coordinates} from "../../openapi";
import mapboxgl from "mapbox-gl";
import {WeatherService} from "../../service/weather.service";


@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map | undefined;
  style: string = 'mapbox://styles/mapbox/streets-v12';
  coordinates: Coordinates = {};

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.updateCoordinates();
    this.createMap();
  }

  updateCoordinates() {
    this.weatherService.currentCoordinates
      .subscribe(coordinate => {
        this.coordinates = coordinate
        this.updateMapCenter();
      });
    console.log(this.coordinates);
  }

  public createMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.coordinates.lng as number, this.coordinates.lat as number],
      zoom: 5,
    });
  }

  updateMapCenter() {
    this.map?.flyTo({
      center: [this.coordinates.lng as number, this.coordinates.lat as number]
    });
  }
}
