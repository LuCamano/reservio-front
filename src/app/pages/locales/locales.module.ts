import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalesRoutingModule } from './locales-routing.module';
import { LocalesComponent } from './locales.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalComponent } from './local/local.component';



@NgModule({
  declarations: [
    LocalesComponent,
    LocalComponent
  ],
  imports: [
    CommonModule,
    LocalesRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class LocalesModule { }
