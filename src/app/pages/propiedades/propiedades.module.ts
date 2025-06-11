import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../components/components.module';
import { PropiedadesRoutingModule } from './propiedades-routing.module';
import { PropiedadesComponent } from './propiedades.component';
// Import Angular Material modules:
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PropiedadesComponent
  ],
  imports: [
    CommonModule,
    PropiedadesRoutingModule,
    ComponentsModule
  ]
})
export class PropiedadesModule { }
