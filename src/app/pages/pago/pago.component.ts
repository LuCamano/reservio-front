import { Component, inject, OnInit } from '@angular/core';
import { Local, Reserva, Usuario } from '../../models/models.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Location } from '@angular/common';
import { PagosService } from '../../services/pagos.service';

@Component({
  selector: 'app-pago',
  standalone: false,
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  // Inyecciones
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private pagoService = inject(PagosService);
  private location = inject(Location);

  reserva: Reserva | null = null;
  local: Local | null = null;
  cliente: Usuario | null = null;
  montoPagar: number = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getPago(id);
    } else {
      console.error('ID de reserva no proporcionado en la ruta');
      this.location.back();
    }
  }

  async pagar() {
    if (this.reserva) {
      try {
        const prefResponse = await this.pagoService.crearPreferenciaPago(this.reserva.id!);
        if (prefResponse.success) {
          window.location.href = prefResponse.data.sandbox_init_point;
        } else {
          console.error('Error al crear la preferencia de pago:', prefResponse.message);
        }
      } catch (error) {
        console.error('Error al procesar el pago:', error);
      }
    }
  }

  async cancelarPago() {
    if (this.reserva) {
      try {
        await this.apiService.deleteReserva(this.reserva.id!);
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
      } finally {
        this.location.back();
      }
    } else {
      console.error('No hay reserva para cancelar');
      this.location.back();
    }
  }

  async getPago(id: string) {
    try {
      const reserva = await this.apiService.getReserva(id);
      const propiedad = await this.apiService.getLocal(reserva.propiedad_id!);
      const cliente = await this.apiService.getUsuario(reserva.cliente_id!);
      if (reserva && propiedad && cliente) {
        this.reserva = reserva;
        this.local = propiedad;
        this.cliente = cliente;
        this.montoPagar = reserva.costo_total! * 0.5;
      } else {
        console.error('No se pudo obtener la reserva con ID:', id);
        this.location.back();
      }
    } catch (error) {
      console.error('Error al obtener la reserva:', error);
      this.location.back();
    }
  }
}
