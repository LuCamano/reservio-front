import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropiedadesRoutingModule } from './propiedades-routing.module';
import { PropiedadesComponent } from './propiedades.component';


@NgModule({
  declarations: [
    PropiedadesComponent
  ],
  imports: [
    CommonModule,
    PropiedadesRoutingModule
  ]
})
export class PropiedadesModule { }
