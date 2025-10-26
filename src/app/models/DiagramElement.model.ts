export interface DiagramElement {
  id: string;
  type: 'proceso' | 'decision' | 'inicio' | 'fin';
  label: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    backgroundColor: string;
    width: number;
    height: number;
  };
}

export interface DiagramConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface DiagramData {
  elements: DiagramElement[];
  connections: DiagramConnection[];
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}

export interface ElementTemplate {
  type: 'proceso' | 'decision' | 'inicio' | 'fin';
  label: string;
  icon?: string;
  style: {
    backgroundColor: string;
    width: number;
    height: number;
  };
}