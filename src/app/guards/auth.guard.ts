import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyecciones
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si la ruta requiere admin, verificar rol
  const requiereAdmin = route.data && route.data['adminOnly'];

  if (authService.isLoggedIn()) {
    if (requiereAdmin && !authService.isAdmin()) {
      router.navigate(['/']); // Redirigir a home si no es admin
      return false;
    }
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
