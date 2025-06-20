import { Component } from '@angular/core';
import { Local } from '../../../models/models.interface';
import { ActivatedRoute } from '@angular/router';
import { ConnectionService } from '../../../services/connection.service';

@Component({
  selector: 'app-ver-propiedad',
  standalone: false,
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss'
})
export class VerPropiedadComponent {
   local: Local | undefined;

  constructor(
    private route: ActivatedRoute,
    private localService: ConnectionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerLocal(id);
    }
  }

  obtenerLocal(id: string): void {
    this.local = this.localService.getLocalById(id);
  }
}
