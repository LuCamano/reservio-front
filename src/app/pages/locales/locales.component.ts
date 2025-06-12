import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


interface Region {
  id: string;
  nombre: string;
}

interface Comuna {
  id: string;
  nombre: string;
  regionId: string;
}

interface Local {
  id: number;
  nombre: string;
  region: string;
  comuna: string;
  capacidad: number;
  precioH: number;
  disponible: boolean;
  imagenUrl: string;
}

@Component({
  selector: 'app-locales',
  standalone: false,
  templateUrl: './locales.component.html',
  styleUrl: './locales.component.scss'
})
export class LocalesComponent implements OnInit {
  
  constructor(private fb: FormBuilder) {
    this.inicializarDatos();
  }

  filtrosForm!: FormGroup;
  locales: Local[] = [];
  localesFiltrados: any[] = [];
  regiones: Region[] = [];
  comunas: Comuna[] = [];
  comunasFiltradas: Comuna[] = [];

  ngOnInit(): void {
    this.filtrosForm = this.fb.group({
      precioMax: [null],
      capacidadMin: [null],
      fecha: [this.getToday()],
      region: [null],
      comuna: [null]
    });
    
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
      if (filtros.precioMax && local.precioH > filtros.precioMax) {
        return false;
      }
      
      // Filtrar por capacidad
      if (filtros.capacidadMin && local.capacidad < filtros.capacidadMin) {
        return false;
      }
      
      // Filtrar por región
      if (filtros.region && local.region !== this.getRegionNombre(filtros.region)) {
        return false;
      }
      
      // Filtrar por comuna
      if (filtros.comuna && local.comuna !== this.getComunaNombre(filtros.comuna)) {
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
    const regionId = this.filtrosForm.get('region')?.value;
    if (regionId) {
      this.comunasFiltradas = this.comunas.filter(c => c.regionId === regionId);
    } else {
      this.comunasFiltradas = [...this.comunas];
    }
    this.filtrosForm.get('comuna')?.setValue(null);
  }
  
  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  
  private getRegionNombre(regionId: string): string {
    const region = this.regiones.find(r => r.id === regionId);
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
      { id: 'santiago', nombre: 'Santiago', regionId: 'rm' },
      
      // Valparaíso
      { id: 'valparaiso', nombre: 'Valparaíso', regionId: 'v' },
      

      // Biobío
      { id: 'concepcion', nombre: 'Concepción', regionId: 'b' },
      { id: 'talcahuano', nombre: 'Talcahuano', regionId: 'b' },
      { id:'tome' , nombre: 'Tomé', regionId: 'b' }
    ];
    
    // Datos de los locales
    this.locales = [
      { id: 1, nombre: 'Salón Central', region: 'Región Metropolitana', comuna: 'Santiago', capacidad: 100, precioH: 15, disponible: true ,imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg' },
      { id: 2, nombre: 'Salón Costero', region: 'Valparaíso', comuna: 'Valparaíso', capacidad: 90, precioH: 22, disponible: true, imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg' },
      { id: 3, nombre: 'Concepción', region: 'Biobío', comuna: 'Concepción', capacidad: 150, precioH: 17, disponible: true , imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg' },
      { id: 4, nombre: 'Tomé', region: 'Biobío', comuna: 'Tomé', capacidad: 110, precioH: 16, disponible: true, imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg' },
      { id: 5, nombre: 'Salon de los valientes', region: '¿?', comuna: '¿?', capacidad: 9999, precioH: 0, disponible: true, imagenUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Backrooms_model.jpg/1200px-Backrooms_model.jpg' },
    ];
  }
}
