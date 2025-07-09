import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/models.interface';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { rutValidator } from '../../../validators/rut.validator';
import { formatRut, RutFormat } from '@fdograph/rut-utilities';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  // Inyecciones
  private authSvc = inject(AuthService);
  private router = inject(Router);

  loading = false;

  // Validador personalizado para solo letras (sin números)
  soloLetrasValidator(control: AbstractControl): { soloLetras: boolean } | null {
    const value = control.value || '';
    // Permite letras, espacios y tildes, pero no números ni caracteres especiales
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(value) ? null : { soloLetras: true };
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl('', [Validators.required, this.identicalPasswordsValidation('password')]),
    rut: new FormControl('', [Validators.required, rutValidator]),
    nombres: new FormControl('', [Validators.required, Validators.minLength(2), this.soloLetrasValidator]),
    appaterno: new FormControl('', [Validators.required, Validators.minLength(2), this.soloLetrasValidator]),
    apmaterno: new FormControl('', [Validators.required, Validators.minLength(2), this.soloLetrasValidator]),
    fecha_nacimiento: new FormControl((new Date().toISOString().split('T')[0]), [Validators.required, this.validarEdad])
  });

  // Tipos de errores
  rutErrors = {
    required: 'El RUT es obligatorio.',
    invalidRut: 'El RUT es inválido.'
  };
  emailErrors = {
    required: 'El email es obligatorio.',
    email: 'El email debe ser válido.'
  };
  passwordErrors = {
    required: 'La contraseña es obligatoria.',
    minlength: 'La contraseña debe tener al menos 6 caracteres.'
  };
  repeatPasswordErrors = {
    required: 'Debe repetir la contraseña.',
    notIdentical: 'Las contraseñas no coinciden.'
  };
  nombresErrors = {
    required: 'Los nombres son obligatorios.',
    minlength: 'Los nombres deben tener al menos 2 caracteres.',
    soloLetras: 'Solo se permiten letras.'
  };
  appaternoErrors = {
    required: 'El apellido paterno es obligatorio.',
    minlength: 'El apellido paterno debe tener al menos 2 caracteres.',
    soloLetras: 'Solo se permiten letras.'
  };
  apmaternoErrors = {
    required: 'El apellido materno es obligatorio.',
    minlength: 'El apellido materno debe tener al menos 2 caracteres.',
    soloLetras: 'Solo se permiten letras.'
  };
  fechaNacimientoErrors = {
    required: 'La fecha de nacimiento es obligatoria.',
    invalidDate: 'Debe ser mayor de 18 años.'
  };

  identicalPasswordsValidation(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.root.get(passwordControlName)?.value;
      const repeatPassword = control.value;

      if (!password || !repeatPassword) {
        return null; // No validation error if either field is empty
      }

      if (password !== repeatPassword) {
        return { notIdentical: true };
      } else {
        return null;
      }
    };
  }

  // Formatea el RUT mientras se escribe
  formatearRut() {
    // Elimina todo lo que no sea número o K/k
    let rut = this.registerForm.controls.rut.value!.replace(/[^0-9kK]/g, '').toUpperCase();

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

    this.registerForm.controls.rut.setValue(cuerpoFormateado + (dv ? '-' + dv : ''));
  }

  async onSubmit() {
    this.loading = true;
    try {
      // Validar que la fecha sea válida
      const fechaNacimientoDate = new Date(this.registerForm.controls.fecha_nacimiento.value!);
  
      // Construir el objeto usuario
      const usuario: Usuario = {
        email: this.registerForm.controls.email.value!,
        rut: this.registerForm.controls.rut.value!,
        nombres: this.registerForm.controls.nombres.value!,
        appaterno: this.registerForm.controls.appaterno.value!,
        apmaterno: this.registerForm.controls.apmaterno.value!,
        fecha_nacimiento: fechaNacimientoDate,
        tipo: 'cliente', // Siempre por defecto
        password: this.registerForm.controls.password.value!
      };
      console.log('Usuario a registrar:', usuario);
  
      // Llamar al servicio de registro
      const resp = await this.authSvc.register(usuario);
      console.log('Respuesta del registro:', resp);
      // Redirigir al home
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    } finally {
      this.loading = false;
    }
  }

  validarEdad(control: FormControl): ValidationErrors | null {
    const fechaNacimientoDate = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoDate.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
      edad--;
    }

    return edad >= 18 ? null : { invalidDate: true };
  }
}

