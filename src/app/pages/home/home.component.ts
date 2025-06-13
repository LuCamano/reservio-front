import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';


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

}