import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Local, Reserva, Usuario, Valoracion } from '../../../models/models.interface';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

import { OpenStreetMapService } from '../../../services/open-street-map.service';
import { AuthService } from '../../../services/auth.service';
import { lastValueFrom } from 'rxjs';

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
    
  });
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

  // Nueva variable para reservas del local
  reservasLocal: Reserva[] = [];

  // Nueva lógica para valoraciones
  valoracionForm: FormGroup;
  isSendingValoracion = false;

  constructor() {
    this.valoracionForm = new FormGroup({
      puntaje: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
      comentario: new FormControl('', [Validators.maxLength(500)])
    });
  }

  async ngOnInit(): Promise<void> {
    this.authSvc.getCurrentUser().subscribe(u => this.usuario = u)
    this.idLocal = this.route.snapshot.paramMap.get('id')!;
    await this.getLocal(this.idLocal);
    await this.cargarReservasLocal();
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

  async cargarReservasLocal() {
    try {
      const todas = await this.apiService.getReservas(0, 1000); // Asume menos de 1000 reservas
      this.reservasLocal = todas.filter(r => r.propiedad_id === this.idLocal && r.estado !== 'cancelada');
    } catch (e) {
      this.reservasLocal = [];
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
    });
    this.reservaError = '';
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  async enviarReserva() {
    if (this.reservaForm.valid) {
      const inicio = new Date(this.reservaForm.get('inicio')?.value!);
      const fin = new Date(this.reservaForm.get('fin')?.value!);
      const cantHoras = this.reservaForm.get('cant_horas')?.value;

      if (inicio >= fin) {
        this.reservaError = 'La fecha de inicio debe ser anterior a la fecha de fin.';
        return;
      }

      if (!cantHoras) {
        this.reservaError = 'La cantidad de horas es requerida.';
        return;
      }

      if (cantHoras < 1) {
        this.reservaError = 'La cantidad de horas debe ser al menos 1.';
        return;
      }

      // Validar solapamiento SOLO POR FECHA (ignorar hora)
      const getDateString = (d: Date) => {
        return d.getFullYear() + '-' + (d.getMonth()+1).toString().padStart(2,'0') + '-' + d.getDate().toString().padStart(2,'0');
      };
      // Generar set de fechas de la nueva reserva
      const fechasNueva = new Set<string>();
      let d = new Date(inicio);
      while (d <= fin) {
        fechasNueva.add(getDateString(d));
        d.setDate(d.getDate() + 1);
      }
      // Revisar si alguna fecha de la nueva reserva ya está ocupada
      const solapada = this.reservasLocal.some(r => {
        let d1 = new Date(r.inicio);
        let d2 = new Date(r.fin);
        while (d1 <= d2) {
          if (fechasNueva.has(getDateString(d1))) return true;
          d1.setDate(d1.getDate() + 1);
        }
        return false;
      });
      if (solapada) {
        this.reservaError = 'Ya existe una reserva en ese día para este local. Por favor elige otra fecha.';
        return;
      }

      const reserva: Reserva = {
        inicio: inicio,
        fin: fin,
        cant_horas: cantHoras,
        costo_total: this.local.precio_hora * cantHoras,
        estado: 'pendiente',
        cliente_id: this.usuario?.id!,
        propiedad_id: this.local.id!,
      };

      try {
        const nuevaReserva = await this.apiService.createReserva(reserva);
        this.cerrarModalReserva();
        this.router.navigate(['/pago', nuevaReserva.id]);
        this.mostrarAlerta = true;
        // Recargar reservas para reflejar la nueva
        await this.cargarReservasLocal();
      } catch (error) {
        console.error('Error al crear la reserva:', error);
        this.reservaError = 'No se pudo crear la reserva. Inténtalo nuevamente más tarde.';
      }
    }
  }

  async enviarValoracion() {
    if (this.valoracionForm.invalid) return;
    this.isSendingValoracion = true;
    const valoracion: Valoracion = {
      puntaje: this.valoracionForm.value.puntaje,
      comentario: this.valoracionForm.value.comentario,
      fecha: new Date(),
      propiedad_id: this.idLocal,
      cliente_id: this.usuario?.id // Puede ser undefined si no hay sesión
    };
    try {
      await this.apiService.createValoracion(valoracion);
      this.valoracionForm.reset({ puntaje: 0, comentario: '' });
    } catch (e) {
      // Manejar error
    }
    this.isSendingValoracion = false;
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  reservar() {
    if (this.authSvc.isLoggedIn()) {
      this.mostrarModalReserva = true;
      console.log('Abriendo modal, cambios aplicados');
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
