import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Actividad } from '../models/Actividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private readonly apiUrl = 'http://localhost:8080/api/actividades';

  constructor() {}

  /**
   * Crear nueva actividad
   */
  crear(actividad: Actividad): Promise<Actividad> {
    const body = this.buildBody(actividad);
    return axios.post<Actividad>(this.apiUrl, body)
      .then(response => response.data)
      .catch(error => this.handleError<Actividad>(error));
  }

  /**
   * 🧩 Construir body de la petición
   */
  private buildBody(actividad: Actividad) {
    return {
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      tipo: actividad.tipo,
      idRol: actividad.idRol,
      idProceso: actividad.idProceso
    };
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
