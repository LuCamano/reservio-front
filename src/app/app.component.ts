import { Component, OnInit, Injectable, inject } from '@angular/core';
import { ConnectionService } from './services/connection.service';
import { Local } from './models/models.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'reservio-front';
  svc= inject(ConnectionService);

  localesTest: Local[] = [
    {
      id: '1',
      nombre: 'Casa en la Playa',
      region: 'Valparaíso',
      comuna: 'Viña del Mar',
      capacidad: 6,
      precioH: 12000,
      direccion: 'Avenida Prat 123',
      disponible: true,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    },
    {
      id: '2',
      nombre: 'Cabaña en el Bosque',
      region: 'Los Lagos',
      comuna: 'Puerto Varas',
      capacidad: 4,
      precioH: 9000,
      direccion: 'Camino al Lago 456',
      disponible: false,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    },
    {
      id: '3',
      nombre: 'Mall de Santiago',
      region: 'Metropolitana',
      comuna: 'Santiago',
      capacidad: 2,
      precioH: 15000,
      direccion: 'Avenida Libertador 789',
      disponible: true,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    }
  ];

  ngOnInit() {
    // Aquí puedes inicializar cualquier lógica que necesites al cargar el componente
    localStorage.clear();
    this.localesTest.forEach(local => {
      this.svc.addLocal(local);
    });
  }

}
