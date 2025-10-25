import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Proceso } from '../models/Proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private readonly apiUrl = 'http://localhost:8080/api/procesos';

  // obtener todos los procesos
  getProcesos(): Observable<Proceso[]> {
    return from(axios.get<Proceso[]>(this.apiUrl)).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // obtener procesos por empresa
  getProcesosPorEmpresa(idEmpresa: number): Observable<Proceso[]> {
    return from(axios.get<Proceso[]>(`${this.apiUrl}/empresa/${idEmpresa}`)).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  // crear proceso
  crearProceso(proceso: Proceso): Observable<Proceso> {
    return from(axios.post<Proceso>(this.apiUrl, proceso)).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  // editar proceso
  editarProceso(id: number, proceso: Proceso): Observable<Proceso> {
    return from(axios.put<Proceso>(`${this.apiUrl}/${id}`, proceso)).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  // obtener proceso por ID
  getProceso(id: number): Observable<Proceso> {
    return from(axios.get<Proceso>(`${this.apiUrl}/${id}`)).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  // 💥 Manejo centralizado de errores
  private handleError(error: AxiosError) {
    const msg = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error('Error HTTP:', msg);
    return throwError(() => new Error('Error en la petición HTTP.'));
  }
}
