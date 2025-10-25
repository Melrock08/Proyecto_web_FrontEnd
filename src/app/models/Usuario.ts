import { Empresa } from './Empresa';

export class Usuario {
  constructor(
    public idUsuario: number,
    public nombre: string,
    public correo: string,
    public rolSistema: string,
    public empresa?: Empresa
  ){}
}

