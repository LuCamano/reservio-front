import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';

type endpoint = 'pagos/admin/' | 'api/v1/usuarios/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Inyecciones
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/`;

  bloquearUsuario(usuarioId: string, admin_id: string, motivo: string, desbloqueo?: Date) {
    const reqUrl = `${this.apiUrl}api/v1/usuarios/${usuarioId}/bloquear`;
    if (this.authService.isAdmin()) {
      if (desbloqueo) {
        return lastValueFrom(this.http.post(reqUrl, {}, { params: { administrador_id: admin_id, motivo, fecha_desbloqueo: desbloqueo.toISOString() } }));
      }
      return lastValueFrom(this.http.post(reqUrl, {}, { params: { administrador_id: admin_id, motivo } }));
    } else {
      throw new Error('No tienes permisos para bloquear usuarios');
    }
  }

  desbloquearUsuario(usuarioId: string) {
    const reqUrl = `${this.apiUrl}api/v1/usuarios/${usuarioId}/desbloquear`;
    if (this.authService.isAdmin()) {
      return lastValueFrom(this.http.post(reqUrl, {}, { params: { usuario_id: usuarioId } }));
    } else {
      throw new Error('No tienes permisos para desbloquear usuarios');
    }
  }
}
