import { Component, inject, OnInit } from '@angular/core';
import { Local, Usuario } from '../../models/models.interface';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;
  svgLocales = inject(ConnectionService);

  selectedTabIndex = 0;

  ngOnInit(): void {
    this.usuario = this.svgLocales.getSesionUsuario()!;
    this.getDatos();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  async getDatos(){
    try {
      this.locales = await this.svgLocales.getLocales();
      console.log(this.locales);
    } catch (error) {
      console.error('Error al obtener los datos de los locales:', error);
    }
  }

  preferencias = {
    modoOscuro: false,
    notificaciones: true
  };

  locales: Local[] = [];
}
