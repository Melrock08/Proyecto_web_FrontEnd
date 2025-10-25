import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProcesoService } from '../../../services/proceso.service';
import { Proceso } from '../../../models/Proceso';

@Component({
  selector: 'app-listar-procesos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-procesos.component.html',
})
export class ListarProcesosComponent implements OnInit {

  procesos = signal<Proceso[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(
    private procesoService: ProcesoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProcesos();
  }

  private cargarProcesos(): void {
    this.procesoService.getProcesos().subscribe({
      next: (data) => {
        this.procesos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar procesos:', err);
        this.error.set('No se pudieron cargar los procesos.');
        this.cargando.set(false);
      }
    });
  }

  crearProceso(): void {
    this.router.navigate(['/procesos/nuevo']);
  }

  editarProceso(id: number): void {
    this.router.navigate(['/procesos', id]);
  }

}
