import { Component, inject } from '@angular/core';
import { Local } from '../../../models/models.interface';
import { ActivatedRoute } from '@angular/router';
import { ConnectionService } from '../../../services/connection.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-ver-propiedad',
  standalone: false,
  templateUrl: './ver-propiedad.component.html',
  styleUrl: './ver-propiedad.component.scss'
})
export class VerPropiedadComponent {
  private apiSv = inject(ApiService)
  local!: Local;
  region: string = '';

  constructor(
    private route: ActivatedRoute,
    
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiSv.getLocal(id).then(l => this.local = l)
    }
  }

   buscarRe(id : string){
    this.apiSv.getRegion(id).then(r => this.region = r.nombre);
    return this.region
  }  
}
