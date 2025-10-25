import {Actividad  } from './Actividad';
import { Empresa } from './Empresa';
import { Edge } from './Edge';
import { Gateway } from './Gateway';

export class Proceso {
    constructor(
        public idProceso: number,
        public nombre: string,
        public descripcion: string,
        public categoria: string,
        public estado: "borrador" | "publicado",
        public empresa: Empresa,
        public actividades: Actividad[],
        public edges: Edge[],
        public gateways: Gateway[] 
    ){}
}
