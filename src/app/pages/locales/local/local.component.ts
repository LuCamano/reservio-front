import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { Local } from '../../../models/models.interface';

@Component({
  selector: 'app-local',
  standalone: false,
  templateUrl: './local.component.html',
  styleUrl: './local.component.scss'
})
export class LocalComponent implements OnDestroy {
  local = {
    nombre: 'Café Central',
    cod_postal: '12345',
    region: 'Ciudad',
    comuna: 'Comuna',
    capacidad: 100,
    precioH: 10,
    direccion: 'Av. Siempre Viva 123, Springfield',
    telefono: '(123) 456-7890',
    correo:'juan@gmail.com',
    descripcion: 'Un acogedor café ubicado en el corazón de la ciudad, ideal para disfrutar de un ambiente tranquilo y cálido. Ofrecemos una cuidada selección de cafés de especialidad, tés artesanales y una deliciosa variedad de postres caseros, preparados diariamente con ingredientes frescos. Nuestro espacio cuenta con cómodas mesas, conexión Wi-Fi gratuita y una pequeña biblioteca para quienes deseen relajarse leyendo o trabajar en un entorno inspirador. Además, organizamos eventos culturales como lecturas, música en vivo y talleres los fines de semana. Perfecto para reuniones informales, citas o simplemente para disfrutar de un buen momento con una taza caliente entre manos.',
    imagenUrl: 'https://cdn0.matrimonios.cl/vendor/7446/3_2/960/jpg/foto-3_8_107446.jpeg',
    imagenMap: 'https://lh3.googleusercontent.com/YOXD2PhKTGyasUdmsGwH-9md1HjSBuQ_6s-6e46IfXGIrearmeqgfWDfleEq-JN9ld8TCISJaffrusemhMw7U8sB-EP0xxqkn8lp=rw-e365-w1375'
  };

  mostrarModalReserva = false;
  mostrarAlerta = false;
  reservaForm: FormGroup;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
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
    // Mostrar alerta al cerrar el modal
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000); // Oculta la alerta después de 4 segundos
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  enviarReserva() {
    if (this.reservaForm.valid) {
      // Manejar la reserva aquí
      this.cerrarModalReserva();
    }
  }

  ngOnDestroy() {
    // Asegurarse de que el cuerpo no tenga la clase 'overflow-hidden' al destruir el componente
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}
