import { Component, inject, OnInit } from '@angular/core';
import { Local } from '../../../models/models.interface';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { OpenStreetMapService } from '../../../services/open-street-map.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ver-propiedad',
  standalone: false,
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss'
})
export class VerPropiedadComponent implements OnInit{
  private apiSv = inject(ApiService);
  private route = inject(ActivatedRoute);
  private MapService = inject(OpenStreetMapService);

  local!: Local;
  region: string = '';

  isLoading = true;
  mapError = false;

  dato_lng: number = 0;
  dato_lat: number = 0;
  nombre_local: string = '';
  direccioncompleta: string = '';

  // Nuevas variables para nombre de comuna y región
  nombreRegion: string = '';
  nombreComuna: string = '';


  mostrarModalEdicion = false;
  propiedadSeleccionada!: Local;
  tiposLocales = ['Casa', 'Sala de eventos', 'Oficina' , 'Local Comercial' , 'Auditorio']; 

  mostrarModalArchivos = false;
  
  documentoSeleccionado = new FormGroup({
  documento: new FormControl<File | null>(null, Validators.required)
});

imagenesSeleccionadas = new FormGroup({
  images: new FormControl<File[] | null>(null, Validators.required)
});

  
  selectedFiles: File[] = [];
  selectedDoc: File | null = null;



  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    await this.cargarDatos(id!)
  }

  async cargarDatos(id: string) {
    try {
      const local = await this.apiSv.getLocal(id);
      if (local) {
        this.local = local;
        // Obtener nombre de comuna y región
        if (local.comuna) {
          this.nombreComuna = local.comuna.nombre;
          // Obtener la región asociada a la comuna
          const regionId = local.comuna.region_id;
          if (regionId) {
            const region = await this.apiSv.getRegion(regionId);
            this.nombreRegion = region.nombre;
          }
        }
        this.buscarCoordenadas();
      } else {
        console.error('No se encontró el local con ID:', id);
      }
    } catch (error) {
      console.error('Error al obtener el local:', error);
    }
  }

  buscarCoordenadas() {
    this.direccioncompleta = `${this.local.direccion}, ${this.nombreComuna}, ${this.nombreRegion}, Chile`;
    this.MapService.getCoordinates(this.direccioncompleta)
      .subscribe({
        next: (coords) => {
          if (coords) {
            this.dato_lat = coords.lat;
            this.dato_lng = coords.lng;
          } else {
            console.error('No coordinates returned from the API');
            this.mapError = true;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener coordenadas', err);
          this.mapError = true;
          this.isLoading = false;
        }
      });
  }

  cambStado(id: string) {
    this.apiSv.cambiarEstadoActivoLocal(id).then(() => {
      window.location.reload(); // solo después de que el backend confirme
    }).catch(error => {
      console.error('Error al cambiar el estado del local:', error);
      // opcional: mostrar un mensaje al usuario
    });
  }

editarPropiedad(local: Local) {
  const propiedad = local;
  if (propiedad) {
    this.propiedadSeleccionada = { ...propiedad }; // copia para edición
    this.mostrarModalEdicion = true;
  }
}

cerrarModal() {
  this.mostrarModalEdicion = false;
  this.propiedadSeleccionada = undefined!;
}

guardarCambios() {
  const formData = this.convertirLocalAFormData(this.propiedadSeleccionada);
  this.apiSv.updateLocal(this.propiedadSeleccionada.id!, formData).then(() => {
    this.cerrarModal();
    window.location.reload();

  }).catch(error => {
    console.error('Error al actualizar la propiedad:', error);
  });
}

  convertirLocalAFormData(local: Local): FormData {
  const formData = new FormData();
  if (local.nombre) formData.append('nombre', local.nombre);
  if (local.descripcion) formData.append('descripcion', local.descripcion);
  if (local.direccion) formData.append('direccion', local.direccion);
  if (local.tipo) formData.append('tipo', local.tipo);
  if (local.precio_hora !== undefined) formData.append('precio_hora', local.precio_hora.toString());
  if (local.cod_postal) formData.append('cod_postal', local.cod_postal);
  if (local.capacidad !== undefined) formData.append('capacidad', local.capacidad.toString());
  if (local.hora_apertura) formData.append('hora_apertura', local.hora_apertura);
  if (local.hora_cierre) formData.append('hora_cierre', local.hora_cierre);
  if (local.comuna_id) formData.append('comuna_id', local.comuna_id);
  formData.append('validada', local.validada ? 'true' : 'false');
  formData.append('activo', local.activo ? 'true' : 'false');
  return formData;
  }

abrirModalArchivos(local: Local) {
  this.propiedadSeleccionada = { ...local }; // copia para evitar mutaciones directas
  this.selectedFiles = [];
  this.selectedDoc = undefined!;

  this.imagenesSeleccionadas.reset(); // limpia el FormGroup de imágenes
  this.documentoSeleccionado.reset(); // limpia el FormGroup del documento

  this.mostrarModalArchivos = true;
}


cerrarModalArchivos() {
  this.mostrarModalArchivos = false;
  this.propiedadSeleccionada = undefined!;
  this.selectedFiles = [];
  this.selectedDoc = undefined!;

  this.imagenesSeleccionadas.reset();
  this.documentoSeleccionado.reset();
}

guardarArchivos() {
  const formData = new FormData();

  // Obtener archivos desde los formularios reactivos
  const imagenes: File[] | null = this.imagenesSeleccionadas.get('images')?.value || [];
  const documento: File | null = this.documentoSeleccionado.get('documento')?.value || null;

  // Validar y agregar imágenes (solo si hay)
  if (imagenes && imagenes.length > 0) {
    imagenes.forEach(img => {
      formData.append('imagenes', img); // usa 'imagenes' como clave esperada por el backend
    });
  }

  // Validar y agregar documento (solo si hay)
  if (documento) {
    formData.append('documento', documento);
  }

  // Verifica que haya al menos un archivo antes de enviar
  if (!formData.has('imagenes') && !formData.has('documento')) {
    alert('Debes seleccionar al menos una imagen PNG o un documento PDF.');
    return;
  }

  // Enviar al backend
  this.apiSv.updateLocal(this.propiedadSeleccionada.id!, formData).then(() => {
    this.cerrarModalArchivos();
  }).catch(error => {
    console.error('Error al actualizar archivos:', error);
  });
}


onDocumentSelected(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (file && file.type !== 'application/pdf') {
    alert('Solo se permite un documento en formato PDF.');
    this.documentoSeleccionado.get('documento')!.setValue(null);
    return;
  }

  this.selectedDoc = file;
  this.documentoSeleccionado.get('documento')!.setValue(file);
  this.documentoSeleccionado.get('documento')!.updateValueAndValidity();
}


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files || files.length === 0) {
    this.imagenesSeleccionadas.get('images')!.setValue(null);
    return;
  }

  const fileArray = Array.from(files);
  const soloPNG = fileArray.every(file => file.type === 'image/png');

  if (!soloPNG) {
    alert('Solo se permiten imágenes en formato PNG.');
    this.imagenesSeleccionadas.get('images')!.setValue(null);
    return;
  }

  this.selectedFiles = fileArray;
  this.imagenesSeleccionadas.get('images')!.setValue(fileArray);
  this.imagenesSeleccionadas.get('images')!.updateValueAndValidity();
}
}
