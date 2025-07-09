import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../models/models.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  standalone: false,
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  reserva: Reserva | null = null;
  montoPagar: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const reservaStr = localStorage.getItem('reservaPagoActual');
    if (reservaStr) {
      this.reserva = JSON.parse(reservaStr);
      if (this.reserva && this.reserva.propiedad_id && this.reserva.cant_horas) {
        this.montoPagar = this.reserva.costo_total! * 0.5;
      }
    }
  }

  cancelarPago() {
    this.router.navigate(['/locales']);
  }
}
