import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-propiedades',
  standalone: false,
  templateUrl: './propiedades.component.html',
  styleUrl: './propiedades.component.scss',
})
export class PropiedadesComponent {

  displayedColumns: string[] = ['select', 'name', 'details', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>([
    { select: false, name: 'Propiedad 1', subContent: 'Sub Content 1', detailsLinkText: 'View Details', status: 'Completado' },
    { select: false, name: 'Propiedad 2', subContent: 'Sub Content 2', detailsLinkText: 'View Details', status: 'Solicitud Pendiente' },
    { select: false, name: 'Propiedad 3', subContent: 'Sub Content 3', detailsLinkText: 'View Details', status: 'Rechazado' },
    { select: false, name: 'Propiedad 4', subContent: 'Sub Content 4', detailsLinkText: 'View Details', status: 'Completado' },
    { select: false, name: 'Propiedad 5', subContent: 'Sub Content 5', detailsLinkText: 'View Details', status: 'Solicitud Pendiente' },
    { select: false, name: 'Propiedad 6', subContent: 'Sub Content 6', detailsLinkText: 'View Details', status: 'Rechazado' },
    { select: false, name: 'Propiedad 7', subContent: 'Sub Content 7', detailsLinkText: 'View Details', status: 'Completado' },
    { select: false, name: 'Propiedad 8', subContent: 'Sub Content 8', detailsLinkText: 'View Details', status: 'Solicitud Pendiente' },
    { select: false, name: 'Propiedad 9', subContent: 'Sub Content 9', detailsLinkText: 'View Details', status: 'Rechazado' },
    { select: false, name: 'Propiedad 10', subContent: 'Sub Content 10', detailsLinkText: 'View Details', status: 'Completado' },
    // Add more placeholder data as needed
  ]);

}

