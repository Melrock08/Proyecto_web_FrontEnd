import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrabajadorDashboardComponent } from '../../components/trabajador_dashboard/trabajador_dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TrabajadorDashboardComponent],
  templateUrl: './trabajador_dashboard.component.html',
})
export class TrabajadorDashboardPage {
  constructor(private router: Router) {}
}
