import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListarProcesosComponent } from '../../components/listar_procesos/listar-procesos.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ListarProcesosComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  irANuevoProceso() {
    this.router.navigate(['/editar']);
  }
}
