import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WeatherComponent} from "./components/weather/weather.component";
import {MapComponent} from "./components/map/map.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WeatherComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'weather';
}
