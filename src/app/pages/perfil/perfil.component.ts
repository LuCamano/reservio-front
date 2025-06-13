import { Component, inject, OnInit } from '@angular/core';
import { Local, Usuario, Reserva } from '../../models/models.interface';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  private svgLocales = inject(ConnectionService);
  usuario!: Usuario;
  
  selectedTabIndex = 0;
  historialTabIndex = 0; // 0: recibidas, 1: realizadas

  locales: Local[] = [];

  reservasRecibidas: Reserva[] = [];
  reservasRealizadas: Reserva[] = [];

  ngOnInit(): void {
    this.usuario = this.svgLocales.getSesionUsuario()!;
    this.getDatos();
    this.cargarReservas();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  onHistorialTabChange(index: number) {
    this.historialTabIndex = index;
  }

  getDatos(){
    try {
      this.locales = this.svgLocales.getLocales().filter(local => {
        return local.usuario === this.usuario.email;
      });
    } catch (error) {
      console.error('Error al obtener los datos de los locales:', error);
    }
  }

  cargarReservas() {
    const reservas: Reserva[] = JSON.parse(localStorage.getItem('reservas') || '[]');
    // Reservas recibidas: propiedades donde el usuario es propietario
    this.reservasRecibidas = reservas.filter(r =>
      r.propiedad?.usuario === this.usuario.email
    );
    // Reservas realizadas: donde el usuario es el cliente
    this.reservasRealizadas = reservas.filter(r =>
      r.cliente?.email === this.usuario.email
    );
  }

  preferencias = {
    modoOscuro: false,
    notificaciones: true
  };


  solicitarPropietario() {
    if (confirm('¿Estás seguro que deseas convertirte en propietario? Esto te permitirá agregar y administrar propiedades.')) {
      this.usuario.tipo = 'Propietario';
      this.svgLocales.setSesionUsuario(this.usuario);
    }
  }

  dejarDeSerPropietario() {
    if (confirm('¿Estás seguro que deseas dejar de ser propietario? Todas las propiedades asociadas a tu cuenta serán eliminadas del sistema.')) {
      this.locales = [];
      localStorage.setItem('locales', JSON.stringify([]));
      this.usuario.tipo = 'Usuario común';
      this.svgLocales.setSesionUsuario(this.usuario);
      this.selectedTabIndex = 0;
    }
  }
}
