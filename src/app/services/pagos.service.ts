import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { Pago, preferenciaPagoResponse } from '../models/payment.responses';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  /**
   * Servicio para gestionar los pagos con mercadopago.
   * Este servicio se encarga de realizar las peticiones a la API de pagos.
   */

  // Inyecciones
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/pagos/`;

  async crearPreferenciaPago(reserva_id: string) {
    /**
     * Crea una preferencia de pago para una reserva.
     * @param reserva_id ID de la reserva para la que se crea la preferencia de pago.
     * @returns Una promesa que resuelve con la URL de pago.
     */
    const url = `${this.apiUrl}crear-preferencia/${reserva_id}`;
    const response = await lastValueFrom(this.http.post<preferenciaPagoResponse>(url, {}));
    return response;
  }

  obtenerMisComisiones() {
    /**
     * Obtiene las comisiones pendientes de pago del usuario.
     * @returns Una promesa que resuelve con un array de comisiones.
     */
    const url = `${this.apiUrl}comisiones/mis-pagos`;
    return lastValueFrom(this.http.get<Pago[]>(url));
  }

  obtenerEstadoPago(pago_id: string) {
    const url = `${this.apiUrl}estado/${pago_id}`;
    return lastValueFrom(this.http.get<Pago>(url));
  }
}
