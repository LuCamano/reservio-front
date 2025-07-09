import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/models.interface';

@Component({
  selector: 'app-sidebar-adm',
  standalone: false,
  templateUrl: './sidebar-adm.component.html',
  styleUrl: './sidebar-adm.component.scss'
})
export class SidebarAdmComponent implements OnInit{
  isSidenavOpen = true;
  private authSvc = inject(AuthService);
  usuario: Usuario | null = null;

  ngOnInit(){
    this.authSvc.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
  } 
  
  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    // Aquí deberías emitir un evento o usar un servicio para comunicar a app.component.ts
  }
  @Output() closeMenu = new EventEmitter<void>();

  logout() {
    this.authSvc.logout();
    window.location.href = '/login';
  }
}
