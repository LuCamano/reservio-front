import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comuna, Local, Region } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-propiedad',
  standalone: false,
  templateUrl: './add-propiedad.component.html',
  styleUrl: './add-propiedad.component.scss'
})
export class AddPropiedadComponent implements OnInit {

  private svLocal = inject(ConnectionService);
  private apiSv = inject(ApiService); // Asumiendo que ConnectionService tiene métodos para manejar las regiones y comunas
  regiones: Region[] = [];
  comunas: Comuna[] = [];

  comunasFiltradas: Comuna[] = [];

  localForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    comuna: new FormControl('', [Validators.required]),
    capacidad: new FormControl(null, [Validators.required, Validators.min(1)]),
    precioH: new FormControl(null, [Validators.required, Validators.min(0)]),
    direccion: new FormControl(''), // opcional
    disponible: new FormControl(true),
    imagenUrl: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]) 
  });

  constructor(private router: Router, private connectionService: ConnectionService) { }

  ngOnInit(): void {
    this.cargarDatos();
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

  crearPropiedad(): void {
    if (this.localForm.invalid) {
      this.localForm.markAllAsTouched();
      return;
    }

    const formValue = this.localForm.value;

    const nuevaPropiedad: Local = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      direccion: formValue.direccion,
      tipo: 'local', // o el tipo que corresponda según tu lógica
      cod_postal: '', // puedes agregar un campo en el formulario si lo necesitas
      capacidad: formValue.capacidad,
      precio_hora: formValue.precioH,
      comuna_id: formValue.comuna,
      validada: true,
      activo: true,
      imagenes: [formValue.imagenUrl]
    };

    this.apiSv.createLocal(nuevaPropiedad)
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

}
