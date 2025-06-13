import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Local, Usuario } from '../../../models/models.interface';
import { ConnectionService } from '../../../services/connection.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-local',
  standalone: false,
  templateUrl: './local.component.html',
  styleUrl: './local.component.scss'
})
export class LocalComponent implements OnDestroy {
  local: Local | null = null;

  idLocal!: string;
  svLocal = inject(ConnectionService);

  mostrarModalReserva = false;
  mostrarAlerta = false;
  reservaForm: FormGroup;

  constructor(private fb: FormBuilder, private renderer: Renderer2,private route: ActivatedRoute, private router: Router) {
    this.reservaForm = this.fb.group({
      descripcion: ['', Validators.required],
      personas: [1, [Validators.required, Validators.min(1)]],
      duracion: [1, [Validators.required, Validators.min(1)]],
      tipoDuracion: ['horas', Validators.required]
    });
  }

  cerrarModalReserva() {
    this.mostrarModalReserva = false;
    this.reservaForm.reset({
      descripcion: '',
      personas: 1,
      duracion: 1,
      tipoDuracion: 'horas'
    });
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  // Solo aquí mostramos la alerta de éxito
  enviarReserva() {
    if (this.reservaForm.valid) {
      this.cerrarModalReserva();
      this.mostrarAlerta = true;
      setTimeout(() => this.mostrarAlerta = false, 4000);
    }
  }

  ngOnDestroy() {
    // Asegurarse de que el cuerpo no tenga la clase 'overflow-hidden' al destruir el componente
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  ngOnInit(): void {
    // Aquí puedes inicializar cualquier lógica que necesites al cargar el componente
    this.idLocal = this.route.snapshot.paramMap.get('id')!;
    this.getLocal(this.idLocal);
  }

  async getLocal(id: string) {
    const local = await this.svLocal.getLocalById(id);
    if (local) {
      this.local = local;
    } else {
      this.local = null;  // o muestra un error o valor por defecto
    }
  }

  reservar() {
    if (this.svLocal.haySesionActiva()) {
      this.mostrarModalReserva = true;
      this.renderer.addClass(document.body, 'overflow-hidden'); // Agrega clase para evitar scroll
    } else {
      this.router.navigate(['/login']);
    }
  }
}
