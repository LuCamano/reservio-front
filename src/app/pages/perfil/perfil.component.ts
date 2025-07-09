import { Component, inject, OnInit } from '@angular/core';
import { Local, Usuario, Reserva } from '../../models/models.interface';
import { ConnectionService } from '../../services/connection.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  private svgLocales = inject(ConnectionService);
  private apiSv = inject(ApiService);
  private authSvc = inject(AuthService);
  private Router = inject(Router);
  usuario: Usuario | null = null;

  selectedTabIndex = 0;
  historialTabIndex = 0; // 0: recibidas, 1: realizadas

  locales: Local[] = [];
  region: string = '';
  reservasRecibidas: Reserva[] = [];
  reservasRealizadas: Reserva[] = [];

  regionMap: { [regionId: string]: string } = {};

  isLoading = true;
  async ngOnInit() {
    try {
      this.isLoading = true;
      this.usuario = await lastValueFrom(this.authSvc.getCurrentUser());

      if (this.usuario) {
        await Promise.all([
          this.getDatos(),
          this.cargarReservas()
        ]);
      }
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
    } finally {
      this.isLoading = false;
    }
  }


  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  onHistorialTabChange(index: number) {
    this.historialTabIndex = index;
  }

  async getDatos() {
    try {
      const locales = await this.apiSv.getLocales();
      this.locales = locales.filter(local =>
        local.propietarios?.some(p => p.id === this.usuario!.id)
      );

      // Pre-cargar nombres de región
      const regionIds = [...new Set(this.locales.map(l => l.comuna?.region_id).filter(Boolean))];
      await Promise.all(regionIds.map(async id => {
        if (id && !this.regionMap[id]) {
          const region = await this.apiSv.getRegion(id);
          this.regionMap[id] = region.nombre;
        }
      }));
    } catch (error) {
      console.error('Error al obtener locales o regiones:', error);
    }
  }


  async buscarRe(id: string): Promise<string> {
    try {
      const region = await this.apiSv.getRegion(id);
      this.region = region.nombre;
      return this.region;
    } catch (error) {
      console.error('Error al buscar región:', error);
      return '';
    }
  }

  async cargarReservas() {
    try {
      const reservas = await this.apiSv.getReservas();

      this.reservasRealizadas = reservas.filter(r =>
        r.cliente?.id === this.usuario!.id
      );

      if (this.usuario!.tipo === 'propietario') {
        this.reservasRecibidas = reservas.filter(r =>
          r.propiedad?.propietarios?.some(p => p.id === this.usuario!.id)
        );
      } else {
        this.reservasRecibidas = [];
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    }
  }

  async solicitarPropietario() {
    const usuarioID = this.usuario?.id;
    if (confirm('¿Estás seguro que deseas convertirte en propietario? Esto te permitirá agregar y administrar propiedades.')) {
      try {
        await this.apiSv.cambiarTipoUsuario(usuarioID!, 'propietario');
        console.log('Tipo de usuario actualizado correctamente');
        window.location.reload();
      } catch (error) {
        console.error('Error al cambiar el tipo de usuario:', error);
      }
    }
  }


  async dejarDeSerPropietario() {
    const usuarioID = this.usuario?.id;
    if (confirm('¿Estás seguro que deseas convertirte en propietario? Esto te permitirá agregar y administrar propiedades.')) {
      try {
        await this.apiSv.cambiarTipoUsuario(usuarioID!, 'cliente');
        console.log('Tipo de usuario actualizado correctamente');
        window.location.reload();
      } catch (error) {
        console.error('Error al cambiar el tipo de usuario:', error);
      }
    }
  }

  verDetallesPropiedad(local: Local) {
    this.Router.navigate(['/perfil/ver-propiedad', local.id]);
  }

  cambioContra(){
    
  }
}
