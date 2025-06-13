import { Component } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Usuario } from '../../models/models.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-simple',
  standalone: false,
  templateUrl: './header-simple.component.html',
  styleUrl: './header-simple.component.scss'
})
export class HeaderSimpleComponent {
  menuAbierto = false;
  usuario?: Usuario;

  constructor(private connectionService: ConnectionService, private router: Router) {
    this.usuario = this.connectionService.getSesionUsuario();
  }

  logout() {
    this.connectionService.limpiarSesionUsuario();
    this.router.navigate(['/login']);
  }
}
