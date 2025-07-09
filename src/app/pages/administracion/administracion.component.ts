import { Component, HostListener, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/models.interface';

@Component({
  selector: 'app-administracion',
  standalone: false,
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent implements OnInit{
  private authSvc = inject(AuthService)
  mobileMenuOpen = false;
  usuario: Usuario | null = null;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnInit(){
    this.authSvc.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
  }
}
