import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Empresa } from '../../models/Empresa';

@Component({
  selector: 'app-crear-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-empresa.component.html'
})
export class CrearEmpresaComponent {
  empresa: Partial<Empresa> = {
    nombreEmpresa: '',
    nit: '',
    correoContacto: ''
  };

  getData(): Partial<Empresa> {
    return this.empresa;
  }
}

