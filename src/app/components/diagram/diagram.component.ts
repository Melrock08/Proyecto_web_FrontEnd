import { Component, EventEmitter, Output, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { newInstance, BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { EdgeService } from '../../services/edge.service';
import { Edge } from '../../models/Edge';

interface NodeModel {
  id: string;
  tipo: string;
  x: number;
  y: number;
  label?: string;
  data?: any;
  _dx?: number;
  _dy?: number;
}

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagram.component.html',
  providers: [EdgeService]
})
export class DiagramComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLElement>;
  @Output() nodoSeleccionado = new EventEmitter<{ id: string; tipo: string; data: any }>();

  nodes: NodeModel[] = [];
  movingNode: NodeModel | null = null;
  private startClientX = 0;
  private startClientY = 0;
  private pointerMoveHandler = this.onPointerMove.bind(this);
  private pointerUpHandler = this.onPointerUp.bind(this);

  jsPlumbInstance!: BrowserJsPlumbInstance;

  constructor(private edgeService: EdgeService) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.canvasRef?.nativeElement) {
      this.jsPlumbInstance = newInstance({ container: this.canvasRef.nativeElement });
    }
  }

  ngOnDestroy(): void {
    this.stopMove();
    if (this.jsPlumbInstance && typeof window !== 'undefined') {
      (this.jsPlumbInstance as any)?.destroy?.();
    }
  }

  allowDrop(evt: DragEvent) { evt.preventDefault(); }

