import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Inyecciones
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  error: string = '';
  loading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.authService.currentUser$.pipe(first(user => !!user)).subscribe(user => {
            if (user?.tipo === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
            this.loading = false;
          });
        },
        error: err => {
          this.error = 'Error de autenticación. Por favor, verifica tus credenciales.';
          this.loading = false;
        }
      })
    }
  }
}
