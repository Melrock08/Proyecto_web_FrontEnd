import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProcesoService } from '../../services/proceso.service';
import { UsuarioService } from '../../services/usuario.service';
import { Proceso } from '../../models/Proceso';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-trabajador-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trabajador_dashboard.html',
})
export class TrabajadorDashboardComponent implements OnInit {
  // Sidebar state
  sidebarAbierto = signal(true);

  // Usuario actual
  usuario = signal<Usuario | null>(null);
  cargandoUsuario = signal(true);

  // Procesos
  procesos = signal<Proceso[]>([]);
  cargandoProcesos = signal(true);
  error = signal<string | null>(null);

  constructor(
    private procesoService: ProcesoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarProcesos();
  }

  toggleSidebar(): void {
    this.sidebarAbierto.set(!this.sidebarAbierto());
  }

  private cargarDatosUsuario(): void {
    // Aquí deberías obtener el usuario del localStorage o de un servicio de autenticación
    // Por ahora simulo que obtienes el usuario guardado
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario.set(JSON.parse(usuarioGuardado));
      this.cargandoUsuario.set(false);
    } else {
      this.cargandoUsuario.set(false);
      this.error.set('No hay usuario autenticado');
    }
  }

  private cargarProcesos(): void {
    this.cargandoProcesos.set(true);
    this.error.set(null);

    this.procesoService.getProcesos()
      .then((data) => {
        // Filtrar solo los procesos del usuario actual si es necesario
        this.procesos.set(data);
        this.cargandoProcesos.set(false);
      })
      .catch((err) => {
        console.error('Error al cargar procesos:', err);
        this.error.set('No se pudieron cargar los procesos.');
        this.cargandoProcesos.set(false);
      });
  }

  editarProceso(id: number): void {
    this.router.navigate(['/editar', id]);
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}