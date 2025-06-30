import { Component , inject, OnInit } from '@angular/core';
import { Local } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';

@Component({
  selector: 'app-locales-adm',
  standalone: false,
  templateUrl: './locales-adm.component.html',
  styleUrl: './locales-adm.component.scss'
})
export class LocalesAdmComponent implements OnInit {
  localesService = inject(ConnectionService);

  locales: Local[] = []; 
  sortField: keyof Local | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  
  ngOnInit(): void {
    // cargar los locales
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.locales = this.localesService.getLocales();
  }

  sortTable(field: keyof Local): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.locales.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
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
    local.disponible = !local.disponible;
  }

  eliminarLocal(id: string): void {
    if (confirm('¿Estás seguro de eliminar este local?')) {
      this.locales = this.locales.filter(local => local.id !== id);
      this.cargarLocales();
    }
  }
}
