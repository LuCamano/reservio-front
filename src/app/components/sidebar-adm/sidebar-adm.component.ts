import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-adm',
  standalone: false,
  templateUrl: './sidebar-adm.component.html',
  styleUrl: './sidebar-adm.component.scss'
})
export class SidebarAdmComponent {
  isSidenavOpen = true;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    // Aquí deberías emitir un evento o usar un servicio para comunicar a app.component.ts
  }
  @Output() closeMenu = new EventEmitter<void>();
}
