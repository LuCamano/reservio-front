import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../models/models.interface';

@Component({
  selector: 'app-pago',
  standalone: false,
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.scss'
})
export class PagoComponent implements OnInit {
  reserva: Reserva | null = null;
  montoPagar: number = 0;

  ngOnInit(): void {
    const reservaStr = localStorage.getItem('reservaPagoActual');
    if (reservaStr) {
      this.reserva = JSON.parse(reservaStr);
      if (this.reserva && this.reserva.propiedad && this.reserva.cant_horas) {
        this.montoPagar = (this.reserva.propiedad.precioH * this.reserva.cant_horas) * 0.5;
      }
    }
  }
}
