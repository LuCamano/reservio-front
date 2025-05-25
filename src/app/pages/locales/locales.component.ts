import { Component } from '@angular/core';

@Component({
  selector: 'app-locales',
  standalone: false,
  templateUrl: './locales.component.html',
  styleUrl: './locales.component.scss'
})
export class LocalesComponent {
  locales = [
    {
      nombre: 'Salón de Eventos Principal',
      ubicacion: 'Campus Central',
      capacidad: 150,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    },
    {
      nombre: 'Auditorio Norte',
      ubicacion: 'Edificio Norte',
      capacidad: 80,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    },
    {
      nombre: 'Sala Multiuso 3',
      ubicacion: 'Pabellón B',
      capacidad: 50,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg'
    },
    {
      nombre: 'Salon de los valientes',
      ubicacion: '¿¿??',
      capacidad: "infinita de",
      imagenUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Backrooms_model.jpg/1200px-Backrooms_model.jpg'
    }
    
  ];
}
