// property-panel.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearActividadComponent } from '../../components/crear_actividad/crear-actividad.component';
import { CrearGatewayComponent } from '../../components/crear_gateway/crear-gateway.component';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [CommonModule, CrearActividadComponent, CrearGatewayComponent],
  templateUrl: './property-panel.component.html',
})
export class PropertyPanelComponent {
  @Input() tipoSeleccionado: string | null = null;
  @Input() data: any = null;
  @Input() nodeId: string | null = null;
  visible = true;

  @Output() guardarElemento = new EventEmitter<{ nodeId: string; data: any; label?: string }>();
  @Output() cancelarEdicion = new EventEmitter<{ nodeId: string }>();

  // recibe cuando el hijo emite guardado
  onActividadGuardada(evento: any) {
    if (!this.nodeId) return;
    // asumimos que 'evento' es la entidad devuelta por el backend (res)
    this.guardarElemento.emit({ nodeId: this.nodeId, data: evento, label: evento.nombre });
  }

  onGatewayGuardado(evento: any) {
    if (!this.nodeId) return;
    this.guardarElemento.emit({ nodeId: this.nodeId, data: evento, label: evento.tipo });
  }

  // cuando el hijo solo cierra, reemitimos cancelarEdicion
  onCancelar() {
    if (!this.nodeId) return;
    this.cancelarEdicion.emit({ nodeId: this.nodeId });
  }

  togglePanel() {
  this.visible = !this.visible;
}





}
