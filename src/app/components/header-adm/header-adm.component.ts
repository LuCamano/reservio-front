import { Component } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/models.interface';

@Component({
  selector: 'app-header-adm',
  standalone: false,
  templateUrl: './header-adm.component.html',
  styleUrl: './header-adm.component.scss'
})
export class HeaderAdmComponent {

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
