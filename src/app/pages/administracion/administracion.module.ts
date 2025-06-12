import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionComponent } from './administracion.component';
import { ComponentsModule } from '../../components/components.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocalesAdmComponent } from './locales-adm/locales-adm.component';
import { UsuariosAdmComponent } from './usuarios-adm/usuarios-adm.component';

@NgModule({
  declarations: [
    AdministracionComponent,
    DashboardComponent,
    LocalesAdmComponent,
    UsuariosAdmComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    ComponentsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class AdministracionModule { }
