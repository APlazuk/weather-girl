import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../../environments/environment";
import {Coordinates} from "../../openapi";


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map | undefined;
  style: string = 'mapbox://styles/mapbox/streets-v12';
  coordinate: Coordinates = {lng: -97.7431, lat: 30.2672};


  ngOnInit(): void {
    this.createMap();
  }

  public createMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.coordinate.lng as number, this.coordinate.lat as number],
      zoom: 9,
    });
  }

}
