import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("./pages/landing/landing.module").then(m => m.LandingModule)
  },
  {
    path: 'home',
    loadChildren: () => import("./pages/home/home.module").then(m => m.HomeModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import("./pages/perfil/perfil.module").then(m => m.PerfilModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
