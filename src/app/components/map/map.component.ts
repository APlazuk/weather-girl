import {AfterViewInit, Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Coordinates, Instant, WeatherControllerService, WeatherNowcast} from "../../openapi";
import mapboxgl from "mapbox-gl";
import {WeatherService} from "../../service/weather.service";


@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {

  map: mapboxgl.Map | undefined;
  style: string = 'mapbox://styles/mapbox/streets-v12';
  coordinates: Coordinates = {};
  frameOffset: number = 5;
  zoom: number = 5;
  weatherNowcast: WeatherNowcast | undefined;
  weatherInfo: Instant = {};

  constructor(private weatherService: WeatherService, private weatherControllerService: WeatherControllerService) {
  }

  ngAfterViewInit(): void {
    this.createMap();
  }

  ngOnInit(): void {
    this.updateCoordinates();
    this.updateWeatherInfo();
  }

  updateCoordinates() {
    this.weatherService.currentCoordinates
      .subscribe(coordinate => {
        this.coordinates = coordinate
        this.getRainViewerNowcast()
        this.weatherService.getWeatherInfo(coordinate)
        this.updateMapCenter();
        this.updateMapSourceCoordinatesAndUrlPath();
      });
    console.log(this.coordinates);
  }

  updateWeatherInfo() {
    this.weatherService.currentWeatherInfo
      .subscribe(weatherInfo => {
        this.weatherInfo = weatherInfo
        this.addWeatherInfoPopUp(weatherInfo);
      });
    console.log("Weather Info has been updated: " + String(this.weatherInfo));
  }

  public createMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.coordinates.lng as number, this.coordinates.lat as number],
      zoom: this.zoom,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    console.log(this.weatherNowcast)
    this.addRainViewerLayer();
  }

  public addRainViewerLayer(): void {
    console.log(this.weatherNowcast);
    this.map?.on('load', () => {
      this.weatherNowcast?.nowcast?.forEach(nowcast => {
        if (nowcast.path != null && this.weatherNowcast?.host != null) {
          this.map?.addSource('radar' + nowcast.time, {
            type: 'image',
            url: this.weatherNowcast.host + nowcast.path,
            coordinates: [
              [this.coordinates.lng as number - this.frameOffset, this.coordinates.lat as number + this.frameOffset],
              [this.coordinates.lng as number + this.frameOffset, this.coordinates.lat as number + this.frameOffset],
              [this.coordinates.lng as number + this.frameOffset, this.coordinates.lat as number - this.frameOffset],
              [this.coordinates.lng as number - this.frameOffset, this.coordinates.lat as number - this.frameOffset],
            ]
          });
          this.map?.addLayer({
            id: 'radar-layer' + nowcast.time,
            type: 'raster',
            source: 'radar' + nowcast.time,
            paint: {
              "raster-opacity": 0.5,
              "raster-fade-duration": 0
            },
            layout: {"visibility": "none"}
          });
          this.animateRadar();
        }
      })
    })
  }

  addWeatherInfoPopUp(weatherInfo: Instant) {
    if (weatherInfo.details) {
      let weatherInfoHtmlTemplate = `<h1>Weather Info</h1>
              <p>Temperature: ${weatherInfo.details.air_temperature}</p>
              <p>Humidity: ${weatherInfo.details.relative_humidity}</p>
              <p>Wind Speed: ${weatherInfo.details.wind_speed}</p>`;

      const popup = new mapboxgl.Popup({closeOnClick: true})
        .setLngLat([this.coordinates.lng!, this.coordinates.lat!])
        .setHTML(weatherInfoHtmlTemplate)
        .addTo(this.map!);
    }
  }

  updateMapCenter() {
    this.map?.flyTo({
      center: [this.coordinates.lng as number, this.coordinates.lat as number]
    });
  }

  updateMapSourceCoordinatesAndUrlPath(): void {
    if (this.weatherNowcast && this.weatherNowcast.nowcast && this.coordinates) {
      let host = this.weatherNowcast.host as string;
      this.weatherNowcast.nowcast.forEach(nowcast => {
        let source = this.map?.getSource('radar' + nowcast.time) as mapboxgl.ImageSource;
        source?.updateImage({
          url: host + nowcast.path,
          coordinates: [
            [this.coordinates.lng as number - this.frameOffset, this.coordinates.lat as number + this.frameOffset],
            [this.coordinates.lng as number + this.frameOffset, this.coordinates.lat as number + this.frameOffset],
            [this.coordinates.lng as number + this.frameOffset, this.coordinates.lat as number - this.frameOffset],
            [this.coordinates.lng as number - this.frameOffset, this.coordinates.lat as number - this.frameOffset],
          ]
        });
      })
    }
  }

  animateRadar(): void {
    let currentIndex = 0;
    const radarLayers = this.weatherNowcast?.nowcast?.map(nc => 'radar-layer' + nc.time);
    setInterval(() => {
      if (this.map && radarLayers) {
        const previousLayer = radarLayers[currentIndex];
        currentIndex = (currentIndex + 1) % radarLayers.length;
        const nextLayer = radarLayers[currentIndex];
        // hide previous layer
        this.map.setLayoutProperty(previousLayer, 'visibility', 'none');
        // show next layer
        this.map.setLayoutProperty(nextLayer, 'visibility', 'visible');
      }
    }, 500);
  }

  public getRainViewerNowcast(): void {
    this.weatherControllerService.getWeatherNowcast(this.zoom.toString(), this.coordinates).subscribe(
      {
        next: response => {
          this.weatherNowcast = response;
          this.updateMapSourceCoordinatesAndUrlPath();
          console.log(this.weatherNowcast)
        },
        error: error => console.log(error)
      })
  };
}
