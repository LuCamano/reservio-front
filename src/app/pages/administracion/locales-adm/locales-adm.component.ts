import { Component , inject, OnInit } from '@angular/core';
import { Local, Usuario } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locales-adm',
  standalone: false,
  templateUrl: './locales-adm.component.html',
  styleUrl: './locales-adm.component.scss'
})
export class LocalesAdmComponent implements OnInit {
  private apisv = inject(ApiService); 
  private router = inject(Router)

  sortField: keyof Usuario | null = null;

  userService = inject(ConnectionService);
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchTerm: string = '';
  
  sortDirection: 'asc' | 'desc' = 'asc';
  tiposUsuario: string[] = ['Administrador', 'Propietario', 'Cliente', 'Superadmin'];
  estados: string[] = ['Activo', 'Inactivo'];
  selectedTipo: string = '';
  selectedEstado: string = '';

  locales: Local[] = []; 
  
  ngOnInit(): void {
    // cargar los locales
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.apisv.getLocales().then(lo => this.locales = lo)
  }

/*   sortTable(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.locales.sort((a, b) => {
      const valueA = this.getNestedValue(a, field);
      const valueB = this.getNestedValue(b, field);

      if (valueA === undefined || valueB === undefined) return 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return this.sortDirection === 'asc'
          ? (valueA === valueB ? 0 : valueA ? -1 : 1)
          : (valueA === valueB ? 0 : valueA ? 1 : -1);
      }

      return 0;
    });
  } */


  toggleDisponibilidad(local: Local): void {
    local.activo = !local.activo;
  }

  eliminarLocal(id: string): void {
    if (confirm('¿Estás seguro de eliminar este local?')) {
      this.locales = this.locales.filter(local => local.id !== id);
      this.cargarLocales();
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }


  filterUsuarios(): void {
    if (!this.searchTerm && !this.selectedTipo && !this.selectedEstado) {
      this.filteredUsuarios = [...this.usuarios];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch = term === '' || 
        usuario.email.toLowerCase().includes(term) ||
        usuario.rut.toLowerCase().includes(term) ||
        usuario.nombres.toLowerCase().includes(term) ||
        usuario.appaterno.toLowerCase().includes(term) ||
        (usuario.apmaterno && usuario.apmaterno.toLowerCase().includes(term));
      
      const matchesTipo = !this.selectedTipo || usuario.tipo === this.selectedTipo;
      
      let matchesEstado = true;
      // if (this.selectedEstado === 'Activo') {
      //   matchesEstado = usuario.activo;
      // } else if (this.selectedEstado === 'Inactivo') {
      //   matchesEstado = !usuario.activo;
      // }
      
      return matchesSearch && matchesTipo && matchesEstado;
    });
  }

  sortTable(field: keyof Usuario): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredUsuarios.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA === undefined || valueB === undefined) return 0;
      
      if (valueA instanceof Date && valueB instanceof Date) {
        return this.sortDirection === 'asc' 
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return this.sortDirection === 'asc' 
          ? (valueA === valueB ? 0 : valueA ? -1 : 1)
          : (valueA === valueB ? 0 : valueA ? 1 : -1);
      }
      
      return 0;
    });
  }


  toggleActivo(usuario: Usuario): void {
    // usuario.activo = !usuario.activo;
    // Aquí deberías agregar la lógica para actualizar en tu backend
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      this.filterUsuarios();
      // Aquí deberías agregar la lógica para eliminar en tu backend
    }
  }

  editarUsuario(id: string): void {
    // Navegar a la página de edición de usuario
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  verDetalles(id: string): void {
    // Navegar a la página de detalles de usuario
    this.router.navigate(['/admin/usuarios', id]);
  }

  crearUsuario(): void {
    
  }

}
