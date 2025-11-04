import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Gateway } from '../models/Gateway';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private readonly apiUrl = 'http://localhost:8080/api/gateways';

  /**
   * Construir el body de la petición
   */
  private buildBody(gateway: Gateway) {
    return {
      tipo: gateway.tipo,
      idProceso: gateway.idProceso
    };
  }

  /**
   * Crear Gateway
   */
  crear(gateway: Gateway): Promise<Gateway> {
    const body = this.buildBody(gateway);
    return axios.post<Gateway>(this.apiUrl, body)
      .then(response => response.data)
      .catch(error => this.handleError<Gateway>(error));
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
