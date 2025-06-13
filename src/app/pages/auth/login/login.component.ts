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
    if (this.email === 'reservio@reservio.cl' && this.password === '123456') {
      const usuario: Usuario = {
        id: '1',
        email: this.email,
        rut: '11.111.111-1',
        nombre: 'Demo',
        apaterno: 'Usuario',
        amaterno: '',
        fechaNacimiento: new Date(2000, 0, 1),
        tipo: 'Usuario Comun',
        contraseña: this.password,
        fechacreacion: new Date(),
        activo: true
      };
      this.connectionService.setSesionUsuario(usuario);
      this.router.navigate(['/home']);
    } else {
      this.error = 'Correo o contraseña incorrectos';
    }
  }
}
