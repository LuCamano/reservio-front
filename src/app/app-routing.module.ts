import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("./pages/home/home.module").then(m => m.HomeModule) // ← Cambia landing por home
  },
  {
    path: 'home',
    loadChildren: () => import("./pages/home/home.module").then(m => m.HomeModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import("./pages/perfil/perfil.module").then(m => m.PerfilModule)
  },
  {
    path: 'login',
    loadChildren: () => import("./pages/auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: 'locales',
    loadChildren: () => import("./pages/locales/locales.module").then(m => m.LocalesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import("./pages/administracion/administracion.module").then(m => m.AdministracionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
