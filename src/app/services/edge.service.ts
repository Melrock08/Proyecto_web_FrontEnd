import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Edge } from '../models/Edge';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {

  private readonly apiUrl = 'http://localhost:8080/api/arcos';

  constructor() {}

  /**
   * Crear un nuevo edge
   */
  crear(edge: Edge): Promise<Edge> {
    const body = this.buildBody(edge);
    return axios.post<Edge>(this.apiUrl, body)
      .then(response => response.data)
      .catch(error => this.handleError<Edge>(error));
  }

  /**
   * 🧩 Construir body de la petición
   */
  private buildBody(edge: Edge) {
    return {
      idProceso: edge.idProceso,

      // origen
      idOrigenActividad: edge.idOrigenActividad,
      idOrigenGateway: edge.idOrigenGateway,

      // destino
      idDestinoActividad: edge.idDestinoActividad,
      idDestinoGateway: edge.idDestinoGateway
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
