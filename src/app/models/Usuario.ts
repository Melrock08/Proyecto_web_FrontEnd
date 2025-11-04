export class Usuario {
  constructor(   
    public nombre: string,
    public correo: string,
    public contrasena: string,
    public rolSistema?: string,
    public idEmpresa?: number,
    public idUsuario?: number
  ) {}
}