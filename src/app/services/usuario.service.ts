import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Observable, from } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiUrl = 'http://localhost:8080/api/usuarios';

  constructor() {}

  /**
   * Registrar usuario (ADMIN) asociado a una empresa existente
   */
  registrar(usuario: Usuario, contrasena: string, idEmpresa: number): Observable<Usuario> {
    const body = { 
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: contrasena,
      rolSistema: usuario.rolSistema || 'ADMIN',
      idEmpresa: idEmpresa
    };

    const promise = axios.post<Usuario>(this.apiUrl, body)
      .then(response => response.data)
      .catch(error => this.handleError<Usuario>(error));

    return from(promise);
  }

  login(credenciales: Login): Observable<Usuario> {
    const promise = axios.post<Usuario>(`${this.apiUrl}/login`, credenciales)
      .then(response => response.data)
      .catch(error => this.handleError<Usuario>(error));

    return from(promise);
  }

  private handleError<T>(error: AxiosError): Promise<T> {
    const msg = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error('Error HTTP:', msg);
    return Promise.reject(new Error('Error en la petición HTTP.'));
  }
}
