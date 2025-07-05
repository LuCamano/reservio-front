import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loggedInGuard } from './guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("./pages/home/home.module").then(m => m.HomeModule) // ← Cambia landing por home
  },
  {
    path: 'perfil',
    loadChildren: () => import("./pages/perfil/perfil.module").then(m => m.PerfilModule),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadChildren: () => import("./pages/auth/auth.module").then(m => m.AuthModule),
    canActivate: [loggedInGuard]
  },
  {
    path: 'locales',
    loadChildren: () => import("./pages/locales/locales.module").then(m => m.LocalesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import("./pages/administracion/administracion.module").then(m => m.AdministracionModule),
    canActivate: [authGuard]
  },
  {
    path: 'pago',
    loadChildren: () => import("./pages/pago/pago.module").then(m => m.PagoModule),
    canActivate: [authGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
