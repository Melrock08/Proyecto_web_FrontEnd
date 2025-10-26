import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/dragAndDrop/sidebar/sidebar.component';
import { DiagramComponent } from '../../components/dragAndDrop/diagram/diagram.component';

/**
 * Componente DragAndDrop (Página principal)
 * 
 * Página contenedora que integra el sidebar y el diagrama.
 * Proporciona la interfaz completa para crear diagramas de flujo.
 */
@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DiagramComponent],
  templateUrl: './dragAndDrop.component.html',
  styleUrls: ['./dragAndDrop.component.css']
})
export class DragAndDropComponent {
  /**
   * Título de la página
   */
  pageTitle = 'Sistema de Diagramas de Flujo';

  /**
   * Descripción de la página
   */
  pageDescription = 'Crea y gestiona diagramas de flujo de manera visual e intuitiva';
}