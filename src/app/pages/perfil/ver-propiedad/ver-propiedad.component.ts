import { Component, inject, OnInit } from '@angular/core';
import { Local } from '../../../models/models.interface';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { OpenStreetMapService } from '../../../services/open-street-map.service';

@Component({
  selector: 'app-ver-propiedad',
  standalone: false,
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss'
})
export class VerPropiedadComponent implements OnInit{
  private apiSv = inject(ApiService);
  private route = inject(ActivatedRoute);
  private MapService = inject(OpenStreetMapService);

  local!: Local;
  region: string = '';

  isLoading = true;
  mapError = false;

  dato_lng: number = 0;
  dato_lat: number = 0;
  nombre_local: string = '';
  direccioncompleta: string = '';

  // Nuevas variables para nombre de comuna y región
  nombreRegion: string = '';
  nombreComuna: string = '';

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    await this.cargarDatos(id!)
  }

  async cargarDatos(id: string) {
    try {
      const local = await this.apiSv.getLocal(id);
      if (local) {
        this.local = local;
        // Obtener nombre de comuna y región
        if (local.comuna) {
          this.nombreComuna = local.comuna.nombre;
          // Obtener la región asociada a la comuna
          const regionId = local.comuna.region_id;
          if (regionId) {
            const region = await this.apiSv.getRegion(regionId);
            this.nombreRegion = region.nombre;
          }
        }
        this.buscarCoordenadas();
      } else {
        console.error('No se encontró el local con ID:', id);
      }
    } catch (error) {
      console.error('Error al obtener el local:', error);
    }
  }

  buscarCoordenadas() {
    this.direccioncompleta = `${this.local.direccion}, ${this.nombreComuna}, ${this.nombreRegion}, Chile`;
    this.MapService.getCoordinates(this.direccioncompleta)
      .subscribe({
        next: (coords) => {
          if (coords) {
            this.dato_lat = coords.lat;
            this.dato_lng = coords.lng;
          } else {
            console.error('No coordinates returned from the API');
            this.mapError = true;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener coordenadas', err);
          this.mapError = true;
          this.isLoading = false;
        }
      });
  }

  
}
