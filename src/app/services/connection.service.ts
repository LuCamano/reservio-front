import { Injectable } from '@angular/core';
import { Local, Usuario } from '../models/models.interface';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  getLocales(): Local[] {
    const locales = localStorage.getItem('locales');
    return locales ? JSON.parse(locales) : [];
  }

  getLocalById(id: string): Local | undefined {
    const locales = this.getLocales();
    return locales.find((local: Local) => local.id === id);
  }

  addLocal(local: Local): void {
    const locales = this.getLocales();
    local.id = this.generateId(locales);
    locales.push(local);
    localStorage.setItem('locales', JSON.stringify(locales));
  }

  updateLocal(updatedLocal: Local): void {
    let locales = this.getLocales();
    locales = locales.map((local: Local) => local.id === updatedLocal.id ? updatedLocal : local);
    localStorage.setItem('locales', JSON.stringify(locales));
  }

  deleteLocal(id: string): void {
    let locales = this.getLocales();
    locales = locales.filter((local: Local) => local.id !== id);
    localStorage.setItem('locales', JSON.stringify(locales));
  }

  // Guarda la sesión del usuario (puedes guardar un objeto con más datos si lo necesitas)
  setSesionUsuario(usuario: any): void {
    localStorage.setItem('sesionUsuario', JSON.stringify(usuario));
  }

  // Obtiene la sesión del usuario (devuelve null si no hay sesión)
  getSesionUsuario(): Usuario | undefined {
    const usuario = localStorage.getItem('sesionUsuario');
    return usuario ? JSON.parse(usuario) : undefined;
  }

  getUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  registrarUsuario(usuario: Usuario): void {
    const usuarios = this.getUsuarios();
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  // Elimina la sesión del usuario (logout)
  limpiarSesionUsuario(): void {
    localStorage.removeItem('sesionUsuario');
  }

  // Verifica si hay sesión activa
  haySesionActiva(): boolean {
    return !!localStorage.getItem('sesionUsuario');
  }

  private generateId(locales: Local[]): string {
    return (locales.length > 0 ? Math.max(...locales.map(l => parseInt(l.id!))) + 1 : 1).toString();
  }
}