import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoErroneoRoutingModule } from './pago-erroneo-routing.module';
import { PagoErroneoComponent } from './pago-erroneo.component';


@NgModule({
  declarations: [
    PagoErroneoComponent
  ],
  imports: [
    CommonModule,
    PagoErroneoRoutingModule
  ]
})
export class PagoErroneoModule { }
