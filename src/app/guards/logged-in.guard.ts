import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (authSvc.isLoggedIn()) {
    router.navigate(['/perfil']);
    return false; // Bloquea la navegación a la ruta de login
  } else {
    return true; // Permite la navegación a la ruta de login
  }
};
