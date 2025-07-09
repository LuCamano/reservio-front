import { Component , inject, OnInit } from '@angular/core';
import { Local } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-locales-adm',
  standalone: false,
  templateUrl: './locales-adm.component.html',
  styleUrl: './locales-adm.component.scss'
})
export class LocalesAdmComponent implements OnInit {
  private apisv = inject(ApiService); 
  private adminsv = inject(AdminService);

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
  
  localSeleccionado?: Local;
  mostrarModalEdicion = false;

  
  ngOnInit(): void {
    // cargar los locales
    this.cargarLocales();
  }

  async cargarLocales() {
    this.locales = await this.apisv.getLocales();
    this.filteredLocales = [...this.locales]

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

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  filterLocales(): void {
    if (!this.searchTerm && !this.selectedTipo && !this.selectedEstado) {
      this.filteredLocales = [...this.locales];
      return;
    }

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

  verDetalles(id: string){

  }

  eliminarLocal(id: string): void {
    if (confirm('¿Estás seguro de eliminar este local?')) {
      
    }
  }

editarLocal(id: string) {
  const local = this.locales.find(l => l.id === id);
  if (local) {
    this.localSeleccionado = { ...local }; // copia para edición
    this.mostrarModalEdicion = true;
  }
}

cerrarModal() {
  this.mostrarModalEdicion = false;
}

guardarCambios() {
  this.adminsv.validarPropiedad(this.localSeleccionado!.id!).then(() => {
    const index = this.locales.findIndex(l => l.id === this.localSeleccionado!.id);
    if (index !== -1) this.locales[index].validada = true;
    this.filterLocales();
    this.cerrarModal();
  }).catch(error => {
    console.error('Error al validar la propiedad:', error);
  });
}

convertirLocalAFormData(local: Local): FormData {
  const formData = new FormData();

  if (local.nombre) formData.append('nombre', local.nombre);
  if (local.descripcion) formData.append('descripcion', local.descripcion);
  if (local.direccion) formData.append('direccion', local.direccion);
  if (local.tipo) formData.append('tipo', local.tipo);
  if (local.cod_postal) formData.append('cod_postal', local.cod_postal);
  if (local.capacidad !== undefined) formData.append('capacidad', local.capacidad.toString());
  if (local.precio_hora !== undefined) formData.append('precio_hora', local.precio_hora.toString());
  if (local.hora_apertura) formData.append('hora_apertura', local.hora_apertura);
  if (local.hora_cierre) formData.append('hora_cierre', local.hora_cierre);
  if (local.comuna_id) formData.append('comuna_id', local.comuna_id);
  formData.append('validada', local.validada ? 'true' : 'false');
  formData.append('activo', local.activo ? 'true' : 'false');

  // Si tienes imágenes o documentos
  if (local.imagenes && local.imagenes.length) {
    local.imagenes.forEach((img: any, index: number) => {
      formData.append(`imagenes`, img); // asegúrate de que sean tipo File
    });
  }

  if (local.documento) {
    formData.append('documento', local.documento); // asegúrate de que sea tipo File
  }

  return formData;
}

}
