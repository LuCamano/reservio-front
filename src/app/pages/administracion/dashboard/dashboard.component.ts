import { Component, inject, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ApiService } from '../../../services/api.service';
import { Usuario, Local } from '../../../models/models.interface';

interface ChartDefinition {
  title: string;
  description?: string;
  type: ChartType;
  data: (string | number)[][];
  columns: string[];
  options: object; 
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private api = inject(ApiService);
  chartType = ChartType.PieChart;
  barChart!: ChartDefinition;
  pieChart2D!: ChartDefinition;
  pieChart2D_2!: ChartDefinition;

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

  ngOnInit(){
    this.cargarDatosDashboard();
  }

  async cargarDatosDashboard() {
    // Usuarios
    const usuarios = await this.api.getUsuarios();
    this.usuariosRegistrados = usuarios.length;
    this.usuariosBloqueados = usuarios.filter(u =>
      u.bloqueos && u.bloqueos.some(b => {
        const inicio = new Date(b.fecha_bloqueo);
        const fin = b.fecha_desbloqueo ? new Date(b.fecha_desbloqueo) : null;
        const now = new Date();
        return inicio <= now && (!fin || now < fin);
      })
    ).length;
    const usuariosClinete = usuarios.filter(u => u.tipo === 'cliente');
    const usuariosPropietarios = usuarios.filter(u => u.tipo === 'propietario');

    // Locales
    const locales = await this.api.getLocales();
    const loValidos = locales.filter(l => l.validada === true).length;
    const loNoValidos = locales.filter(l => l.validada === false).length;

    this.localesTotales = locales.length;
    this.localesVerificados = loValidos;

    // Gráfico
    this.pieChart2D = {
      title: 'Locales Por Validado',
      description: 'Muestra la diferencia de los locales por validacion',
      type: ChartType.PieChart,
      data: [
        ['Validados', loValidos],
        ['No Validados', loNoValidos],
      ],
      columns: ['Estado', 'Cantidad'],
      options: { legend: { position: 'bottom' } },
    };
    // Gráfico
    this.pieChart2D_2 = {
      title: 'Usuarios por Tipo',
      description: 'Muestra la diferencia de los Usuarios por tipos',
      type: ChartType.PieChart,
      data: [
        ['Clientes', usuariosClinete.length],
        ['Propietarios', usuariosPropietarios.length],
      ],
      columns: ['Estado', 'Cantidad'],
      options: {
        legend: { position: 'bottom' },
        colors: ['#3B82F6', '#F59E0B'] // azul para clientes, naranja para propietarios
      }
    };

  }


}
