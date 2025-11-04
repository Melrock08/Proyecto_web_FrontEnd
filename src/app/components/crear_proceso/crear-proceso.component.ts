import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/Proceso';

@Component({
  selector: 'app-crear-proceso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proceso.component.html',
})
export class CrearProcesoComponent {
  @Output() cerrar = new EventEmitter<void>();

  proceso: Proceso = new Proceso('', '', '', 'borrador');

  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private procesoService: ProcesoService) {}

  crearProceso() {
    if (!this.proceso.nombre || !this.proceso.descripcion || !this.proceso.categoria) {
      this.errorMsg = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.procesoService.crearProceso(this.proceso)
      .then((res) => {
        console.log('Proceso creado:', res);
        this.successMsg = 'Proceso creado exitosamente';
        this.loading = false;
        this.cerrar.emit();
      })
      .catch((err) => {
        console.error('Error al crear proceso:', err);
        this.errorMsg = 'No se pudo crear el proceso';
        this.loading = false;
      });
  }

  cerrarManual() {
    this.cerrar.emit();
  }
}
