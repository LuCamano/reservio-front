import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../services/connection.service';
import { Usuario } from '../../../models/models.interface';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  // Campos del formulario
  email = '';
  password = '';
  repeatPassword = '';
  rut = '';
  nombres = '';
  appaterno = '';
  apmaterno = '';
  fecha_nacimiento = '';

  error = '';
  emailError = false;
  rutError = false;

  emailTouched = false;
  passwordTouched = false;
  repeatPasswordTouched = false;
  rutTouched = false;
  nombresTouched = false;
  appaternoTouched = false;
  apmaternoTouched = false;
  fechaNacimientoTouched = false;

  constructor(
    private connectionService: ConnectionService,
    private router: Router
  ) {}

  // Formatea el RUT mientras se escribe
  formatearRut() {
    // Elimina todo lo que no sea número o K/k
    let rut = this.rut.replace(/[^0-9kK]/g, '').toUpperCase();

    // Máximo 8 dígitos + 1 verificador
    if (rut.length > 9) rut = rut.slice(0, 9);

    // Separa el dígito verificador
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);

    // Agrega puntos y guion
    let cuerpoFormateado = '';
    while (cuerpo.length > 3) {
      cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
      cuerpo = cuerpo.slice(0, -3);
    }
    cuerpoFormateado = cuerpo + cuerpoFormateado;

    this.rut = cuerpoFormateado + (dv ? '-' + dv : '');
  }

  validarRut(rut: string): boolean {
    // Valida formato XX.XXX.XXX-X
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return rutRegex.test(rut);
  }

  validarEmail(email: string): boolean {
    // Expresión regular simple para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit() {
    this.error = '';
    this.emailError = false;
    this.rutError = false;

    // Validación de email
    if (!this.validarEmail(this.email)) {
      this.emailError = true;
      this.error = 'Correo inválido.';
      return;
    }

    // Validación de RUT
    if (!this.validarRut(this.rut)) {
      this.rutError = true;
      return;
    }

    // Validación de contraseñas
    if (this.password !== this.repeatPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    // Validar que la fecha sea válida
    const fechaNacimientoDate = this.fecha_nacimiento ? new Date(this.fecha_nacimiento) : null;
    if (!fechaNacimientoDate || isNaN(fechaNacimientoDate.getTime())) {
      this.error = 'Fecha de nacimiento inválida.';
      return;
    }

    // Construir el objeto usuario
    const usuario: Usuario = {
      id: Date.now().toString(),
      email: this.email,
      rut: this.rut,
      nombres: this.nombres,
      appaterno: this.appaterno,
      apmaterno: this.apmaterno,
      fecha_nacimiento: fechaNacimientoDate,
      tipo: 'Usuario común', // Siempre por defecto
      password: this.password,
      fecha_creacion: new Date(),
      activo: true
    };

    // Guardar usuario en localStorage (sesión iniciada)
    this.connectionService.setSesionUsuario(usuario);

    // Redirigir al home
    this.router.navigate(['/home']);
  }
}

