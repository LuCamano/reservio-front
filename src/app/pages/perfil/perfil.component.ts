import { Component, inject, OnInit } from '@angular/core';
import { Local, Usuario, Reserva } from '../../models/models.interface';
import { ConnectionService } from '../../services/connection.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

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

  reservasRecibidas: Reserva[] = [];
  reservasRealizadas: Reserva[] = [];

  ngOnInit(): void {
    this.authSvc.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
    // this.getDatos();
    this.cargarReservas();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  onHistorialTabChange(index: number) {
    this.historialTabIndex = index;
  }

  // getDatos(){
  //   try {
  //     this.locales = this.svgLocales.getLocales().filter(local => {
  //       return local.usuario === this.usuario.email;
  //     });
  //   } catch (error) {
  //     console.error('Error al obtener los datos de los locales:', error);
  //   }
  // }

  cargarReservas() {
    this.apiSv.getReservas().then(reservas => {
      // Realizadas: reservas hechas por el usuario (como cliente)
      this.reservasRealizadas = reservas.filter(r => r.cliente?.id === this.usuario!.id);

      // Recibidas: reservas hechas a propiedades del usuario (si es propietario)
      if (this.usuario!.tipo === 'propietario') {
        this.reservasRecibidas = reservas.filter(r =>
          r.propiedad?.propietarios?.some(p => p.id === this.usuario!.id)
        );
      } else {
        this.reservasRecibidas = [];
      }
    });
  }


  solicitarPropietario() {
    if (confirm('¿Estás seguro que deseas convertirte en propietario? Esto te permitirá agregar y administrar propiedades.')) {
      this.usuario!.tipo = 'propietario';
      this.svgLocales.setSesionUsuario(this.usuario);
    }
  }

  dejarDeSerPropietario() {
    if (confirm('¿Estás seguro que deseas dejar de ser propietario? Todas las propiedades asociadas a tu cuenta serán eliminadas del sistema.')) {
      this.usuario!.tipo = 'cliente';
      this.svgLocales.setSesionUsuario(this.usuario);
      this.selectedTabIndex = 0;
      // Eliminar todas las propiedades del usuario
      this.locales.forEach(local => {
        this.svgLocales.deleteLocal(local.id!);
      });
      this.locales = [];
    }
  }

  verDetallesPropiedad(local: Local) {
    this.Router.navigate(['/perfil/ver-propiedad', local.id]);
  }
}
