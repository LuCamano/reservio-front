import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (authSvc.isLoggedIn()) {
    console.log('🔐 Usuario ya está autenticado, redirigiendo a perfil');
    router.navigate(['/perfil']);
    return false; // Bloquea la navegación a la ruta de login
  } else {
    console.log('🔓 Usuario no autenticado, permitiendo acceso a login');
    return true; // Permite la navegación a la ruta de login
  }
};
