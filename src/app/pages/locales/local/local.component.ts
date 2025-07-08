import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Local, Reserva, Usuario } from '../../../models/models.interface';
import { ApiService } from '../../../services/api.service';
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
  private apiService = inject(ApiService);

  local!: Local;

  idLocal!: string;
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

  // Nuevas variables para nombre de comuna y región
  nombreRegion: string = '';
  nombreComuna: string = '';

  imagenActual: number = 0;

  // Variables y métodos para el modal de imagen
  mostrarImagenModal: boolean = false;
  imagenModalUrl: string = '';

  async ngOnInit(): Promise<void> {
    this.idLocal = this.route.snapshot.paramMap.get('id')!;
    await this.getLocal(this.idLocal);
  }

  async getLocal(id: string) {
    try {
      const local = await this.apiService.getLocal(id);
      if (local) {
        this.local = local;
        // Obtener nombre de comuna y región
        if (local.comuna) {
          this.nombreComuna = local.comuna.nombre;
          // Obtener la región asociada a la comuna
          const regionId = local.comuna.region_id;
          if (regionId) {
            const region = await this.apiService.getRegion(regionId);
            this.nombreRegion = region?.nombre || '';
          }
        }
        this.buscarCoordenadas();
      } else {
        console.error('No se encontró el local con ID:', id);
        this.router.navigate(['/locales']);
      }
    } catch (error) {
      console.error('Error al obtener el local:', error);
      this.router.navigate(['/locales']);
    }
  }

  buscarCoordenadas() {
    // Usar nombre de comuna y región para la dirección completa
    this.direccioncompleta = `${this.local?.direccion}, ${this.nombreComuna}, ${this.nombreRegion}, chile`;
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

      // Obtener usuario autenticado de forma pública
      const usuario = (this.authSvc as any).currentUserSubject?.value;
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
        propiedad: this.local, // Incluye el local completo
        fecha_creacion: new Date()
      };

      // Guardar la reserva actual para el pago (incluye el local)
      localStorage.setItem('reservaPagoActual', JSON.stringify(reserva));
      this.cerrarModalReserva();
      // Redirigir a la página de pago
      this.router.navigate(['/pago']);
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'overflow-hidden');
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

  cambiarImagen(direccion: number) {
    if (!this.local?.imagenes) return;
    const total = this.local.imagenes.length;
    this.imagenActual = (this.imagenActual + direccion + total) % total;
  }

  abrirImagenModal(url: string) {
    this.imagenModalUrl = url;
    this.mostrarImagenModal = true;
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  cerrarImagenModal() {
    this.mostrarImagenModal = false;
    this.imagenModalUrl = '';
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}
