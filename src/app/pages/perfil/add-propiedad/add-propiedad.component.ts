import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Local } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-propiedad',
  standalone: false,
  templateUrl: './add-propiedad.component.html',
  styleUrl: './add-propiedad.component.scss'
})
export class AddPropiedadComponent {

  svLocal = inject(ConnectionService);
  regiones: string[] = ['Región Metropolitana', 'Valparaíso', 'Biobío'];
  comunas: { [key: string]: string[] } = {
    'Región Metropolitana': ['Santiago', 'Providencia', 'Maipú'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar'],
    'Biobío': ['Concepción', 'Talcahuano']
  };
  comunasFiltradas: string[] = [];

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
    // Filtrar comunas cuando cambia la región
    this.localForm.get('region')?.valueChanges.subscribe(region => {
      this.comunasFiltradas = this.comunas[region] || [];
      this.localForm.get('comuna')?.setValue('');
    });
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
