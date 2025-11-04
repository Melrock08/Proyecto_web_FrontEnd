// crear-gateway.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GatewayService } from '../../services/gateway.service';
import { Gateway } from '../../models/Gateway';

@Component({
  selector: 'app-crear-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-gateway.component.html',
})
export class CrearGatewayComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Gateway>(); 

  gateway: Gateway = new Gateway('','');

  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private gatewayService: GatewayService) {}

  crearGateway() {
    if (!this.gateway.tipo) {
      this.errorMsg = 'El tipo de gateway es obligatorio';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.gatewayService.crear(this.gateway)
      .then((res) => {
        console.log('✅ Gateway creado:', res);
        this.successMsg = '✅ Gateway creado exitosamente';
        this.loading = false;
        this.guardado.emit(res); 
        this.cerrar.emit();
      })
      .catch((err) => {
        console.error('Error al crear gateway:', err);
        this.errorMsg = 'No se pudo crear el gateway';
        this.loading = false;
      });
  }
}
