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
    /* this.localForm.get('region')?.valueChanges.subscribe(region => {
      const comunasEnRegion = this.comunas.filter(comuna => comuna.region_id === region.id);
      this.comunasFiltradas = comunasEnRegion.map(comuna => comuna.nombre);
      this.localForm.get('comuna')?.setValue('');
    }); */
  }

  filtrarComunas() {
    const regionId = this.localForm.get('region')?.value;
    this.comunasFiltradas = this.comunas.filter(comuna => comuna.region_id === regionId);
    this.localForm.get('comuna')?.setValue('');
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

  onSubmit(): void {
    if (this.localForm.valid) {
      // Obtener usuario actual
      const usuarioActual = this.connectionService.getSesionUsuario();
      if (!usuarioActual) {
        // Redirigir al usuario a la página de inicio de sesión si no hay sesión activa
        alert('Debe iniciar sesión para agregar una propiedad.');
        this.router.navigate(['/login']);
        return;
      }

      const emailUsuario = usuarioActual.email;
      const nuevoLocal: Local = {
        id: crypto.randomUUID(),
        ...this.localForm.value,
        usuario: emailUsuario // Guardar el email del propietario
      };
      this.svLocal.addLocal(nuevoLocal);
      this.router.navigate(['/perfil']);
    }
  }

  onCancel() {
    this.localForm.reset();
  }

}
