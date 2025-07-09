import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { Comuna, Local, Region, Reserva, Usuario, Valoracion } from '../models/models.interface';
import { PagosService } from './pagos.service';

interface GetRequest {
  endpoint: Endpoint;
  params?: Record<string, string>;
  offset?: number;
  limit?: number;
  order_by?: string;
}

type Endpoint = 'usuarios/' | 'regiones/' | 'comunas/' | 'propiedades/' | 'reservas/' | 'boletas/' | 'valoraciones/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inyecciones
  private http = inject(HttpClient);
  private pagosService = inject(PagosService);

  private readonly api_url = `${environment.apiUrl}/api/v1/`;

  get<T>(request: GetRequest): Promise<T[]> {
    const { endpoint, params, offset, limit, order_by } = request;
    let url = `${this.api_url}${endpoint}`;

    // Añadir parámetros de consulta
    const queryParams: string[] = [];
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      }
    }
    if (offset !== undefined) queryParams.push(`offset=${offset}`);
    if (limit !== undefined) queryParams.push(`limit=${limit}`);
    if (order_by) queryParams.push(`order_by=${order_by}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return lastValueFrom(this.http.get<T[]>(url));
  }

  getOne<T>(endpoint: Endpoint, id: string): Promise<T> {
    const url = `${this.api_url}${endpoint}${id}`;
    return lastValueFrom(this.http.get<T>(url));
  }

  post<T>(endpoint: Endpoint, data: T): Promise<T> {
    const url = `${this.api_url}${endpoint}`;
    return lastValueFrom(this.http.post<T>(url, data));
  }

  put<T>(endpoint: Endpoint, id: string, data: T): Promise<T> {
    const url = `${this.api_url}${endpoint}${id}`;
    return lastValueFrom(this.http.put<T>(url, data));
  }

  delete(endpoint: Endpoint, id: string): Promise<void> {
    const url = `${this.api_url}${endpoint}${id}`;
    return lastValueFrom(this.http.delete<void>(url));
  }

  // Crud de Regiones
  getRegiones(): Promise<Region[]> {
    return this.get<Region>({ endpoint: 'regiones/' });
  }

  getRegion(id: string): Promise<Region> {
    return this.getOne<Region>('regiones/', id);
  }

  createRegion(region: Region): Promise<Region> {
    return this.post<Region>('regiones/', region);
  }

  updateRegion(id: string, nombre: string): Promise<Region> {
    return this.put<Region>('regiones/', id, { nombre });
  }

  deleteRegion(id: string): Promise<void> {
    return this.delete('regiones/', id);
  }

  // Crud de Comunas
  getComunas(): Promise<Comuna[]> {
    return this.get<Comuna>({ endpoint: 'comunas/' });
  }

  getComuna(id: string): Promise<Comuna> {
    return this.getOne<Comuna>('comunas/', id);
  }

  createComuna(comuna: Comuna): Promise<Comuna> {
    return this.post<Comuna>('comunas/', comuna);
  }

  updateComuna(id: string, comuna: Comuna): Promise<Comuna> {
    return this.put<Comuna>('comunas/', id, comuna);
  }

  deleteComuna(id: string): Promise<void> {
    return this.delete('comunas/', id);
  }

  // Crud de Locales
  async getLocales(offset: number = 0, limit: number = 20, order_by?: string, tipo?: string, comuna_id?: string, precioMin?: number, precioMax?: number): Promise<Local[]> {
    // Filtrar parámetros undefined
    const params: Record<string, string> = {};
    if (tipo) params['tipo'] = tipo;
    if (comuna_id) params['comuna_id'] = comuna_id;
    if (precioMin !== undefined) params['precioMin'] = precioMin.toString();
    if (precioMax !== undefined) params['precioMax'] = precioMax.toString();

    let locales = await this.get<Local>({
      endpoint: 'propiedades/',
      offset,
      limit,
      order_by,
      params: Object.keys(params).length > 0 ? params : undefined
    });
    locales = locales.map(local => {
      if (local.imagenes && local.imagenes.length > 0) {
        local.imagenes = local.imagenes.map(imagen => `${environment.apiUrl}/${imagen}`);
      }
      if (local.documento) {
        local.documento = `${environment.apiUrl}/${local.documento}`;
      }
      return local;
    });
    return locales;
  }

  async getLocal(id: string): Promise<Local> {
    const local = await this.getOne<Local>('propiedades/', id);
    if (local.imagenes && local.imagenes.length > 0) {
      local.imagenes = local.imagenes.map(imagen => `${environment.apiUrl}/${imagen}`);
    }
    if (local.documento) {
      local.documento = `${environment.apiUrl}/${local.documento}`;
    }
    return local;
  }

  createLocal(localData: FormData): Promise<Local> {
    const url = `${this.api_url}propiedades/`;
    return lastValueFrom(this.http.post<Local>(url, localData));
  }

  updateLocal(id: string, localData: FormData): Promise<Local> {
    const url = `${this.api_url}propiedades/${id}`;
    return lastValueFrom(this.http.put<Local>(url, localData));
  }

  deleteLocal(id: string): Promise<void> {
    return this.delete('propiedades/', id);
  }

  cambiarEstadoActivoLocal(id: string) {
    const url = `${this.api_url}propiedades/${id}/toggle-active`;
    return lastValueFrom(this.http.post(url, {}));
  }

  // Crud de valoraciones
  // Esto probablemente cambiará
  getValoraciones(offset: number = 0, limit: number = 20, order_by?: string): Promise<Valoracion[]> {
    return this.get<Valoracion>({
      endpoint: 'valoraciones/',
      offset,
      limit,
      order_by
    });
  }
  getValoracion(id: string): Promise<Valoracion> {
    return this.getOne<Valoracion>('valoraciones/', id);
  }
  createValoracion(valoracion: Valoracion): Promise<Valoracion> {
    return this.post<Valoracion>('valoraciones/', valoracion);
  }
  updateValoracion(id: string, valoracion: Valoracion): Promise<Valoracion> {
    return this.put<Valoracion>('valoraciones/', id, valoracion);
  }
  deleteValoracion(id: string): Promise<void> {
    return this.delete('valoraciones/', id);
  }

  // Crud de reservas
  getReservas(offset: number = 0, limit: number = 20, order_by?: string): Promise<Reserva[]> {
    return this.get<Reserva>({
      endpoint: 'reservas/',
      offset,
      limit,
      order_by
    });
  }

  getReserva(id: string): Promise<Reserva> {
    return this.getOne<Reserva>('reservas/', id);
  }

  async createReserva(reserva: Reserva): Promise<Reserva> {
    const reservia = await this.post<Reserva>('reservas/', reserva);
    const prefResponse = await this.pagosService.crearPreferenciaPago(reservia.id!);
    if (prefResponse.success) {
      window.location.href = prefResponse.data.init_point;
    } else {
      console.error('Error al crear la preferencia de pago:', prefResponse.message);
    }
    return reservia;
  }

  updateReserva(id: string, reserva: Reserva): Promise<Reserva> {
    return this.put<Reserva>('reservas/', id, reserva);
  }

  deleteReserva(id: string): Promise<void> {
    return this.delete('reservas/', id);
  }

  // Utilidades de usuario
  getUsuarios(offset: number = 0, limit: number = 20, order_by?: string): Promise<Usuario[]> {
    return this.get<Usuario>({
      endpoint: 'usuarios/',
      offset,
      limit,
      order_by
    });
  }

  getUsuario(id: string): Promise<Usuario> {
    return this.getOne<Usuario>('usuarios/', id);
  }

  updateUsuario(id: string, usuario: Usuario): Promise<Usuario> {
    return this.put<Usuario>('usuarios/', id, usuario);
  }

  cambiarTipoUsuario(id: string, tipo: 'admin' | 'cliente' | 'propietario') {
    return lastValueFrom(this.http.put(`${this.api_url}usuarios/${id}/cambiar_tipo`, {} ,{ params: { nuevo_tipo: tipo } }));
  }
}
