import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyecciones
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(resolve => {
    if (authService.isLoggedIn()){
      resolve(true);
    } else {
      router.navigate(['/login']);
      resolve(false);
    }
  });
};
