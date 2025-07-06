import { Component,inject,OnInit  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Comuna, Local, Region } from '../../models/models.interface';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-locales',
  standalone: false,
  templateUrl: './locales.component.html',
  styleUrl: './locales.component.scss'
})
export class LocalesComponent implements OnInit {
  
  constructor() {
    this.inicializarDatos();
  }

  private svgLocales = inject(ConnectionService);

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

  ngOnInit(): void {
    
    this.comunasFiltradas = [...this.comunas];
    this.localesFiltrados = [...this.locales];
  }
  
  aplicarFiltros(): void {
    if (this.filtrosForm.valid) {
      this.filtrarLocales();
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
      if (filtros.region && local.comuna?.region_id !== this.getRegionNombre(filtros.region)) { //Hay que arreglar esto
        return false;
      }
      
      // Filtrar por comuna
      if (filtros.comuna && local.comuna?.nombre !== this.getComunaNombre(filtros.comuna)) {
        return false;
      }
      
      return true;
    });
  }
  
  limpiarFiltros(): void {
    this.filtrosForm.reset({
      fecha: this.getToday(),
      region: null,
      comuna: null
    });
    this.comunasFiltradas = [...this.comunas];
    this.localesFiltrados = [...this.locales];
  }
  
  actualizarComunas(): void {
    const region_id = this.filtrosForm.get('region')?.value;
    if (region_id) {
      this.comunasFiltradas = this.comunas.filter(c => c.region_id === region_id);
    } else {
      this.comunasFiltradas = [...this.comunas];
    }
    this.filtrosForm.get('comuna')?.setValue(null);
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
  
  private inicializarDatos(): void {
    // Datos de ejemplo 
    this.regiones = [
      { id: 'rm', nombre: 'Región Metropolitana' },
      { id: 'v', nombre: 'Valparaíso' },
      { id: 'b', nombre: 'Biobío' }
    ];
    
    // Datos de las comunas
    this.comunas = [
      // Región Metropolitana
      { id: 'santiago', nombre: 'Santiago', region_id: 'rm' },
      
      // Valparaíso
      { id: 'valparaiso', nombre: 'Valparaíso', region_id: 'v' },
      

      // Biobío
      { id: 'concepcion', nombre: 'Concepción', region_id: 'b' },
      { id: 'talcahuano', nombre: 'Talcahuano', region_id: 'b' },
      { id:'tome' , nombre: 'Tomé', region_id: 'b' }
    ];
    
    // Datos de los locales
    this.getDatos();
  }

  async getDatos(){
    try {
      this.locales = await this.svgLocales.getLocales();
      console.log(this.locales);
    } catch (error) {
      console.error('Error al obtener los datos de los locales:', error);
    }
  }
  

}