onDrop(evt: DragEvent) {
  evt.preventDefault();
  const tipo = evt.dataTransfer?.getData('application/x-elemento');
  if (!tipo) return;

  // Tomamos un id enviado desde el sidebar si existe; si no, creamos uno aquí.
  const idFromDT = evt.dataTransfer?.getData('application/x-node-id');
  const id = idFromDT && idFromDT.length ? idFromDT :
    `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const rect = this.canvasRef.nativeElement.getBoundingClientRect();
  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;

  // Si ya existe un nodo con ese id (arrastrado previamente o creado por otro flujo),
  // lo reposicionamos en vez de crear duplicado.
  const existing = this.nodes.find(n => n.id === id);
  if (existing) {
    existing.x = x;
    existing.y = y;
    // revalidate jsPlumb y seleccionar
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        this.makeNodeConnectable(existing);
        (this.jsPlumbInstance as any)?.revalidate?.(document.getElementById(existing.id));
      }, 0);
    }
    this.seleccionarNodo(existing);
    return;
  }

  const newNode: NodeModel = {
    id,
    tipo,
    x,
    y,
    label: tipo === 'actividad' ? 'Nueva Actividad' : tipo === 'gateway' ? 'Nuevo Gateway' : tipo,
    data: {} // mejor tener objeto por defecto para que property panel no reciba null
  };

  this.nodes.push(newNode);

  // marcar conectable + revalidar
  if (typeof document !== 'undefined') {
    setTimeout(() => {
      this.makeNodeConnectable(newNode);
      (this.jsPlumbInstance as any)?.revalidate?.(document.getElementById(newNode.id));
    }, 0);
  }

  // Abrir / seleccionar inmediatamente el panel de propiedades
  this.seleccionarNodo(newNode);
}


  seleccionarNodo(n: NodeModel, evt?: MouseEvent) {
    if (evt) evt.stopPropagation();
    this.nodoSeleccionado.emit({ id: n.id, tipo: n.tipo, data: n.data });
  }

  // ------------------- Drag & Drop -------------------
  startMove(n: NodeModel, evt: PointerEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.seleccionarNodo(n);

    this.movingNode = n;
    this.startClientX = evt.clientX;
    this.startClientY = evt.clientY;
    n._dx = 0;
    n._dy = 0;

    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', this.pointerMoveHandler);
      window.addEventListener('pointerup', this.pointerUpHandler);
    }

    try { (evt.target as HTMLElement).setPointerCapture?.((evt as any).pointerId); } catch {}
  }

  private onPointerMove(evt: PointerEvent) {
    if (!this.movingNode) return;
    this.movingNode._dx = evt.clientX - this.startClientX;
    this.movingNode._dy = evt.clientY - this.startClientY;

    if (typeof document !== 'undefined') {
      const element = document.getElementById(this.movingNode.id);
      if (element && this.jsPlumbInstance) (this.jsPlumbInstance as any)?.revalidate?.(element);
    }
  }

  private onPointerUp(evt: PointerEvent) {
    if (!this.movingNode) return;

    const n = this.movingNode;
    n.x += n._dx ?? 0;
    n.y += n._dy ?? 0;

    delete n._dx;
    delete n._dy;

    try { (evt.target as HTMLElement).releasePointerCapture?.((evt as any).pointerId); } catch {}
    this.stopMove();
  }

  private stopMove() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.pointerMoveHandler);
      window.removeEventListener('pointerup', this.pointerUpHandler);
    }
    this.movingNode = null;
  }

  // ------------------- jsPlumb Connections -------------------
makeNodeConnectable(node: NodeModel) {
  if (!this.jsPlumbInstance) return;

  const el = document.getElementById(node.id);
  console.log('[makeNodeConnectable] node', node.id, 'el?', !!el);
  if (!el) return;
  if (node.tipo !== 'actividad' && node.tipo !== 'gateway') return;

  // Evitar endpoints duplicados: intentar remover los existentes
  try {
    (this.jsPlumbInstance as any).removeAllEndpoints?.(el);
  } catch (err) {
    console.warn('[makeNodeConnectable] removeAllEndpoints falló (ignorado)', err);
  }

  // Helper para crear endpoints
  const createEndpoint = (anchor: any, isSource: boolean, isTarget: boolean) => {
    const ep = this.jsPlumbInstance.addEndpoint(el, {
      anchor,
      endpoint: "Dot",
      paintStyle: { fill: isSource ? "#f97316" : "#000", stroke: "#000", strokeWidth: 2 },
      maxConnections: -1,
      source: isSource,
      target: isTarget,
      connector: { type: "Flowchart", options: { cornerRadius: 6 } },
      connectorStyle: { stroke: "#333", strokeWidth: 2 }
    });
    console.log('[makeNodeConnectable] endpoint creado', node.id, anchor, !!ep);
    return ep;
  };

  // Crear endpoints en los 4 lados
  createEndpoint("Top", true, true);
  createEndpoint("Bottom", true, true);
  createEndpoint("Left", true, true);
  createEndpoint("Right", true, true);

  // --- Binds globales: instalarlos solo una vez ---
  // usamos una bandera en la instancia/component para no volver a bindear
  if (!(this as any)._jsPlumbBindingsInstalled) {
    (this as any)._jsPlumbBindingsInstalled = true;

    // prevenir loopbacks
    this.jsPlumbInstance.bind("beforeConnect", (info: any) => {
      return info.source !== info.target;
    });

    // cuando se crea una conexión
    this.jsPlumbInstance.bind("connection", (conn: any) => {
      console.log('[jsPlumb] connection fired', conn?.source?.id, '->', conn?.target?.id);
      console.log('[jsPlumb] conn keys', Object.keys(conn || {}));

      // intentar añadir overlay (flecha) usando la instancia (API moderna)
      try {
        this.jsPlumbInstance.addOverlay(conn, {
          type: "Arrow",
          options: { width: 10, length: 10, location: 1 }
        });
      } catch (err) {
        console.warn('[jsPlumb] addOverlay falló (ignorado)', err);
      }

      // buscar nodos en el modelo local
      const fromNode = this.nodes.find((n: NodeModel) => n.id === conn?.source?.id);
      const toNode   = this.nodes.find((n: NodeModel) => n.id === conn?.target?.id);
      console.log('[jsPlumb] fromNode/toNode found?', !!fromNode, !!toNode);
      if (!fromNode || !toNode) return;

      if ((fromNode.tipo === 'actividad' || fromNode.tipo === 'gateway') &&
          (toNode.tipo   === 'actividad' || toNode.tipo   === 'gateway')) {

        const parseMaybeNumber = (idStr: string | undefined): string => {
          if (!idStr) return '';
          const v = Number(idStr);
          return Number.isFinite(v) ? idStr : '';
        };

        const edge = new Edge(
        '1', 
          fromNode.tipo === 'actividad' ? parseMaybeNumber(fromNode.id) : '',
          fromNode.tipo === 'gateway'   ? parseMaybeNumber(fromNode.id) : '',
          toNode.tipo   === 'actividad' ? parseMaybeNumber(toNode.id)   : '',
          toNode.tipo   === 'gateway'   ? parseMaybeNumber(toNode.id)   : ''
        );

        console.log('[jsPlumb] Llamando edgeService.crear con', edge);
        this.edgeService.crear(edge)
          .then((e: any) => console.log('Edge creado', e))
          .catch((err: any) => console.error('Error creando Edge', err));
      }
    });
  }
}

  // ------------------- Utils -------------------
  getNodeWidth(n: NodeModel) {
    if (n.tipo === 'inicio' || n.tipo === 'fin') return 64;
    if (n.tipo === 'actividad') return 160;
    if (n.tipo === 'gateway') return 100;
    return 120;
  }

  getNodeHeight(n: NodeModel) {
    if (n.tipo === 'inicio' || n.tipo === 'fin') return 64;
    if (n.tipo === 'actividad') return 72;
    if (n.tipo === 'gateway') return 100;
    return 72;
  }

  leftFor(n: NodeModel) { return n.x - this.getNodeWidth(n)/2; }
  topFor(n: NodeModel) { return n.y - this.getNodeHeight(n)/2; }

  public actualizarNodo(id: string, data: any, label?: string) {
    const nodo = this.nodes.find(n => n.id === id);
    if (!nodo) return;
    nodo.data = data;
    if (label !== undefined && label !== null) nodo.label = label;
  }

  public eliminarNodo(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
    if (typeof window !== 'undefined') {
      setTimeout(() => (this.jsPlumbInstance as any)?.repaintEverything?.(), 0);
    }
  }
}
