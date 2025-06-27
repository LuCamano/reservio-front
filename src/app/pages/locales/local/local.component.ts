import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Local, Reserva, Usuario } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { ActivatedRoute, Router } from '@angular/router';

import { OpenStreetMapService } from '../../../services/open-street-map.service';

@Component({
  selector: 'app-local',
  standalone: false,
  templateUrl: './local.component.html',
  styleUrl: './local.component.scss'
})
export class LocalComponent implements OnDestroy {

  // Inyectar el servicio OpenStreetMap
  private MapService = inject(OpenStreetMapService);

  local: Local | null = null;

  idLocal!: string;
  svLocal = inject(ConnectionService);

  isLoading = true;
  mapError = false;

  mostrarModalReserva = false;
  mostrarAlerta = false;
  reservaForm: FormGroup;

  reservas: Reserva[] = [];
  reservaError: string = '';

  dato_lng: number = 0;
  dato_lat: number = 0;
  nombre_local: string = '';
  direccioncompleta: string = '';

  // Variables para el modal de reserva
  idUsuario: string = '';
  idReserva: string = '';
  usuario: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService
  ) {
    this.reservaForm = this.fb.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      cant_horas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.idLocal = this.route.snapshot.paramMap.get('id')!;
    this.getLocal(this.idLocal);
  }

  buscarCoordenadas() {
    this.direccioncompleta = this.local?.direccion + ', ' + this.local?.comuna + ', ' + this.local?.region + ', chile';
    this.MapService.getCoordinates(this.direccioncompleta)
      .subscribe({
        next: (coords) => {
          if (coords) {
            this.dato_lat = coords.lat;
            this.dato_lng = coords.lng;
          } else {
            console.error('muerte en el if 2');
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

  cerrarModalReserva() {
    this.mostrarModalReserva = false;
    this.reservaForm.reset({
      inicio: '',
      fin: '',
      cant_horas: 1,
      descripcion: ''
    });
    this.reservaError = '';
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  enviarReserva() {
    this.reservaError = '';
    if (this.reservaForm.valid && this.local) {
      const form = this.reservaForm.value;
      const inicio = new Date(form.inicio);
      const fin = new Date(form.fin);

      if (fin <= inicio) {
        this.reservaError = 'La fecha de término debe ser posterior a la fecha de inicio.';
        return;
      }

      const usuario = this.connectionService.getSesionUsuario();
      if (!usuario) {
        alert('Debes iniciar sesión para reservar.');
        this.router.navigate(['/login']);
        return;
      }

      const reserva: Reserva = {
        id: crypto.randomUUID(),
        inicio,
        fin,
        cant_horas: form.cant_horas,
        estado: 'pendiente',
        cliente: usuario,
        propiedad: this.local,
        fecha_creacion: new Date()
      };

      const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
      reservas.push(reserva);
      localStorage.setItem('reservas', JSON.stringify(reservas));

      this.cerrarModalReserva();
      this.mostrarAlerta = true;
      setTimeout(() => this.mostrarAlerta = false, 4000);
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  async getLocal(id: string) {
    const local = await this.svLocal.getLocalById(id);
    if (local) {
      this.local = local;
      this.buscarCoordenadas();
    } else {
      this.local = null;
    }
  }

  reservar() {
    if (this.svLocal.haySesionActiva()) {
      this.mostrarModalReserva = true;
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.router.navigate(['/login']);
    }
  }
}
