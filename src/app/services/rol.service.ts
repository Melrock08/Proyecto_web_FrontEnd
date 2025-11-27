import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Rol } from '../models/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private readonly apiUrl = 'http://localhost:8080/api/rol';

  constructor() {}

  /**
   * Crear nuevo rol
   */
  crear(rol: Rol): Promise<Rol> {
    const body = this.buildBody(rol);
    return axios.post<Rol>(this.apiUrl, body)
      .then(response => response.data)
      .catch(error => this.handleError<Rol>(error));
  }

  /**
   * Obtener todos los roles
   */
  getAll(): Promise<Rol[]> {
    return axios.get<Rol[]>(this.apiUrl)
      .then(response => response.data)
      .catch(error => this.handleError<Rol[]>(error));
  }

  /**
   * 🧩 Construir body de la petición
   */
  private buildBody(rol: Rol) {
    return {
      nombre: rol.nombre,
      descripcion: rol.descripcion
      // NOTA: idRol NO se envía en creación (solo lo manda el back)
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
