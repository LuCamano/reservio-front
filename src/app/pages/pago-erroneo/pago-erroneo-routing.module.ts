import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagoErroneoComponent } from './pago-erroneo.component';

const routes: Routes = [
  {
    path: '',
    component: PagoErroneoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoErroneoRoutingModule { }
