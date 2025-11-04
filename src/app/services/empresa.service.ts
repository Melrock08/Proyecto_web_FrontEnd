import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Observable, from } from 'rxjs';
import { Empresa } from '../models/Empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly apiUrl = 'http://localhost:8080/api/empresas';

  constructor() {}

  /**
   * Crear una nueva empresa
   */
  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    const body = {
        nombreEmpresa: empresa.nombreEmpresa,
        nit: empresa.nit,
        correoContacto: empresa.correoContacto
    };

    const promise = axios.post<Empresa>(this.apiUrl, body)
        .then(response => response.data)
        .catch(error => this.handleError<Empresa>(error));

    return from(promise);
    }


  /**
   * Listar todas las empresas
   */
  listarEmpresas(): Observable<Empresa[]> {
    const promise = axios.get<Empresa[]>(this.apiUrl)
      .then(response => response.data)
      .catch(error => this.handleError<Empresa[]>(error));
    return from(promise);
  }

  /**
   * Buscar empresa por ID
   */
  buscarPorId(id: number): Observable<Empresa> {
    const promise = axios.get<Empresa>(`${this.apiUrl}/${id}`)
      .then(response => response.data)
      .catch(error => this.handleError<Empresa>(error));
    return from(promise);
  }

  /**
   * Buscar empresa por NIT
   */
  buscarPorNit(nit: string): Observable<Empresa> {
    const promise = axios.get<Empresa>(`${this.apiUrl}/nit/${nit}`)
      .then(response => response.data)
      .catch(error => this.handleError<Empresa>(error));
    return from(promise);
  }

  /**
   * Actualizar empresa por ID
   */
  actualizarEmpresa(id: number, empresa: Empresa): Observable<Empresa> {
    const promise = axios.put<Empresa>(`${this.apiUrl}/${id}`, empresa)
      .then(response => response.data)
      .catch(error => this.handleError<Empresa>(error));
    return from(promise);
  }

  /**
   * Eliminar empresa por ID
   */
  eliminarEmpresa(id: number): Observable<void> {
    const promise = axios.delete<void>(`${this.apiUrl}/${id}`)
      .then(response => response.data)
      .catch(error => this.handleError<void>(error));
    return from(promise);
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError<T>(error: AxiosError): Promise<T> {
    const msg = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error('Error HTTP:', msg);
    return Promise.reject(new Error('Error en la petición HTTP.'));
  }
}
