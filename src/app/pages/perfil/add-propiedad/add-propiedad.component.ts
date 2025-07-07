import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comuna, Local, Region, Usuario } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

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
    imagenUrl: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    documento: new FormControl<File | null>(null),
    imagenes: new FormControl<FileList | null>(null, [Validators.required])
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
    });
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

  crearPropiedad() {
    
    const formValue = this.localForm.value;

    const formData = new FormData();
    formData.append('nombre', formValue.nombre);
    formData.append('descripcion', formValue.descripcion);
    formData.append('direccion', formValue.direccion);
    formData.append('tipo', 'local');
    formData.append('cod_postal', formValue.cod_postal || '4000');
    formData.append('capacidad', formValue.capacidad);
    formData.append('precio_hora', formValue.precioH);
    formData.append('hora_apertura', formValue.hora_apertura);
    formData.append('hora_cierre', formValue.hora_cierre);
    formData.append('comuna_id', formValue.comuna);
    formData.append('usuario_id', this.usuario!.id || '');

    const imagenes: FileList = formValue.imagenes;
    if (imagenes && imagenes.length > 0) {
      for (let i = 0; i < imagenes.length; i++) {
        formData.append('imagenes', imagenes[i]);
      }
    }

    // Si tienes documento:
    if (formValue.documento) {
      formData.append('documento', formValue.documento);
    }

    // Otros campos si los necesitas
    formData.append('validada', 'false');
    formData.append('activo', 'true');

    console.log('Nueva propiedad a crear:', formData.values());
    // Asegurarse de que sea del tipo correcto>;
    console.log('Datos de la propiedad:', this.localForm.value);

    this.apiSv.createLocal(formData)
      .then(() => {
        alert('Propiedad creada exitosamente');
        this.localForm.reset();
        this.router.navigate(['/perfil']); // Redirige al perfil o donde prefieras
      })
      .catch(error => {
        console.error('Error al crear la propiedad:', error);
        alert('Hubo un error al crear la propiedad');
      });
  }

  onCancel() {
    this.localForm.reset();
  }

  onImagesChange(imagenes: string[]) {
    this.imagenesSeleccionadas = imagenes;
  }
}
