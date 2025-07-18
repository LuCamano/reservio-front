import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalesRoutingModule } from './locales-routing.module';
import { LocalesComponent } from './locales.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LocalComponent } from './local/local.component';
import { ComponentsModule } from "../../components/components.module";



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
    FormsModule,
    ComponentsModule,
    
]
})
export class LocalesModule { }
