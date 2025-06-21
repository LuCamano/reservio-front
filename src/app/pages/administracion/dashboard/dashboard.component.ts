import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';

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
}
