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
  isLoadingReservas = false;
  usuariosClientes: { [id: string]: Usuario } = {};
  propiedadesReservadas: { [id: string]: Local } = {};

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

  get esPropietario(): boolean {
    return this.usuario?.tipo === 'propietario' || this.usuario?.tipo === 'admin';
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
    this.isLoadingReservas = true;
    try {
      const reservas = await this.apiSv.getReservas();

      this.reservasRealizadas = reservas.filter(r =>
        r.cliente_id === this.usuario!.id
      );

      // Cargar propiedades reservadas por el usuario (que pueden no estar en this.locales)
      const propiedadIdsReservadas = Array.from(new Set(this.reservasRealizadas.map(r => r.propiedad_id)));
      await Promise.all(propiedadIdsReservadas.map(async id => {
        if (id && !this.propiedadesReservadas[id]) {
          try {
            this.propiedadesReservadas[id] = await this.apiSv.getLocal(id);
          } catch (e) {
            this.propiedadesReservadas[id] = { id, nombre: id, descripcion: '', direccion: '', tipo: '', cod_postal: '', precio_hora: 0, comuna_id: '', validada: false, activo: false };
          }
        }
      }));

      if (this.esPropietario) {
        const propiedadIds = this.locales.map(l => l.id);
        this.reservasRecibidas = reservas.filter(r =>
          propiedadIds.includes(r.propiedad_id)
        );
        const clienteIds = Array.from(new Set(this.reservasRecibidas.map(r => r.cliente_id)));
        await Promise.all(clienteIds.map(async id => {
          if (id && !this.usuariosClientes[id]) {
            try {
              this.usuariosClientes[id] = await this.apiSv.getUsuario(id);
            } catch (e) {
              this.usuariosClientes[id] = { id, email: id, rut: '', nombres: '', appaterno: '', apmaterno: '', fecha_nacimiento: new Date() };
            }
          }
        }));
      } else {
        this.reservasRecibidas = [];
        this.usuariosClientes = {};
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      this.isLoadingReservas = false;
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

  getNombrePropiedad(id: string): string {
    // Buscar primero en las propiedades reservadas, luego en las propias
    const local = this.propiedadesReservadas[id] || this.locales.find(l => l.id === id);
    return local?.nombre || id;
  }

  getNombreCliente(id: string): string {
    const usuario = this.usuariosClientes[id];
    if (!usuario) return id;
    return `${usuario.nombres} ${usuario.appaterno} (${usuario.email})`;
  }
}
