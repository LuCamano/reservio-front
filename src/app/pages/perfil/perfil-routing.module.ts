import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { VerPropiedadComponent } from './ver-propiedad/ver-propiedad.component';
import { AddPropiedadComponent } from './add-propiedad/add-propiedad.component';

const routes: Routes = [
  {
    path: '', component: PerfilComponent
  },
  {
    path: 'ver-propiedad', component: VerPropiedadComponent
  },
  {
    path: 'add-propiedad', component: AddPropiedadComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
