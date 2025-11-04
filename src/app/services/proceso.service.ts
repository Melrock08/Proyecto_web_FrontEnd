import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Proceso } from '../models/Proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private readonly apiUrl = 'http://localhost:8080/api/procesos';

  /**
   * Función para construir el cuerpo de la petición
   */
  private buildBody(proceso: Proceso) {
    return {
      nombre: proceso.nombre,
      descripcion: proceso.descripcion,
      categoria: proceso.categoria,
      estado: proceso.estado === 'borrador' ? 'Activo' : proceso.estado,
      idEmpresa: proceso.idEmpresa ?? 5
    };
  }

  /**
   * Listar todos los procesos
   */
  getProcesos(): Promise<Proceso[]> {
    return axios.get<Proceso[]>(this.apiUrl)
      .then(response => response.data)
      .catch(error => this.handleError<Proceso[]>(error));
  }

  /**
   * Crear proceso
   */
  crearProceso(proceso: Proceso): Promise<Proceso> {
    const body = this.buildBody(proceso);
    return axios.post<Proceso>(this.apiUrl, body)
      .then(response => response.data)
      .catch(error => this.handleError<Proceso>(error));
  }

  /**
   * Editar proceso por ID
   */
  actualizarProceso(id: number, proceso: Proceso): Promise<Proceso> {
    const body = this.buildBody(proceso);
    return axios.put<Proceso>(`${this.apiUrl}/${id}`, body)
      .then(response => response.data)
      .catch(error => this.handleError<Proceso>(error));
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
