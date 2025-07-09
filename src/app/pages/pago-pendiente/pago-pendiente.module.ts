import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoPendienteRoutingModule } from './pago-pendiente-routing.module';
import { PagoPendienteComponent } from './pago-pendiente.component';


@NgModule({
  declarations: [
    PagoPendienteComponent
  ],
  imports: [
    CommonModule,
    PagoPendienteRoutingModule
  ]
})
export class PagoPendienteModule { }
