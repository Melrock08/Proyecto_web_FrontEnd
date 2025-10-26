import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { newInstance, BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { DiagramElement, DiagramConnection, DiagramData, ElementTemplate } from '../../../models/DiagramElement.model';
import { Actividad } from '../../../models/Actividad.model';

/**
 * Componente Diagram
 * 
 * Lienzo principal donde se crean y conectan los elementos del diagrama.
 * Maneja el drag & drop desde el sidebar y las conexiones jsPlumb.
 */
@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements AfterViewInit, OnDestroy {
  @ViewChild('diagramContainer', { static: false }) diagramContainer!: ElementRef;

  /**
   * Instancia de jsPlumb para manejar las conexiones
   */
  private jsPlumbInstance?: BrowserJsPlumbInstance;

  /**
   * Lista de elementos en el diagrama
   */
  diagramElements: DiagramElement[] = [];

  /**
   * Contador para generar IDs únicos
   */
  private elementCounter = 0;

  /**
   * Lista de conexiones entre elementos
   */
  connections: DiagramConnection[] = [];

  ngAfterViewInit(): void {
    this.initializeJsPlumb();
  }

  ngOnDestroy(): void {
    // Limpiar instancia de jsPlumb
    if (this.jsPlumbInstance) {
      this.jsPlumbInstance.destroy();
    }
  }

  /**
   * Inicializa jsPlumb en el contenedor del diagrama
   */
  private initializeJsPlumb(): void {
    const container = this.diagramContainer.nativeElement;
    
    this.jsPlumbInstance = newInstance({
      container: container
    });

    // Configurar para que sea interactivo - evento cuando se crea una conexión
    this.jsPlumbInstance.bind('connection', (info: any) => {
      this.onConnectionCreated(info);
    });
  }

  /**
   * Maneja el drop de un elemento desde el sidebar al diagrama
   */
  onElementDropped(event: CdkDragDrop<ElementTemplate>): void {
    if (!event.item.data) return;

    const template: ElementTemplate = event.item.data;
    const dropPosition = event.dropPoint;

    // Obtener las dimensiones del contenedor para calcular la posición correcta
    const containerRect = this.diagramContainer.nativeElement.getBoundingClientRect();

    // Crear los datos del dominio si el template tiene un factory
    const domainData = template.createDomainData ? template.createDomainData() : null;
    
    // Si es una actividad, asignarle un ID secuencial
    if (domainData instanceof Actividad) {
      domainData.idActividad = this.elementCounter + 1;
    }

    // Crear nuevo elemento en el diagrama
    const newElement: DiagramElement = {
      id: `element-${++this.elementCounter}`,
      type: template.type,
      label: `${template.label} ${this.elementCounter}`,
      position: {
        x: dropPosition.x - containerRect.left - (template.style.width / 2),
        y: dropPosition.y - containerRect.top - (template.style.height / 2)
      },
      style: template.style,
      data: domainData // Aquí se inyecta la instancia del modelo de dominio
    };

    this.diagramElements.push(newElement);

    // Log para debug - ver los datos del dominio
    console.log('Elemento creado:', newElement);
    if (newElement.data instanceof Actividad) {
      console.log('Actividad asociada:', newElement.data);
    }

    // Esperar a que Angular renderice el elemento antes de configurar jsPlumb
    setTimeout(() => {
      this.makeElementDraggableAndConnectable(newElement.id);
    }, 10);
  }

  /**
   * Configura un elemento para que sea arrastrable y conectable con jsPlumb
   */
  private makeElementDraggableAndConnectable(elementId: string): void {
    if (!this.jsPlumbInstance) return;

    const element = document.getElementById(elementId);
    if (!element) return;

    // Hacer el elemento manejado por jsPlumb (esto lo hace arrastrable)
    this.jsPlumbInstance.manage(element);

    // Configurar los endpoints (puntos de conexión) correctamente
    // Endpoint derecho (fuente - source)
    this.jsPlumbInstance.addEndpoint(element, {
      endpoint: { type: 'Dot', options: { radius: 6 } },
      anchor: 'Right',
      source: true,
      target: false,
      maxConnections: -1,
      paintStyle: { fill: '#4CAF50' },
      hoverPaintStyle: { fill: '#45a049' }
    });

    // Endpoint izquierdo (destino - target)
    this.jsPlumbInstance.addEndpoint(element, {
      endpoint: { type: 'Dot', options: { radius: 6 } },
      anchor: 'Left',
      source: false,
      target: true,
      maxConnections: -1,
      paintStyle: { fill: '#2196F3' },
      hoverPaintStyle: { fill: '#1976D2' }
    });

    // Endpoint superior (puede ser fuente o destino)
    this.jsPlumbInstance.addEndpoint(element, {
      endpoint: { type: 'Dot', options: { radius: 6 } },
      anchor: 'Top',
      source: true,
      target: true,
      maxConnections: -1,
      paintStyle: { fill: '#FF9800' },
      hoverPaintStyle: { fill: '#F57C00' }
    });

    // Endpoint inferior (puede ser fuente o destino)
    this.jsPlumbInstance.addEndpoint(element, {
      endpoint: { type: 'Dot', options: { radius: 6 } },
      anchor: 'Bottom',
      source: true,
      target: true,
      maxConnections: -1,
      paintStyle: { fill: '#9C27B0' },
      hoverPaintStyle: { fill: '#7B1FA2' }
    });

    // Configurar el callback cuando el elemento se mueve
    this.jsPlumbInstance.on(element, 'drag:stop', (params: any) => {
      const pos = this.jsPlumbInstance!.getOffset(element);
      this.updateElementPosition(elementId, pos.x, pos.y);
    });
  }

  /**
   * Actualiza la posición de un elemento en el modelo
   */
  private updateElementPosition(elementId: string, x: number, y: number): void {
    const element = this.diagramElements.find(el => el.id === elementId);
    if (element) {
      element.position.x = x;
      element.position.y = y;
    }
  }

  /**
   * Callback cuando se crea una conexión
   */
  private onConnectionCreated(info: any): void {
    const connection: DiagramConnection = {
      id: `conn-${Date.now()}`,
      sourceId: info.source.id,
      targetId: info.target.id
    };

    this.connections.push(connection);
    console.log('Conexión creada:', connection);
  }

  /**
   * Elimina un elemento del diagrama
   */
  deleteElement(elementId: string): void {
    if (!this.jsPlumbInstance) return;

    const element = document.getElementById(elementId);
    if (element) {
      // Primero eliminar todas las conexiones asociadas al elemento
      this.jsPlumbInstance.deleteConnectionsForElement(element);
      
      // Luego desregistrar el elemento de jsPlumb
      this.jsPlumbInstance.unmanage(element);
    }

    // Eliminar del array
    this.diagramElements = this.diagramElements.filter(el => el.id !== elementId);
    
    // Eliminar conexiones relacionadas del array
    this.connections = this.connections.filter(
      conn => conn.sourceId !== elementId && conn.targetId !== elementId
    );
  }

  /**
   * Exporta el diagrama a JSON
   * Incluye los datos del dominio de cada elemento
   */
  exportToJSON(): DiagramData {
    return {
      elements: this.diagramElements.map(el => ({
        ...el,
        // Serializar los datos del dominio
        data: el.data instanceof Actividad ? {
          idActividad: el.data.idActividad,
          nombre: el.data.nombre,
          descripcion: el.data.descripcion,
          tipo: el.data.tipo
        } : el.data
      })),
      connections: this.connections,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      }
    };
  }

  /**
   * Limpia todo el diagrama
   */
  clearDiagram(): void {
    if (this.jsPlumbInstance) {
      // Eliminar todos los elementos manejados por jsPlumb
      this.diagramElements.forEach(el => {
        const element = document.getElementById(el.id);
        if (element) {
          this.jsPlumbInstance!.deleteConnectionsForElement(element);
          this.jsPlumbInstance!.unmanage(element);
        }
      });
      
      // Resetear jsPlumb
      this.jsPlumbInstance.reset();
    }
    
    this.diagramElements = [];
    this.connections = [];
    this.elementCounter = 0;
  }

  /**
   * Descarga el diagrama como JSON
   */
  downloadJSON(): void {
    const data = this.exportToJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagrama-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Obtiene los datos del dominio de un elemento
   * Útil para editar las propiedades de una actividad, por ejemplo
   */
  getElementDomainData(elementId: string): Actividad | null {
    const element = this.diagramElements.find(el => el.id === elementId);
    return element?.data instanceof Actividad ? element.data : null;
  }

  /**
   * Actualiza los datos del dominio de un elemento
   */
  updateElementDomainData(elementId: string, newData: Actividad): void {
    const element = this.diagramElements.find(el => el.id === elementId);
    if (element && element.data instanceof Actividad) {
      element.data = newData;
      console.log('Datos de dominio actualizados:', element);
    }
  }
}