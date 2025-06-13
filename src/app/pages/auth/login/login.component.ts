import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../services/connection.service';
import { Usuario } from '../../../models/models.interface';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private connectionService: ConnectionService,
    private router: Router
  ) {}

  onSubmit() {
    // Aquí deberías validar el usuario contra tu backend o una lista local.
    // Para ejemplo, creamos un usuario de prueba:
    const usuarios: Usuario[] = this.connectionService.getUsuarios();
    const usuario = usuarios.find(u => u.email === this.email && u.password === this.password);
    if (usuario) {
      // Si el usuario es encontrado, guardamos la sesión y redirigimos
      this.connectionService.setSesionUsuario(usuario);
      this.router.navigate(['/']);
    } else {
      // Si no se encuentra, mostramos un error
      this.error = 'Email o contraseña incorrectos';
    }
  }
}
