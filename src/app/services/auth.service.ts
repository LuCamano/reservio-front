import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable } from 'rxjs';
import { Usuario } from '../models/models.interface';
import { environment } from '../../environments/environment';

// Responses
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyecciones
  private http = inject(HttpClient);
  private readonly api_url = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  login(username: string, password: string){
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this.http.post<TokenResponse>(`${this.api_url}/auth/login`, formData)
      .pipe(
        map(response => {
          this.setTokens(response.access_token, response.refresh_token);
          this.getCurrentUser().subscribe();
          return response;
        }),
        catchError(error => {
          console.error('Error during login:', error);
          throw error; // Re-throw the error to be handled by the component
        })
      )
  }

  register(user: Usuario): Promise<Usuario> {
    return lastValueFrom(this.http.post<Usuario>(`${this.api_url}/auth/register`, user));
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw Error('No refresh token available');
    }

    const refreshRequest: RefreshRequest = { refresh_token: refreshToken };
    
    return this.http.post<TokenResponse>(`${this.api_url}/auth/refresh`, refreshRequest)
      .pipe(
        map(response => {
          this.setTokens(response.access_token, response.refresh_token);
          return response;
        }),
        catchError(error => {
          this.logout();
          throw error; // Re-throw the error to be handled by the component
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<Usuario | null> {
    return this.http.get<Usuario>(`${this.api_url}/auth/me`)
      .pipe(
        map(user => {
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a millisegundos
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (token && this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return token != null && !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.tipo === 'admin' : false;
  }
}
