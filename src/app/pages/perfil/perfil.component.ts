import { Component } from '@angular/core';

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
}
