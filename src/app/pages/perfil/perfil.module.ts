import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { VerPropiedadComponent } from './ver-propiedad/ver-propiedad.component';
import { AddPropiedadComponent } from './add-propiedad/add-propiedad.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PerfilComponent,
    VerPropiedadComponent,
    AddPropiedadComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule
]
})
export class PerfilModule { }
