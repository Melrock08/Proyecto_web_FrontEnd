import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { DiagramComponent } from '../../../components/diagram/diagram.component';
import { PropertyPanelComponent } from '../../../components/property_panel/property-panel.component';

@Component({
  selector: 'app-dashboard-editor',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DiagramComponent, PropertyPanelComponent],
  templateUrl: './editar-procesos.component.html',
})
export class EditarProcesosComponent {
  constructor(private router: Router) {}
  @ViewChild(DiagramComponent, { static: false }) diagramComponent?: DiagramComponent;

  selectedNodeId: string | null = null;
  selectedTipo: string | null = null;
  selectedData: any = null;

  onNodoSeleccionado(event: { id: string; tipo: string; data: any }) {
    this.selectedNodeId = event.id;
    this.selectedTipo = event.tipo;
    this.selectedData = event.data;
  }

  onGuardarElemento(event: { nodeId: string; data: any; label?: string }) {
    // actualizar nodo visualmente
    this.diagramComponent?.actualizarNodo(event.nodeId, event.data, event.label);
    // además aquí podrías disparar alguna notificación o refrescar estado global
  }

  onCancelarEdicion(event: { nodeId: string }) {
    this.diagramComponent?.eliminarNodo(event.nodeId);
    if (this.selectedNodeId === event.nodeId) {
      this.selectedNodeId = null;
      this.selectedTipo = null;
      this.selectedData = null;
    }
  }

  irAtras() {
    this.router.navigate(['/dashboard']);
  }
}

