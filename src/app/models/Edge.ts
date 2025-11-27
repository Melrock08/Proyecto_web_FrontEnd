export class Edge {
  constructor(
    public idProceso: number,
    public idOrigenActividad: number,
    public idOrigenGateway: number,
    public idDestinoActividad: number,
    public idDestinoGateway: number,
    public idEdge?: number
  ) {}
}
