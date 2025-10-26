import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ElementTemplate, ELEMENT_TYPE_CONFIGS, DiagramElementType } from '../../../models/DiagramElement.model';

/**
 * Componente Sidebar
 *
 * Muestra los elementos disponibles que se pueden arrastrar al diagrama.
 * Los elementos permanecen en el sidebar después de ser arrastrados (se clonan).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
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
   * Generadas automáticamente desde la configuración
   */
  availableElements: ElementTemplate[] = this.generateAvailableElements();

  /**
   * Estado del sidebar (expandido/colapsado)
   */
  isExpanded: boolean = true;

  /**
   * Genera las plantillas de elementos desde la configuración
   */
  private generateAvailableElements(): ElementTemplate[] {
    // Puedes definir qué tipos quieres mostrar en el sidebar
    const typesToShow: DiagramElementType[] = ['inicio', 'actividad', 'decision', 'fin'];
    
    return typesToShow.map(type => {
      const config = ELEMENT_TYPE_CONFIGS[type];
      return {
        type: config.type,
        label: config.defaultLabel,
        icon: config.icon,
        style: {
          backgroundColor: config.backgroundColor,
          width: config.width,
          height: config.height
        },
        createDomainData: config.createDomainData
      };
    });
  }

  /**
   * Toggle para expandir/colapsar el sidebar
   */
  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }
}