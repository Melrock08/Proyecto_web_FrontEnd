import { Actividad } from './Actividad.model';

/**
 * Tipos de elementos visuales disponibles en el diagrama
 */
export type DiagramElementType = 'actividad' | 'decision' | 'inicio' | 'fin';

/**
 * Tipos de datos del dominio que puede contener cada elemento
 */
export type DomainData = Actividad | null;

/**
 * Elemento del diagrama - Genérico para soportar diferentes datos del dominio
 */
export interface DiagramElement {
  id: string;
  type: DiagramElementType;
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
  /**
   * Datos del modelo de negocio asociados a este elemento
   * Por ejemplo: si type === 'actividad', data será una instancia de Actividad
   */
  data?: DomainData;
}

/**
 * Conexión entre elementos del diagrama
 */
export interface DiagramConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  /**
   * Datos adicionales de la conexión (opcional)
   */
  data?: any;
}

/**
 * Estructura completa del diagrama para exportar/importar JSON
 */
export interface DiagramData {
  elements: DiagramElement[];
  connections: DiagramConnection[];
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}

/**
 * Plantilla de elemento disponible en el sidebar
 */
export interface ElementTemplate {
  type: DiagramElementType;
  label: string;
  icon?: string;
  style: {
    backgroundColor: string;
    width: number;
    height: number;
  };
  /**
   * Función factory para crear la instancia del modelo de dominio
   * cuando se arrastra este elemento al diagrama
   */
  createDomainData?: () => DomainData;
}

/**
 * Configuración visual por tipo de elemento
 */
export interface ElementTypeConfig {
  type: DiagramElementType;
  defaultLabel: string;
  backgroundColor: string;
  width: number;
  height: number;
  icon?: string;
  createDomainData: () => DomainData;
}

/**
 * Configuración predeterminada para cada tipo de elemento
 */
export const ELEMENT_TYPE_CONFIGS: Record<DiagramElementType, ElementTypeConfig> = {
  'actividad': {
    type: 'actividad',
    defaultLabel: 'Actividad',
    backgroundColor: '#90caf9',
    width: 120,
    height: 60,
    icon: '⚙️',
    createDomainData: () => new Actividad(
      0, // idActividad temporal, se asignará después
      'Nueva Actividad',
      'Descripción de la actividad',
      'Proceso'
    )
  },
  'decision': {
    type: 'decision',
    defaultLabel: 'Decisión',
    backgroundColor: '#ffb74d',
    width: 120,
    height: 80,
    icon: '◆',
    createDomainData: () => null // Las decisiones no tienen modelo de dominio
  },
  'inicio': {
    type: 'inicio',
    defaultLabel: 'Inicio',
    backgroundColor: '#4caf50',
    width: 120,
    height: 60,
    icon: '▶',
    createDomainData: () => null
  },
  'fin': {
    type: 'fin',
    defaultLabel: 'Fin',
    backgroundColor: '#ef5350',
    width: 120,
    height: 60,
    icon: '⏹',
    createDomainData: () => null
  }
};