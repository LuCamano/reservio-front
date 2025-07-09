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

  validarPropiedad(propiedad_id: string) {
    const reqUrl = `${this.apiUrl}api/v1/propiedades/${propiedad_id}/validar`;
    console.log(this.authService.isAdmin());
    if (this.authService.isAdmin()) {
      return lastValueFrom(this.http.post(reqUrl, {}));
    } else {
      throw new Error('No tienes permisos para validar propiedades');
    }
  }

  /////////////////////////////////////////////////////
  // Para ver como se usan los endpoints de pagos   ///
  // Revisar los readme del repositorio del backend ///
  /////////////////////////////////////////////////////

  getComisionesPorPagar() {
    const reqUrl = `${this.apiUrl}pagos/admin/comisiones-a-pagar`;
    if (this.authService.isAdmin()) {
      return lastValueFrom(this.http.get(reqUrl));
    } else {
      throw new Error('No tienes permisos para acceder a las comisiones por pagar');
    }
  }

  procesarComision(comisionId: string) {
    const reqUrl = `${this.apiUrl}pagos/admin/procesar-comision/${comisionId}`;
    if (this.authService.isAdmin()) {
      return lastValueFrom(this.http.put(reqUrl, {}));
    } else {
      throw new Error('No tienes permisos para procesar comisiones');
    }
  }

  completarComision(comisionId: string) {
    const reqUrl = `${this.apiUrl}pagos/admin/completar-comision/${comisionId}`;
    if (this.authService.isAdmin()) {
      return lastValueFrom(this.http.put(reqUrl, {}));
    } else {
      throw new Error('No tienes permisos para completar comisiones');
    }
  }
}
