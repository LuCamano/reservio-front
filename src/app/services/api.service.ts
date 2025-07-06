import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

interface GetRequest {
  endpoint: Endpoint;
  params?: Record<string, string>;
  offset?: number;
  limit?: number;
  order_by?: string;
}

type Endpoint = 'usuarios' | 'regiones' | 'comunas' | 'propiedades' | 'reservas' | 'boletas' | 'valoraciones';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inyecciones
  private http = inject(HttpClient);

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
    const url = `${this.api_url}${endpoint}/${id}`;
    return lastValueFrom(this.http.get<T>(url));
  }

  post<T>(endpoint: Endpoint, data: T): Promise<T> {
    const url = `${this.api_url}${endpoint}`;
    return lastValueFrom(this.http.post<T>(url, data));
  }

  put<T>(endpoint: Endpoint, id: string, data: T): Promise<T> {
    const url = `${this.api_url}${endpoint}/${id}`;
    return lastValueFrom(this.http.put<T>(url, data));
  }

  delete(endpoint: Endpoint, id: string): Promise<void> {
    const url = `${this.api_url}${endpoint}/${id}`;
    return lastValueFrom(this.http.delete<void>(url));
  }

  
}
