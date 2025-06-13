import { Component } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Usuario } from '../../models/models.interface';

@Component({
  selector: 'app-header-simple',
  standalone: false,
  templateUrl: './header-simple.component.html',
  styleUrl: './header-simple.component.scss'
})
export class HeaderSimpleComponent {
  menuAbierto = false;
  usuario: Usuario | null = null;

  constructor(private connectionService: ConnectionService) {
    this.usuario = this.connectionService.getSesionUsuario();
  }
}
