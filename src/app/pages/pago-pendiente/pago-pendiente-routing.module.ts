import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagoPendienteComponent } from './pago-pendiente.component';

const routes: Routes = [
  {
    path: '',
    component: PagoPendienteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoPendienteRoutingModule { }
