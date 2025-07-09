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

  sortField: string = '';
  userService = inject(ConnectionService);
  locales: Local[] = []; 
  filteredLocales: Local[] = []; 
  
  sortDirection: 'asc' | 'desc' = 'asc';
  tiposLocales: string[] = ['Local', 'Sala' , 'Casa'];
  estados: string[] = ['Activo', 'Inactivo'];
  selectedTipo: string = '';
  selectedEstado: string = '';
  searchTerm: string = '';
  
  
  ngOnInit(): void {
    // cargar los locales
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.apisv.getLocales().then(lo =>{
      this.locales = lo
      this.filterLocales();
    })
  }

  sortTable(field: string): void {
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
  }


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

  filterLocales() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredLocales = this.locales.filter(local => {
      const matchesSearch =
        local.nombre?.toLowerCase().includes(term) ||
        local.direccion?.toLowerCase().includes(term);

      const matchesTipo =
        !this.selectedTipo || local.tipo === this.selectedTipo;

      const matchesEstado =
        this.selectedEstado === ''
        || (this.selectedEstado === 'activo' && local.activo === true)
        || (this.selectedEstado === 'inactivo' && local.activo === false);


      return matchesSearch && matchesTipo && matchesEstado;
    });

  }

  verDetalles(id: string){}

  editarLocal(id: string){}
  


}
