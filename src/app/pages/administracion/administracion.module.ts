import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionComponent } from './administracion.component';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    AdministracionComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    ComponentsModule
  ]
})
export class AdministracionModule { }
