import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ElementTemplate } from '../../../models/DiagramElement.model';

/**
 * Componente Sidebar
 *
 * Muestra los elementos disponibles que se pueden arrastrar al diagrama.
 * Los elementos permanecen en el sidebar después de ser arrastrados (se clonan).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList], // Agregado CdkDropList
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  /**
   * ID del drop list del sidebar para conectarlo con el diagram
   */
  sidebarDropListId = 'sidebar-list';

  /**
   * Plantillas de elementos disponibles para arrastrar al diagrama
   */
  availableElements: ElementTemplate[] = [
    {
      type: 'inicio',
      label: 'Inicio',
      style: {
        backgroundColor: '#4caf50',
        width: 120,
        height: 60
      }
    },
    {
      type: 'proceso',
      label: 'Proceso',
      style: {
        backgroundColor: '#90caf9',
        width: 120,
        height: 60
      }
    },
    {
      type: 'decision',
      label: 'Decisión',
      style: {
        backgroundColor: '#ffb74d',
        width: 120,
        height: 80
      }
    },
    {
      type: 'fin',
      label: 'Fin',
      style: {
        backgroundColor: '#ef5350',
        width: 120,
        height: 60
      }
    }
  ];

  /**
   * Estado del sidebar (expandido/colapsado)
   */
  isExpanded: boolean = true;

  /**
   * Toggle para expandir/colapsar el sidebar
   */
  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }
}