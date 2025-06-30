import { Component, OnInit, inject } from '@angular/core';
import { ConnectionService } from './services/connection.service';
import { Local, Usuario } from './models/models.interface';

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
      descripcion: 'Hermosa casa frente al mar, ideal para vacaciones familiares.',
      precioH: 12000,
      direccion: 'Avenida Prat 123',
      disponible: true,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg',
      usuario: 'reservio@reservio.cl'
    },
    {
      id: '2',
      nombre: 'Cabaña en el Bosque',
      region: 'biobío',
      comuna: 'Tomé',
      capacidad: 4,
      descripcion: 'Encantadora cabaña rodeada de naturaleza, perfecta para desconectar.',
      precioH: 9000,
      direccion: '',
      disponible: false,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg',
      usuario: 'reservio@reservio.cl'
    },
    {
      id: '3',
      nombre: 'Mall de Santiago',
      region: 'Metropolitana',
      comuna: 'Santiago',
      descripcion: 'Amplio local comercial en el corazón de Santiago, ideal para eventos y exposiciones.',
      capacidad: 2,
      precioH: 15000,
      direccion: 'Avenida Libertador 789',
      disponible: true,
      imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg',
      usuario: 'reservio2@reservio.cl'
    }
  ];

  usuariosTest: Usuario[] = [
    {
      id: '1',
      email: 'reservio@reservio.cl',
      password: '123456',
      rut: '11.111.111-1',
      nombres: 'Usuario',
      appaterno: 'Prueba',
      apmaterno: 'Reservio',
      fecha_nacimiento: new Date('2020-01-01'),
      tipo: 'Propietario',
      activo: true,
      fecha_creacion: new Date('2020-01-01')
    },
    {
      id: '2',
      email: 'reservio2@reservio.cl',
      password: '123456',
      rut: '11.111.111-1',
      nombres: 'Usuario',
      appaterno: 'Prueba',
      apmaterno: 'Reservio',
      fecha_nacimiento: new Date('2020-01-01'),
      tipo: 'Propietario',
      activo: true,
      fecha_creacion: new Date('2020-01-01')
    }
  ];

  ngOnInit() {
    // Aquí puedes inicializar cualquier lógica que necesites al cargar el componente
    localStorage.clear();
    this.localesTest.forEach(local => {
      this.svc.addLocal(local);
    });
    this.usuariosTest.forEach(usuario => {
      this.svc.registrarUsuario(usuario);
    });
  }

}
