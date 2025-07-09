import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Comuna, Local, Region, Usuario } from '../../models/models.interface';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-locales',
  standalone: false,
  templateUrl: './locales.component.html',
  styleUrl: './locales.component.scss'
})
export class LocalesComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  filtrosForm: FormGroup = new FormGroup({
    precioMax: new FormControl(null),
    capacidadMin: new FormControl(null),
    fecha: new FormControl(this.getToday()),
    region: new FormControl(null),
    comuna: new FormControl(null)
  });
  locales: Local[] = [];
  localesFiltrados: Local[] = [];
  regiones: Region[] = [];
  comunas: Comuna[] = [];
  comunasFiltradas: Comuna[] = [];
  vista: 'grilla' | 'lista' = 'grilla';
  ordenarPor: string = 'precioAsc';
  isLoading: boolean = true;
  usuarioActual: Usuario | null = null;
  totalLocales: number = 0;
  paginaActual: number = 1;
  itemsPorPagina: number = 9;

  get totalPaginas(): number {
    return Math.ceil(this.localesFiltrados.length / this.itemsPorPagina) || 1;
  }

  get localesPagina(): Local[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.localesFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get rangoPagina(): string {
    if (this.localesFiltrados.length === 0) return '0 de ' + this.totalLocales;
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina + 1;
    const fin = Math.min(this.paginaActual * this.itemsPorPagina, this.localesFiltrados.length);
    return `${inicio} - ${fin} de ${this.totalLocales}`;
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.cargarUsuarioActual();
    await this.cargarDatos();
    this.comunasFiltradas = [...this.comunas];
    this.filtrosForm.get('comuna')?.disable();
    this.localesFiltrados = [...this.locales];
    this.isLoading = false;
  }

  async cargarUsuarioActual() {
    try {
      this.usuarioActual = await lastValueFrom(this.authService.getCurrentUser());
    } catch (e) {
      this.usuarioActual = null;
    }
  }

  async cargarDatos() {
    try {
      this.regiones = await this.apiService.getRegiones();
      this.comunas = await this.apiService.getComunas();
      let todosLocales = await this.apiService.getLocales();
      // Filtrar solo locales validados
      todosLocales = todosLocales.filter(local => local.validada);
      this.totalLocales = todosLocales.length;
      // Filtrar locales que NO pertenezcan al usuario actual
      if (this.usuarioActual) {
        todosLocales = todosLocales.filter(local =>
          !local.propietarios?.some(p => p.id === this.usuarioActual!.id)
        );
      }
      this.locales = todosLocales;
      this.localesFiltrados = [...this.locales];
    } catch (error) {
      console.error('Error al obtener datos desde la API:', error);
    }
  }

  aplicarFiltros(): void {
    if (this.filtrosForm.valid) {
      this.filtrarLocales();
      this.paginaActual = 1;
    }
  }

  filtrarLocales(): void {
    const filtros = this.filtrosForm.value;

    this.localesFiltrados = this.locales.filter(local => {
      // Filtrar por precio
      if (filtros.precioMax && local.precio_hora > filtros.precioMax) {
        return false;
      }

      // Filtrar por capacidad
      if (filtros.capacidadMin && local.capacidad! < filtros.capacidadMin) {
        return false;
      }

      // Filtrar por región
      if (filtros.region && local.comuna?.region_id !== filtros.region) {
        return false;
      }

      // Filtrar por comuna
      if (filtros.comuna && local.comuna_id !== filtros.comuna) {
        return false;
      }

      return true;
    });
    this.paginaActual = 1;
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset({
      fecha: this.getToday(),
      region: null,
      comuna: null
    });
    this.comunasFiltradas = [...this.comunas];
    this.filtrosForm.get('comuna')?.disable();
    this.localesFiltrados = [...this.locales];
    this.paginaActual = 1;
  }

  actualizarComunas(): void {
    const region_id = this.filtrosForm.get('region')?.value;
    if (region_id) {
      this.comunasFiltradas = this.comunas.filter(c => c.region_id === region_id);
      this.filtrosForm.get('comuna')?.enable();
    } else {
      this.comunasFiltradas = [];
      this.filtrosForm.get('comuna')?.setValue(null);
      this.filtrosForm.get('comuna')?.disable();
    }
  }

  ordenarLocales() {
    switch (this.ordenarPor) {
      case 'precioAsc':
        this.localesFiltrados.sort((a, b) => a.precio_hora - b.precio_hora);
        break;
      case 'precioDesc':
        this.localesFiltrados.sort((a, b) => b.precio_hora - a.precio_hora);
        break;
    }
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getRegionNombre(region_id: string): string {
    const region = this.regiones.find(r => r.id === region_id);
    return region ? region.nombre : '';
  }

  private getComunaNombre(comunaId: string): string {
    const comuna = this.comunas.find(c => c.id === comunaId);
    return comuna ? comuna.nombre : '';
  }
}
