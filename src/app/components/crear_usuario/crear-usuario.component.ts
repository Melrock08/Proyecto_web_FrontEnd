import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html'
})
export class CrearUsuarioComponent {
  @Input() empresa?: Partial<Empresa>;

  usuario: Partial<Usuario> = {
    rolSistema: 'ADMIN'
  };

  contrasena = '';

  getUsuarioData(): Partial<Usuario> {
    return this.usuario;
  }

  getContrasena(): string {
    return this.contrasena;
  }
}

