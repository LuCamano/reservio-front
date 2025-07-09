import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagoComponent } from './pago.component';

const routes: Routes = [
  {
    path: ':id',
    component: PagoComponent
  },
  {
    path: '',
    redirectTo: '/pago/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoRoutingModule { }
