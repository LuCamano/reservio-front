import { Component, inject } from '@angular/core';
import { Usuario } from '../../../models/models.interface';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { rutValidator } from '../../../validators/rut.validator';

@Component({
  selector: 'app-usuarios-adm',
  standalone: false,
  templateUrl: './usuarios-adm.component.html',
  styleUrl: './usuarios-adm.component.scss'
})
export class UsuariosAdmComponent {
  apiService = inject(ApiService);
  private authSvc = inject(AuthService);
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  // Cambiar a [(ngModel)] para que los filtros sean reactivos
  searchTerm: string = '';
  selectedTipo: string = '';
  selectedEstado: string = '';
  sortField: keyof Usuario | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  tiposUsuario: string[] = ['admin', 'propietario', 'cliente'];
  estados: string[] = ['Activo', 'Inactivo'];
  mostrarModalNuevoUsuario: boolean = false;
  nuevoUsuarioForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl('', [Validators.required]),
    rut: new FormControl('', [Validators.required, rutValidator]),
    nombres: new FormControl('', [Validators.required]),
    appaterno: new FormControl('', [Validators.required]),
    apmaterno: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    tipo: new FormControl('cliente', [Validators.required])
  });
  nuevoUsuarioError: string = '';
  loadingNuevoUsuario: boolean = false;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.usuarios = await this.apiService.getUsuarios(0, 100);
    this.filteredUsuarios = [...this.usuarios];
  }

  filterUsuarios(): void {
    if (!this.searchTerm && !this.selectedTipo && !this.selectedEstado) {
      this.filteredUsuarios = [...this.usuarios];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch = term === '' || 
        usuario.email.toLowerCase().includes(term) ||
        usuario.rut.toLowerCase().includes(term) ||
        usuario.nombres.toLowerCase().includes(term) ||
        usuario.appaterno.toLowerCase().includes(term) ||
        (usuario.apmaterno && usuario.apmaterno.toLowerCase().includes(term));
      
      const matchesTipo = !this.selectedTipo || usuario.tipo === this.selectedTipo;
      
      let matchesEstado = true;
      // if (this.selectedEstado === 'Activo') {
      //   matchesEstado = usuario.activo;
      // } else if (this.selectedEstado === 'Inactivo') {
      //   matchesEstado = !usuario.activo;
      // }
      
      return matchesSearch && matchesTipo && matchesEstado;
    });
  }

  sortTable(field: keyof Usuario): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredUsuarios.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA === undefined || valueB === undefined) return 0;
      
      if (valueA instanceof Date && valueB instanceof Date) {
        return this.sortDirection === 'asc' 
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return this.sortDirection === 'asc' 
          ? (valueA === valueB ? 0 : valueA ? -1 : 1)
          : (valueA === valueB ? 0 : valueA ? 1 : -1);
      }
      
      return 0;
    });
  }

  toggleActivo(usuario: Usuario): void {
    // usuario.activo = !usuario.activo;
    // Aquí deberías agregar la lógica para actualizar en tu backend
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      this.filterUsuarios();
      // Aquí deberías agregar la lógica para eliminar en tu backend
    }
  }

  editarUsuario(id: string): void {
    // Navegar a la página de edición de usuario
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  verDetalles(id: string): void {
    // Navegar a la página de detalles de usuario
    this.router.navigate(['/admin/usuarios', id]);
  }

  crearUsuario(): void {
    this.nuevoUsuarioForm.reset({ tipo: 'cliente' });
    this.nuevoUsuarioError = '';
    this.mostrarModalNuevoUsuario = true;
  }

  cerrarModalNuevoUsuario(): void {
    this.mostrarModalNuevoUsuario = false;
    this.nuevoUsuarioForm.reset({ tipo: 'cliente' });
    this.nuevoUsuarioError = '';
  }

  async guardarNuevoUsuario() {
    this.nuevoUsuarioError = '';
    if (this.nuevoUsuarioForm.invalid) {
      this.nuevoUsuarioError = 'Por favor completa todos los campos correctamente.';
      return;
    }
    const form = this.nuevoUsuarioForm.value;
    if (form.password !== form.repeatPassword) {
      this.nuevoUsuarioError = 'Las contraseñas no coinciden.';
      return;
    }
    this.loadingNuevoUsuario = true;
    try {
      const usuario = {
        email: form.email,
        password: form.password,
        rut: form.rut,
        nombres: form.nombres,
        appaterno: form.appaterno,
        apmaterno: form.apmaterno,
        fecha_nacimiento: form.fecha_nacimiento,
        tipo: form.tipo
      };
      await this.authSvc.register(usuario);
      await this.cargarUsuarios();
      this.cerrarModalNuevoUsuario();
    } catch (error: any) {
      this.nuevoUsuarioError = error?.error?.message || 'Error al crear usuario.';
    } finally {
      this.loadingNuevoUsuario = false;
    }
  }
}
