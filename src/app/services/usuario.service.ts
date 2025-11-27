import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Observable, from } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { Login } from '../models/Login';
import { AuthResponse } from '../models/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor() {}

  // LOGIN
  login(credenciales: Login): Observable<AuthResponse> {

    const promise = axios.post<AuthResponse>(`${this.apiUrl}/login`, credenciales)
      .then(response => response.data)
      .catch(error => this.handleError<AuthResponse>(error));

    return from(promise);
  }

  // REGISTRO 
registrar(payload: any): Observable<any> {
  const promise = axios.post<any>(`${this.apiUrl}/register`, payload)
    .then(response => response.data)
    .catch(error => this.handleError<any>(error));
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

