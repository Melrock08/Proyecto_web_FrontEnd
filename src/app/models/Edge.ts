export class Edge {
  constructor(
    public idProceso: string,
    public idOrigenActividad: string,
    public idOrigenGateway: string,
    public idDestinoActividad: string,
    public idDestinoGateway: string,
    public idEdge?: string
  ) {}
}
