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

  solicitarPropietario() {
    if (confirm('¿Estás seguro que deseas convertirte en propietario? Esto te permitirá agregar y administrar propiedades.')) {
      this.usuario.tipo = 'Propietario';
      this.svgLocales.setSesionUsuario(this.usuario);
    }
  }

  dejarDeSerPropietario() {
    if (confirm('¿Estás seguro que deseas dejar de ser propietario? Todas las propiedades asociadas a tu cuenta serán eliminadas del sistema.')) {
      // Elimina todas las propiedades asociadas al usuario (puedes filtrar por usuario si tienes esa lógica)
      // Si las propiedades tienen un campo de usuarioId, aquí deberías filtrar por ese campo.
      // Si no, simplemente elimina todas las propiedades (o ajusta según tu modelo).
      // Aquí asumimos que todas las propiedades son del usuario actual:
      this.locales = [];
      localStorage.setItem('locales', JSON.stringify([]));

      // Cambia el tipo de usuario
      this.usuario.tipo = 'Usuario común';
      this.svgLocales.setSesionUsuario(this.usuario);

      // Opcional: vuelve a la pestaña de perfil
      this.selectedTabIndex = 0;
    }
  }
}
