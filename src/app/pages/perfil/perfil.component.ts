import { Component } from '@angular/core';
import { Local } from '../../models/models.interface';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  user = {
    nombre: 'Juan Pérez',
    correo: 'juan.perez@example.com',
    rol: 'Estudiante',
    telefono: '123-456-7890',
    creado: new Date('2024-01-01'),
  };

  selectedTabIndex = 0;

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  preferencias = {
    modoOscuro: false,
    notificaciones: true
  };

  locales: Local[] = [
    {
      id: '1',
      nombre: 'Casa en la Playa',
      region: 'Valparaíso',
      comuna: 'Viña del Mar',
      capacidad: 6,
      precioH: 12000,
      direccion: ' Avenida Prat 123 ',
      disponible: true,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    },
    {
      id: '2',
      nombre: 'Cabaña en el Bosque',
      region: 'Araucanía',
      comuna: 'Pucón',
      capacidad: 4,
      precioH: 9000,
      direccion: 'Camino al Lago 456',
      disponible: false,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    }
  ];
}
