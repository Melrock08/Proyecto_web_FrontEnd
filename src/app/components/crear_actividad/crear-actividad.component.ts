// crear-actividad.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../services/actividad.service';
import { Actividad } from '../../models/Actividad';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-actividad.component.html',
})
export class CrearActividadComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Actividad>(); 

  actividad: Actividad = new Actividad('', '', '', '','');

  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private actividadService: ActividadService) {}

  crearActividad() {
    if (!this.actividad.nombre || !this.actividad.descripcion || !this.actividad.tipo) {
      this.errorMsg = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.actividadService.crear(this.actividad)
      .then((res) => {
        console.log('Actividad creada:', res);
        this.successMsg = 'Actividad creada exitosamente';
        this.loading = false;
        this.guardado.emit(res); 
        this.cerrar.emit();
      })
      .catch((err) => {
        console.error('Error al crear actividad:', err);
        this.errorMsg = 'No se pudo crear la actividad';
        this.loading = false;
      });
  }
}
