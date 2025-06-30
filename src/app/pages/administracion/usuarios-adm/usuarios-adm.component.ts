import { Component, inject } from '@angular/core';
import { Usuario } from '../../../models/models.interface';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../services/connection.service';

@Component({
  selector: 'app-usuarios-adm',
  standalone: false,
  templateUrl: './usuarios-adm.component.html',
  styleUrl: './usuarios-adm.component.scss'
})
export class UsuariosAdmComponent {
  userService = inject(ConnectionService);
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchTerm: string = '';
  sortField: keyof Usuario | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  tiposUsuario: string[] = ['Administrador', 'Propietario', 'Cliente', 'Superadmin'];
  estados: string[] = ['Activo', 'Inactivo'];
  selectedTipo: string = '';
  selectedEstado: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Datos de ejemplo
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarios = this.userService.getUsuarios();
    this.filteredUsuarios = [...this.usuarios];
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
      if (this.selectedEstado === 'Activo') {
        matchesEstado = usuario.activo;
      } else if (this.selectedEstado === 'Inactivo') {
        matchesEstado = !usuario.activo;
      }
      
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
    usuario.activo = !usuario.activo;
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
