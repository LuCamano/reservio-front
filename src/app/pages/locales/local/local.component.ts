import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Local, Reserva, Usuario } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { ActivatedRoute, Router } from '@angular/router';

import { OpenStreetMapService } from '../../../services/open-street-map.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-local',
  standalone: false,
  templateUrl: './local.component.html',
  styleUrl: './local.component.scss'
})
export class LocalComponent implements OnDestroy {

  // Inyectar el servicio OpenStreetMap
  private MapService = inject(OpenStreetMapService);
  private renderer = inject(Renderer2);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authSvc = inject(AuthService);
  private connectionService = inject(ConnectionService);

  local: Local | null = null;

  idLocal!: string;
  svLocal = inject(ConnectionService);

  isLoading = true;
  mapError = false;

  mostrarModalReserva = false;
  mostrarAlerta = false;
  reservaForm = new FormGroup({
    inicio: new FormControl('', [Validators.required]),
    fin: new FormControl('', [Validators.required]),
    cant_horas: new FormControl(1, [Validators.required, Validators.min(1)]),
    descripcion: new FormControl('', [Validators.required])
  });

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
      const inicio = new Date(form.inicio!);
      const fin = new Date(form.fin!);

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
        cant_horas: form.cant_horas!,
        estado: 'pendiente',
        cliente: usuario,
        propiedad: this.local,
        fecha_creacion: new Date()
      };

      const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
      reservas.push(reserva);
      localStorage.setItem('reservas', JSON.stringify(reservas));
      // Guardar la reserva actual para el pago
      localStorage.setItem('reservaPagoActual', JSON.stringify(reserva));
      this.cerrarModalReserva();
      // Redirigir a la página de pago
      this.router.navigate(['/pago']);
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
    if (this.authSvc.isLoggedIn()) {
      this.mostrarModalReserva = true;
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.router.navigate(['/login']);
    }
  }

  actualizarHoras() {
    const inicioStr = this.reservaForm.get('inicio')?.value;
    const finStr = this.reservaForm.get('fin')?.value;
    if (inicioStr && finStr) {
      const inicio = new Date(inicioStr);
      const fin = new Date(finStr);
      if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime()) && fin > inicio) {
        const diffMs = fin.getTime() - inicio.getTime();
        const diffHrs = diffMs / (1000 * 60 * 60);
        this.reservaForm.get('cant_horas')?.setValue(Math.max(1, Math.round(diffHrs)));
      } else {
        this.reservaForm.get('cant_horas')?.setValue(1);
      }
    } else {
      this.reservaForm.get('cant_horas')?.setValue(1);
    }
  }
}
