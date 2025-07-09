import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ApiService } from '../../../services/api.service';
import { Usuario, Local } from '../../../models/models.interface';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  chartType = ChartType.PieChart;

  pieChartColumns = ['Tipo', 'Cantidad'];
  pieChartData = [
    ['Estudiantes', 45],
    ['Docentes', 20],
    ['Administrativos', 10],
    ['Invitados', 5]
  ];

  chartOptions = {
    title: 'Distribución de usuarios',
    pieHole: 0.4,
    chartArea: { width: '90%', height: '80%' },
  };

  usuariosRegistrados: number = 0;
  localesTotales: number = 0;
  localesVerificados: number = 0;
  usuariosBloqueados: number = 0;

  constructor(private api: ApiService) {
    this.cargarDatosDashboard();
  }

  async cargarDatosDashboard() {
    // Usuarios
    const usuarios = await this.api.getUsuarios(0, 1000); // Ajusta el límite según tu base de datos
    this.usuariosRegistrados = usuarios.length;
    this.usuariosBloqueados = usuarios.filter(u => (u.bloqueos && u.bloqueos.some(b => {
      const inicio = new Date(b.fecha_bloqueo);
      const fin = b.fecha_desbloqueo ? new Date(b.fecha_desbloqueo) : null;
      const now = new Date();
      return inicio <= now && (!fin || now < fin);
    }))).length;

    // Locales
    const locales = await this.api.getLocales(0, 1000);
    this.localesTotales = locales.length;
    this.localesVerificados = locales.filter(l => l.validada).length;
  }
}
