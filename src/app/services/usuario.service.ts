import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from, of } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { Login } from '../models/Login';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor() {}

  // Registrar nuevo usuario
  registrar(usuario: Usuario, contrasena: string): Observable<Usuario> {
    const body = { 
      nombre: usuario.nombre,
      correo: usuario.correo,
      rolSistema: usuario.rolSistema,
      contrasena: contrasena,
      empresa: usuario.empresa,
    };

    return from(
      axios.post<Usuario>(this.apiUrl, body).then(response => response.data)
    );
  }

  // Iniciar sesión
  login(credenciales: Login): Observable<Usuario> {
    return from(
      axios.post<Usuario>(`${this.apiUrl}/login`, credenciales).then(response => response.data)
    );
  }
}

