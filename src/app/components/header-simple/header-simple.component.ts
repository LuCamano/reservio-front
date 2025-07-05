import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from '../../models/models.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-simple',
  standalone: false,
  templateUrl: './header-simple.component.html',
  styleUrl: './header-simple.component.scss'
})
export class HeaderSimpleComponent implements OnInit {
  // Inyecciones
  private authSvc = inject(AuthService);
  private router = inject(Router);
  menuAbierto = false;
  usuario: Usuario | null = null;

  ngOnInit() {
    // Suscribirse al observable del usuario actual
    this.authSvc.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
  }

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }
}
