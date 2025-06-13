import { Component, inject, OnInit } from '@angular/core';
import { Local } from '../../models/models.interface';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent  implements OnInit {
  user = {
    nombre: 'Juan Pérez',
    correo: 'juan.perez@example.com',
    rol: 'Estudiante',
    telefono: '123-456-7890',
    creado: new Date('2024-01-01'),
  };

  svgLocales = inject(ConnectionService);

  selectedTabIndex = 0;

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  ngOnInit(): void {
    // Aquí puedes inicializar cualquier lógica que necesites al cargar el componente
    this.getDatos();
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
