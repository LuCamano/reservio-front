import { Component, inject, OnInit } from '@angular/core';

import { AdminService } from '../../../services/admin.service';
import { Datum, Pago } from '../../../models/payment.responses';

@Component({
  selector: 'app-comisiones',
  standalone: false,
  templateUrl: './comisiones.component.html',
  styleUrl: './comisiones.component.scss'
})
export class ComisionesComponent implements OnInit {
  private api = inject(AdminService)
  comisiones: Datum[] = [];
  cargando = false;
  error = '';
  pagosPendientes: Datum[] = [];
  totalPendiente = 0;


  ngOnInit() {
    this.cargarComisiones();
  }

  async cargarComisiones() {
    this.cargando = true;
    this.error = '';
    try {
      const response = await this.api.getComisionesPorPagar();
      this.comisiones = response as Datum[]; 
    } catch (err) {
      this.error = 'Error al cargar las comisiones.';
      console.error(err);
    } finally {
      this.cargando = false;
    }
  }

  async procesar(comisionId: string) {
    try {
      await this.api.procesarComision(comisionId);
      this.cargarComisiones();
    } catch (err) {
      console.error('Error al procesar comisión:', err);
    }
  }


  async completar(comisionId: string) {
    try {
      await this.api.completarComision(comisionId);
      this.cargarComisiones();
    } catch (err) {
      console.error('Error al completar comisión:', err);
    }
  }

}
