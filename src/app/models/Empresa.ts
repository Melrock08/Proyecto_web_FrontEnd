import {  Usuario } from './Usuario';

export class Empresa {
    constructor(
        public idEmpresa: number,
        public nombre: string,
        public nit: string,
        public correoContacto: string,
        public Usuario: Usuario[]
    ){}
}
