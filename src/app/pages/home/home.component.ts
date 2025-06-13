import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ConnectionService } from '../../services/connection.service';
import { Local } from '../../models/models.interface';


export interface Ciudad {
  name: string;
  Locales: string;
}
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  heroImages = [
    'assets/homeassets/hero/conciertopequeno.jpg',
    'assets/homeassets/hero/juntaempresa.jpg',
    'assets/homeassets/hero/celebracion.jpg',
  ];

  locales: Local[] = [];

  extendedImages: string[] = [];
  currentImage = 0;
  private intervalId?: ReturnType<typeof setInterval>;
  animating = true;

  ngOnInit() {
    // Duplicamos la primera imagen al final
    this.extendedImages = [...this.heroImages, this.heroImages[0]];
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
    this.getDatos();
  }

  nextSlide() {
    this.currentImage++;
    this.animating = true;
    // Si llegamos al duplicado, esperamos la animación y saltamos sin animación
    if (this.currentImage === this.heroImages.length) {
      setTimeout(() => {
        this.animating = false;
        this.currentImage = 0;
      }, 700); // Debe coincidir con duration-700 de Tailwind
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  svgLocales = inject(ConnectionService);

  async getDatos(){
    try {
      this.locales = await this.svgLocales.getLocales();
      console.log(this.locales);
    } catch (error) {
      console.error('Error al obtener los datos de los locales:', error);
    }
  }

}