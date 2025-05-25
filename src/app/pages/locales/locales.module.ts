import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalesRoutingModule } from './locales-routing.module';
import { LocalesComponent } from './locales.component';


@NgModule({
  declarations: [
    LocalesComponent
  ],
  imports: [
    CommonModule,
    LocalesRoutingModule
  ]
})
export class LocalesModule { }
