import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderSimpleComponent } from './header-simple/header-simple.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SidebarAdmComponent } from './sidebar-adm/sidebar-adm.component';



@NgModule({
  declarations: [
    HeaderSimpleComponent,
    SidebarAdmComponent
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
    SidebarAdmComponent
  ]
})
export class ComponentsModule {
  static headerSimpleComponent = HeaderSimpleComponent;
  static headerSimpleComponentSelector = 'app-header-simple';
 }
