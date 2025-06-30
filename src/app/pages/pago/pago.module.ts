import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoRoutingModule } from './pago-routing.module';
import { PagoComponent } from './pago.component';


@NgModule({
  declarations: [
    PagoComponent
  ],
  imports: [
    CommonModule,
    PagoRoutingModule
  ]
})
export class PagoModule { }
