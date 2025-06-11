import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-adm',
  standalone: false,
  templateUrl: './sidebar-adm.component.html',
  styleUrl: './sidebar-adm.component.scss'
})
export class SidebarAdmComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
