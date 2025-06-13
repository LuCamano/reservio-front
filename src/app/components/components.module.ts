import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderSimpleComponent } from './header-simple/header-simple.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SidebarAdmComponent } from './sidebar-adm/sidebar-adm.component';
import { MapComponent } from './map/map.component';



@NgModule({
  declarations: [
    HeaderSimpleComponent,
    SidebarAdmComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [
    HeaderSimpleComponent,
    SidebarAdmComponent,
    MapComponent
  ]
})
export class ComponentsModule {
  static headerSimpleComponent = HeaderSimpleComponent;
  static headerSimpleComponentSelector = 'app-header-simple';
 }
