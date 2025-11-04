export class Proceso {
  constructor(
    public nombre: string,
    public descripcion: string,
    public categoria: string,
    public estado: "borrador" | "publicado",
    public idEmpresa?: number,
    public idProceso?: number             
  ) {}
}
