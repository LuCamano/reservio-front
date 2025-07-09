import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comuna, Local, Region, Usuario } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { fileTypeValidator } from '../../../validators/png_pdf.validator';




@Component({
  selector: 'app-add-propiedad',
  standalone: false,
  templateUrl: './add-propiedad.component.html',
  styleUrl: './add-propiedad.component.scss'
})
export class AddPropiedadComponent implements OnInit {

  private apiSv = inject(ApiService); // Asumiendo que ConnectionService tiene métodos para manejar las regiones y comunas
  private router = inject(Router);
  regiones: Region[] = [];
  comunas: Comuna[] = [];
  private authSvc = inject(AuthService);
  imagenesSeleccionadas: string[] = [];
  comunasFiltradas: Comuna[] = [];
  usuario: Usuario | null = null; 

  // Guardamos los archivos y sus vistas previas
  selectedFiles: File[] = [];
  selectedDoc: File | null = null;
  previews: string[] = [];
  isLoading = false;
  uploadProgress = 0;

  localForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    comuna: new FormControl('', [Validators.required]),
    cod_postal: new FormControl('', [Validators.required]), 
    capacidad: new FormControl(null, [Validators.required, Validators.min(1)]),
    precioH: new FormControl(0, [Validators.required, Validators.min(0)]),
    hora_apertura: new FormControl('', [Validators.required]),
    hora_cierre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    disponible: new FormControl(true),
    images: new FormControl<FileList | null>(null, [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    documento: new FormControl<File|null>(null, [Validators.required, fileTypeValidator(['pdf', 'image'])]),

  });


  ngOnInit(): void {
    this.cargarDatos();

    this.authSvc.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
    // Filtrar comunas cuando cambia la región
    this.localForm.get('region')?.valueChanges.subscribe(regionId => {
      const comunasEnRegion = this.comunas.filter(comuna => comuna.region_id === regionId);
      this.comunasFiltradas = comunasEnRegion;
      this.localForm.get('comuna')?.setValue('');
      if (regionId) {
        this.localForm.get('comuna')?.enable();
      } else {
        this.localForm.get('comuna')?.disable();
      }
    });
    // Deshabilitar comuna al inicio
    this.localForm.get('comuna')?.disable();
  }

  cargarDatos(){
    // Cargar datos de regiones y comunas desde el servicio 
    this.apiSv.getRegiones().then(r => {
      this.regiones = r;
      console.log('Regiones cargadas:', this.regiones);
    })
    .catch((error) => {
      console.error('Error al cargar las regiones:', error);
    });
    this.apiSv.getComunas().then(c => {
      this.comunas = c;
      console.log('Comunas cargadas:', this.comunas);
    })
  }

  onCancel() {
    this.localForm.reset();
  }

  onImagesChange(imagenes: string[]) {
    this.imagenesSeleccionadas = imagenes;
  }

  onFileSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    this.selectedFiles = Array.from(files);
    this.localForm.patchValue({ images: files });
    this.localForm.get('images')!.updateValueAndValidity();
  }

  onDocumentSelected(event: Event) {
  // 1) Garantiza que currentTarget es tu <input>
  const input = event.currentTarget as HTMLInputElement;
  console.log('input es HTMLInputElement?', input instanceof HTMLInputElement);
  console.log('input.files raw:', input.files);

  const file = input.files?.[0] ?? null;

  // 2) Actualiza la referencia en tu componente
  this.selectedDoc = file;
  
  // 3) Mete el File o null en tu FormControl
  this.localForm.get('documento')!.setValue(file);
  this.localForm.get('documento')!.updateValueAndValidity();

  console.log('FormControl documento:', this.localForm.get('documento')!.value);
}


  async crearPropiedad() {
    this.isLoading = true;
    const fv = this.localForm.value;
    const formData = new FormData();

    // 1. Agregar campos simples
    formData.append('nombre', fv.nombre);
    formData.append('descripcion', fv.descripcion);
    formData.append('direccion', fv.direccion);
    formData.append('tipo', 'local');
    formData.append('cod_postal', fv.cod_postal || '4000');
    formData.append('capacidad', fv.capacidad.toString());
    formData.append('precio_hora', fv.precioH);
    formData.append('hora_apertura', fv.hora_apertura);
    formData.append('hora_cierre', fv.hora_cierre);
    formData.append('comuna_id', fv.comuna);
    formData.append('usuario_id', this.usuario!.id || '');
    
    // Archivos: parámetro se llama “images”
    const files: FileList = fv.images;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }

    // Documento: parámetro se llama “documento”
    console.log(fv.documento);
    if (fv.documento) {
      formData.append('documento', fv.documento);
    }
    try {
      const nueva: Local = await this.apiSv.createLocal(formData);
      alert('Propiedad creada exitosamente');
      this.localForm.reset({
        tipo: 'local',
      });
      console.log(formData);
      this.previews = [];
      this.router.navigate(['/perfil']);
    }
    catch (error) {
      console.error('Error al crear la propiedad:', error);
      alert('Hubo un error al crear la propiedad');
    }
    finally {
      this.isLoading = false;
    }
  }



}
