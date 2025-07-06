import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoExitosoRoutingModule } from './pago-exitoso-routing.module';
import { PagoExitosoComponent } from './pago-exitoso.component';


@NgModule({
  declarations: [
    PagoExitosoComponent
  ],
  imports: [
    CommonModule,
    PagoExitosoRoutingModule
  ]
})
export class PagoExitosoModule { }
