import { Component, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private marker!: L.Marker;

  @Input() lat: number = 0;
  @Input() lng: number = 0;
  @Input() localName: string = 'Local';

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Crear mapa
    this.map = L.map('map-container').setView([this.lat, this.lng], 16);

    // Añadir capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Añadir marcador
    this.marker = L.marker([this.lat, this.lng])
      .addTo(this.map)
      .bindPopup(this.localName)
      .openPopup();
  }

}
