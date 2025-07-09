import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Local, Reserva, Valoracion, Usuario } from '../../models/models.interface';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';

export interface Ciudad {
  name: string;
  Locales: string;
}
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Inyecciones
  private svgLocales = inject(ConnectionService);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  heroImages = [
    'assets/homeassets/hero/conciertopequeno.jpg',
    'assets/homeassets/hero/juntaempresa.jpg',
    'assets/homeassets/hero/celebracion.jpg',
  ];

  locales: Local[] = [];
  recomendados: Local[] = [];

  extendedImages: string[] = [];
  currentImage = 0;
  private intervalId?: ReturnType<typeof setInterval>;
  animating = true;

  regionesMap: { [id: string]: string } = {};

  usuario: Usuario | null = null;
  reservasPendientesValoracion: Reserva[] = [];
  // mostrarModalValoracion = false;
  // reservaAValorar: Reserva | null = null;
  // valoracionForm = {
  //   puntaje: 0,
  //   comentario: ''
  // };

  ngOnInit() {
    // Duplicamos la primera imagen al final
    this.extendedImages = [...this.heroImages, this.heroImages[0]];
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
    this.getDatos();
    this.cargarUsuarioYReservas();
  }

  nextSlide() {
    this.currentImage++;
    this.animating = true;
    // Si llegamos al duplicado, esperamos la animación y saltamos sin animación
    if (this.currentImage === this.heroImages.length) {
      setTimeout(() => {
        this.animating = false;
        this.currentImage = 0;
      }, 700); // Debe coincidir con duration-700 de Tailwind
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  async getDatos(){
    try {
      // Obtener regiones y armar un mapa id->nombre
      const regiones = await this.apiService.getRegiones();
      this.regionesMap = {};
      for (const region of regiones) {
        if (region.id) this.regionesMap[region.id] = region.nombre;
      }
      this.locales = (await this.apiService.getLocales()).filter(local => local.validada);
      // Elegir 3 locales al azar para recomendados
      if (this.locales.length > 3) {
        const indices = new Set<number>();
        while (indices.size < 3) {
          indices.add(Math.floor(Math.random() * this.locales.length));
        }
        this.recomendados = Array.from(indices).map(i => this.locales[i]);
      } else {
        this.recomendados = [...this.locales];
      }
    } catch (error) {
      console.error('Error al obtener los datos de los locales:', error);
    }
  }

  get isAdmin(): boolean {
    return this.usuario?.tipo === 'admin';
  }

  async cargarUsuarioYReservas() {
    try {
      this.usuario = await lastValueFrom(this.authService.getCurrentUser());
      if (this.usuario) {
        const reservas = await this.apiService.getReservas();
        const ahora = new Date();
        // Filtrar reservas realizadas por el usuario, finalizadas y no valoradas
        this.reservasPendientesValoracion = reservas.filter(r =>
          r.cliente_id === this.usuario!.id &&
          new Date(r.fin) < ahora
        );
      }
    } catch (e) {
      this.usuario = null;
    }
  }

  // async enviarValoracion() {
  //   if (!this.reservaAValorar || !this.usuario) return;
  //   const valoracion: Valoracion = {
  //     puntaje: this.valoracionForm.puntaje,
  //     comentario: this.valoracionForm.comentario,
  //     cliente_id: this.usuario.id!,
  //     propiedad_id: this.reservaAValorar.propiedad_id,
  //     fecha: new Date().toISOString()
  //   };
  //   try {
  //     await this.apiService.createValoracion(valoracion);
  //     this.mostrarModalValoracion = false;
  //     // Opcional: marcar la reserva como valorada en el backend o refrescar lista
  //   } catch (e) {
  //     alert('Error al enviar valoración');
  //   }
  // }

  // cerrarModalValoracion() {
  //   this.mostrarModalValoracion = false;
  // }

}