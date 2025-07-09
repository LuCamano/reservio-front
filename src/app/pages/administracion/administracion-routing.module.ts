import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionComponent } from './administracion.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocalesAdmComponent } from './locales-adm/locales-adm.component';
import { UsuariosAdmComponent } from './usuarios-adm/usuarios-adm.component';
import { ComisionesComponent } from './comisiones/comisiones.component';

const routes: Routes = [
  {
    path: '',
    component: AdministracionComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'locales', component: LocalesAdmComponent },
      { path: 'usuarios', component: UsuariosAdmComponent },
      { path: 'comisiones', component: ComisionesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
