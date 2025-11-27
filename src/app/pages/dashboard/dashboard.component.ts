import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListarProcesosComponent } from '../../components/listar_procesos/listar-procesos.component';
import { Usuario } from '../../models/Usuario';
import { Rol } from '../../models/Rol';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';

type Vista = 'procesos' | 'crear-usuario' | 'crear-rol' | 'perfil';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ListarProcesosComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // Estado del sidebar
  sidebarAbierto = signal(true);
  
  // Usuario actual
  cargandoUsuario = signal(true);
  usuario = signal<Usuario | null>(null);
  
  // Vista activa
  vistaActual = signal<Vista>('procesos');
  
  // Formularios
  usuarioForm: FormGroup;
  rolForm: FormGroup;
  
  // Estados de carga y mensajes
  cargandoSubmit = signal(false);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {
    // Inicializar formulario de usuario
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      rolSistema: ['ADMIN', Validators.required],
      idEmpresa: [5, [Validators.required, Validators.min(1)]]
    });

    // Inicializar formulario de rol
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  toggleSidebar(): void {
    this.sidebarAbierto.set(!this.sidebarAbierto());
  }

  cambiarVista(vista: Vista): void {
    this.vistaActual.set(vista);
    this.limpiarMensajes();
    this.resetearFormularios();
  }

  private cargarDatosUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario.set(JSON.parse(usuarioGuardado));
    }
    this.cargandoUsuario.set(false);
  }

  irANuevoProceso(): void {
    this.router.navigate(['/editar']);
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  // ========== CREAR USUARIO ==========
  crearUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.marcarCamposComoTocados(this.usuarioForm);
      return;
    }

    const { confirmarContrasena, ...datos } = this.usuarioForm.value;

    // Validar que las contraseñas coincidan
    if (datos.contrasena !== confirmarContrasena) {
      this.mensajeError.set('Las contraseñas no coinciden');
      return;
    }

    this.cargandoSubmit.set(true);
    this.limpiarMensajes();

    const nuevoUsuario = new Usuario(
      datos.nombre,
      datos.correo,
      datos.contrasena,
      datos.rolSistema,
      datos.idEmpresa
    );

    this.usuarioService.registrar(nuevoUsuario, datos.contrasena, datos.idEmpresa)
      .subscribe({
        next: (respuesta) => {
          this.mensajeExito.set('Usuario creado exitosamente');
          this.usuarioForm.reset({ rolSistema: 'ADMIN', idEmpresa: 5 });
          this.cargandoSubmit.set(false);
          
          // Limpiar mensaje después de 3 segundos
          setTimeout(() => this.limpiarMensajes(), 3000);
        },
        error: (error) => {
          this.mensajeError.set('Error al crear usuario: ' + error.message);
          this.cargandoSubmit.set(false);
        }
      });
  }

  // ========== CREAR ROL ==========
  crearRol(): void {
    if (this.rolForm.invalid) {
      this.marcarCamposComoTocados(this.rolForm);
      return;
    }

    this.cargandoSubmit.set(true);
    this.limpiarMensajes();

    const datos = this.rolForm.value;
    const nuevoRol = new Rol(0, datos.nombre, datos.descripcion);

    this.rolService.crear(nuevoRol)
      .then((respuesta) => {
        this.mensajeExito.set('Rol creado exitosamente');
        this.rolForm.reset();
        this.cargandoSubmit.set(false);
        
        setTimeout(() => this.limpiarMensajes(), 3000);
      })
      .catch((error) => {
        this.mensajeError.set('Error al crear rol: ' + error.message);
        this.cargandoSubmit.set(false);
      });
  }

  // ========== UTILIDADES ==========
  private marcarCamposComoTocados(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsTouched();
    });
  }

  private resetearFormularios(): void {
    this.usuarioForm.reset({ rolSistema: 'ADMIN', idEmpresa: 5 });
    this.rolForm.reset();
  }

  private limpiarMensajes(): void {
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
  }

  // Helpers para el template
  campoInvalido(form: FormGroup, campo: string): boolean {
    const control = form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  obtenerErrorCampo(form: FormGroup, campo: string): string {
    const control = form.get(campo);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Correo electrónico inválido';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres`;
    }
    if (control.errors['min']) return 'Valor debe ser mayor a 0';

    return 'Campo inválido';
  }
}