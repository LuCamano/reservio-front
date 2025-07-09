import { Component, inject } from '@angular/core';
import { Usuario } from '../../../models/models.interface';
import { ApiService } from '../../../services/api.service';
import { AdminService } from '../../../services/admin.service';
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
  adminService = inject(AdminService);
  authSvc = inject(AuthService);
  usuarios: (Usuario & { bloqueado?: boolean })[] = [];
  filteredUsuarios: (Usuario & { bloqueado?: boolean })[] = [];
  searchTerm: string = '';
  selectedTipo: string = '';
  selectedEstado: string = '';
  tiposUsuario: string[] = ['admin', 'propietario', 'cliente'];
  estados: string[] = ['Activo', 'Inactivo'];
  sortField: keyof Usuario | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  usuarioSeleccionado: Usuario | null = null;
  mostrarModalVerUsuario: boolean = false;
  mostrarModalEditarUsuario: boolean = false;
  usuarioAEditar: Usuario | null = null;
  tipoUsuarioEdit: string = '';
  mostrarModalBloquearUsuario: boolean = false;
  usuarioABloquear: Usuario | null = null;
  motivoBloqueo: string = '';
  fechaDesbloqueo: string = '';
  errorBloqueo: string = '';
  loadingBloqueo: boolean = false;
  adminId: string | null = null;
  mostrarModalNuevoUsuario: boolean = false;
  errorNuevoUsuario: string = '';
  nuevoUsuarioCargando: boolean = false;

  // Validador personalizado para solo letras (sin números)
  soloLetrasValidator(control: import('@angular/forms').AbstractControl): { soloLetras: boolean } | null {
    const value = control.value || '';
    // Permite letras, espacios y tildes, pero no números ni caracteres especiales
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(value) ? null : { soloLetras: true };
  }

  nuevoUsuarioForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    rut: new FormControl('', [Validators.required, rutValidator]),
    nombres: new FormControl('', [Validators.required, Validators.minLength(2), this.soloLetrasValidator]),
    appaterno: new FormControl('', [Validators.required, Validators.minLength(2), this.soloLetrasValidator]),
    apmaterno: new FormControl('', [Validators.required, Validators.minLength(2), this.soloLetrasValidator]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.validarEdad]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get emailCtrl() { return this.nuevoUsuarioForm.controls.email; }
  get rutCtrl() { return this.nuevoUsuarioForm.controls.rut; }
  get nombresCtrl() { return this.nuevoUsuarioForm.controls.nombres; }
  get appaternoCtrl() { return this.nuevoUsuarioForm.controls.appaterno; }
  get apmaternoCtrl() { return this.nuevoUsuarioForm.controls.apmaterno; }
  get fechaNacimientoCtrl() { return this.nuevoUsuarioForm.controls.fecha_nacimiento; }
  get passwordCtrl() { return this.nuevoUsuarioForm.controls.password; }
  get errorEmailNuevoUsuario(): string | null {
    if (this.emailCtrl.touched || this.emailCtrl.dirty) {
      if (this.emailCtrl.hasError('required')) return 'El email es obligatorio.';
      if (this.emailCtrl.hasError('email')) return 'El email debe ser válido.';
    }
    return null;
  }
  get errorRutNuevoUsuario(): string | null {
    if (this.rutCtrl.touched || this.rutCtrl.dirty) {
      if (this.rutCtrl.hasError('required')) return 'El RUT es obligatorio.';
      if (this.rutCtrl.hasError('invalidRut')) return 'El RUT es inválido.';
    }
    return null;
  }
  get errorNombresNuevoUsuario(): string | null {
    if (this.nombresCtrl.touched || this.nombresCtrl.dirty) {
      if (this.nombresCtrl.hasError('required')) return 'Los nombres son obligatorios.';
      if (this.nombresCtrl.hasError('minlength')) return 'Los nombres deben tener al menos 2 caracteres.';
      if (this.nombresCtrl.hasError('soloLetras')) return 'Solo se permiten letras.';
    }
    return null;
  }
  get errorAppaternoNuevoUsuario(): string | null {
    if (this.appaternoCtrl.touched || this.appaternoCtrl.dirty) {
      if (this.appaternoCtrl.hasError('required')) return 'El apellido paterno es obligatorio.';
      if (this.appaternoCtrl.hasError('minlength')) return 'El apellido paterno debe tener al menos 2 caracteres.';
      if (this.appaternoCtrl.hasError('soloLetras')) return 'Solo se permiten letras.';
    }
    return null;
  }
  get errorApmaternoNuevoUsuario(): string | null {
    if (this.apmaternoCtrl.touched || this.apmaternoCtrl.dirty) {
      if (this.apmaternoCtrl.hasError('required')) return 'El apellido materno es obligatorio.';
      if (this.apmaternoCtrl.hasError('minlength')) return 'El apellido materno debe tener al menos 2 caracteres.';
      if (this.apmaternoCtrl.hasError('soloLetras')) return 'Solo se permiten letras.';
    }
    return null;
  }
  get errorFechaNacimientoNuevoUsuario(): string | null {
    if (this.fechaNacimientoCtrl.touched || this.fechaNacimientoCtrl.dirty) {
      if (this.fechaNacimientoCtrl.hasError('required')) return 'La fecha de nacimiento es obligatoria.';
      if (this.fechaNacimientoCtrl.hasError('invalidDate')) return 'Debe ser mayor de 18 años.';
    }
    return null;
  }
  get errorPasswordNuevoUsuario(): string | null {
    if (this.passwordCtrl.touched || this.passwordCtrl.dirty) {
      if (this.passwordCtrl.hasError('required')) return 'La contraseña es obligatoria.';
      if (this.passwordCtrl.hasError('minlength')) return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return null;
  }

  constructor() {
    this.authSvc.getCurrentUser().subscribe((user: Usuario | null) => {
      this.adminId = user?.id || null;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    const usuarios = await this.apiService.getUsuarios(0, 100);
    const now = new Date();
    this.usuarios = usuarios.map(u => {
      let bloqueado = false;
      if (u.bloqueos && u.bloqueos.length > 0) {
        for (const b of u.bloqueos) {
          const inicio = b.fecha_bloqueo ? new Date(b.fecha_bloqueo) : null;
          const fin = b.fecha_desbloqueo ? new Date(b.fecha_desbloqueo) : null;
          console.log('DEBUG BLOQUEO', {
            email: u.email,
            motivo: b.motivo,
            fecha_bloqueo: b.fecha_bloqueo,
            fecha_bloqueo_date: inicio,
            fecha_desbloqueo: b.fecha_desbloqueo,
            fecha_desbloqueo_date: fin,
            now,
            inicioValido: inicio && !isNaN(inicio.getTime()),
            finValido: !fin || !isNaN(fin.getTime()),
            comp_inicio: inicio ? inicio <= now : 'no inicio',
            comp_fin: fin ? now < fin : 'no fin',
            cumple: (!inicio || isNaN(inicio.getTime())) ? false : (
              (fin && isNaN(fin.getTime())) ? (inicio <= now) : (inicio <= now && (!fin || now < fin))
            )
          });
          if (!inicio || isNaN(inicio.getTime())) continue;
          if (fin && isNaN(fin.getTime())) {
            if (inicio <= now) {
              bloqueado = true;
              break;
            }
          } else {
            if (inicio <= now && (!fin || now < fin)) {
              bloqueado = true;
              break;
            }
          }
        }
      }
      return {
        ...u,
        bloqueado
      };
    });
    this.filteredUsuarios = [...this.usuarios];
    // Log de depuración para ver bloqueos
    console.log('Usuarios recargados:', this.usuarios.map(u => ({ email: u.email, bloqueos: u.bloqueos, bloqueado: u.bloqueado })));
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

  filterUsuarios(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch = term === '' || 
        usuario.email.toLowerCase().includes(term) ||
        usuario.rut.toLowerCase().includes(term) ||
        usuario.nombres.toLowerCase().includes(term) ||
        usuario.appaterno.toLowerCase().includes(term) ||
        (usuario.apmaterno && usuario.apmaterno.toLowerCase().includes(term));
      const matchesTipo = !this.selectedTipo || usuario.tipo === this.selectedTipo;
      // Estado: si tu modelo tiene un campo 'activo', descomenta y ajusta:
      // const matchesEstado = !this.selectedEstado || (this.selectedEstado === 'Activo' ? usuario.activo : !usuario.activo);
      // return matchesSearch && matchesTipo && matchesEstado;
      return matchesSearch && matchesTipo;
    });
  }

  verDetalles(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalVerUsuario = true;
  }

  cerrarModalVerUsuario(): void {
    this.mostrarModalVerUsuario = false;
    this.usuarioSeleccionado = null;
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioAEditar = { ...usuario };
    this.tipoUsuarioEdit = usuario.tipo || '';
    this.mostrarModalEditarUsuario = true;
  }

  cerrarModalEditarUsuario(): void {
    this.mostrarModalEditarUsuario = false;
    this.usuarioAEditar = null;
    this.tipoUsuarioEdit = '';
  }

  async guardarTipoUsuarioEditado() {
    if (!this.usuarioAEditar) return;
    try {
      await this.apiService.cambiarTipoUsuario(this.usuarioAEditar.id!, this.tipoUsuarioEdit as any);
      // Refrescar usuarios para reflejar el cambio real
      await this.cargarUsuarios();
      this.cerrarModalEditarUsuario();
    } catch (error) {
      alert('Error al actualizar el tipo de usuario.');
      console.error(error);
    }
  }

  bloquearUsuario(usuario: Usuario): void {
    this.usuarioABloquear = usuario;
    this.motivoBloqueo = '';
    this.fechaDesbloqueo = '';
    this.errorBloqueo = '';
    this.mostrarModalBloquearUsuario = true;
  }

  cerrarModalBloquearUsuario(): void {
    this.mostrarModalBloquearUsuario = false;
    this.usuarioABloquear = null;
    this.motivoBloqueo = '';
    this.fechaDesbloqueo = '';
    this.errorBloqueo = '';
  }

  async confirmarBloqueoUsuario() {
    if (!this.usuarioABloquear || !this.adminId) return;
    if (!this.motivoBloqueo.trim()) {
      this.errorBloqueo = 'Debes ingresar un motivo.';
      return;
    }
    // Validar que la fecha de desbloqueo (si existe) sea posterior a la fecha actual
    if (this.fechaDesbloqueo) {
      const fechaDesbloqueoDate = new Date(this.fechaDesbloqueo);
      const now = new Date();
      if (fechaDesbloqueoDate <= now) {
        this.errorBloqueo = 'La fecha de fin de bloqueo debe ser posterior a la fecha actual.';
        return;
      }
    }
    this.loadingBloqueo = true;
    try {
      let fechaDesbloqueoDate: Date | undefined = undefined;
      if (this.fechaDesbloqueo) {
        fechaDesbloqueoDate = new Date(this.fechaDesbloqueo);
      }
      await this.adminService.bloquearUsuario(
        this.usuarioABloquear.id!,
        this.adminId,
        this.motivoBloqueo,
        fechaDesbloqueoDate
      );
      await this.cargarUsuarios();
      this.cerrarModalBloquearUsuario();
      console.log('Usuario bloqueado correctamente');
    } catch (error) {
      this.errorBloqueo = 'Error al bloquear usuario.';
      console.error(error);
    } finally {
      this.loadingBloqueo = false;
    }
  }

  async desbloquearUsuario(usuario: Usuario) {
    if (!usuario.id) return;
    try {
      await this.adminService.desbloquearUsuario(usuario.id);
      await this.cargarUsuarios();
      console.log('Usuario desbloqueado correctamente');
    } catch (error) {
      console.error('Error al desbloquear usuario');
    }
  }

  abrirModalNuevoUsuario(): void {
    this.mostrarModalNuevoUsuario = true;
    this.nuevoUsuarioForm.reset();
    this.errorNuevoUsuario = '';
    this.nuevoUsuarioCargando = false;
  }

  cerrarModalNuevoUsuario(): void {
    this.mostrarModalNuevoUsuario = false;
    this.errorNuevoUsuario = '';
    this.nuevoUsuarioCargando = false;
  }

  validarEdad(control: import('@angular/forms').AbstractControl): { invalidDate: boolean } | null {
    const fechaNacimientoDate = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoDate.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
      edad--;
    }
    return edad >= 18 ? null : { invalidDate: true };
  }

  async registrarNuevoUsuario() {
    this.errorNuevoUsuario = '';
    this.nuevoUsuarioCargando = true;
    if (!this.nuevoUsuarioForm.valid) {
      this.errorNuevoUsuario = 'Por favor completa todos los campos correctamente.';
      this.nuevoUsuarioCargando = false;
      return;
    }
    const usuario = {
      email: this.emailCtrl.value!,
      rut: this.rutCtrl.value!,
      nombres: this.nombresCtrl.value!,
      appaterno: this.appaternoCtrl.value!,
      apmaterno: this.apmaternoCtrl.value!,
      fecha_nacimiento: new Date(this.fechaNacimientoCtrl.value!),
      password: this.passwordCtrl.value!,
      tipo: 'cliente' as 'cliente'
    };
    try {
      await this.authSvc.register(usuario);
      await this.cargarUsuarios();
      this.cerrarModalNuevoUsuario();
    } catch (error: any) {
      this.errorNuevoUsuario = error?.error?.message || 'Error al registrar usuario.';
    } finally {
      this.nuevoUsuarioCargando = false;
    }
  }

  formatearRutNuevoUsuario() {
    let rut = (this.rutCtrl.value || '').replace(/[^0-9kK]/g, '').toUpperCase();
    if (rut.length > 9) rut = rut.slice(0, 9);
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let cuerpoFormateado = '';
    while (cuerpo.length > 3) {
      cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
      cuerpo = cuerpo.slice(0, -3);
    }
    cuerpoFormateado = cuerpo + cuerpoFormateado;
    this.rutCtrl.setValue(cuerpoFormateado + (dv ? '-' + dv : ''));
  }

  isNuevoUsuarioValido(): boolean {
    return this.nuevoUsuarioForm.valid;
  }
}
