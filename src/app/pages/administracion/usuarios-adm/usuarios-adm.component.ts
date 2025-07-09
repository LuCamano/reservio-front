import { Component, inject } from '@angular/core';
import { Usuario } from '../../../models/models.interface';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-usuarios-adm',
  standalone: false,
  templateUrl: './usuarios-adm.component.html',
  styleUrl: './usuarios-adm.component.scss'
})
export class UsuariosAdmComponent {
  apiService = inject(ApiService);
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchTerm: string = '';
  selectedTipo: string = '';
  selectedEstado: string = '';
  tiposUsuario: string[] = ['admin', 'propietario', 'cliente'];
  estados: string[] = ['Activo', 'Inactivo'];
  sortField: keyof Usuario | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.usuarios = await this.apiService.getUsuarios(0, 100);
    this.filteredUsuarios = [...this.usuarios];
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

  filterUsuarios(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch = term === '' || 
        usuario.email.toLowerCase().includes(term) ||
        usuario.rut.toLowerCase().includes(term) ||
        usuario.nombres.toLowerCase().includes(term) ||
        usuario.appaterno.toLowerCase().includes(term) ||
        (usuario.apmaterno && usuario.apmaterno.toLowerCase().includes(term));
      const matchesTipo = !this.selectedTipo || usuario.tipo === this.selectedTipo;
      // Estado: si tu modelo tiene un campo 'activo', descomenta y ajusta:
      // const matchesEstado = !this.selectedEstado || (this.selectedEstado === 'Activo' ? usuario.activo : !usuario.activo);
      // return matchesSearch && matchesTipo && matchesEstado;
      return matchesSearch && matchesTipo;
    });
  }
}
