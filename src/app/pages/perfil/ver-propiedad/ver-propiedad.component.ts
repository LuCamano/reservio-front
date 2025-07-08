import { Component, inject } from '@angular/core';
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
export class VerPropiedadComponent {
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.cargarDatos(id!)
  }

  async cargarDatos(id :string){
    const local = await this.apiSv.getLocal(id);
    if (local) {
      this.local = local;
      this.buscarCoordenadas();
    } else {
      console.error('No se encontró el local con ID:', id);
    }
  
  }

  buscarRe(id : string){
    this.apiSv.getRegion(id).then(r => this.region = r.nombre);
    return this.region
  }  

  buscarCoordenadas() {
    this.direccioncompleta = this.local.direccion + ', ' + this.local.comuna?.nombre + this.region + ', chile';
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
