export class Actividad {
  constructor(
    public nombre: string,
    public descripcion: string,
    public tipo: string,
    public idRol: string,
    public idProceso: string,
    public idActividad?: number
  ) {}
}
