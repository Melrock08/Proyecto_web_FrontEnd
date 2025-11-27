import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CrearEmpresaComponent } from '../../components/crear_empresa/crear-empresa.component';
import { CrearUsuarioComponent } from '../../components/crear_usuario/crear-usuario.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { EmpresaService } from '../../services/empresa.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registrar-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CrearEmpresaComponent, CrearUsuarioComponent, FooterComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  @ViewChild(CrearEmpresaComponent) crearEmpresaComp!: CrearEmpresaComponent;
  @ViewChild(CrearUsuarioComponent) crearUsuarioComp!: CrearUsuarioComponent;

  mensaje = '';
  cargando = false;

  constructor(
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

// src/.../register.component.ts (modificar onRegistrar)
onRegistrar() {
  if (!this.crearEmpresaComp || !this.crearUsuarioComp) {
    this.mensaje = 'Componentes no inicializados.';
    return;
  }

  const empresaData = this.crearEmpresaComp.getData();
  const usuarioData = this.crearUsuarioComp.getUsuarioData();
  const contrasena = this.crearUsuarioComp.getContrasena();

  this.cargando = true;
  this.empresaService.crearEmpresa(empresaData as any).subscribe({
    next: (empresaCreada) => {
      // En vez de enviar solo idEmpresa, incorporamos el objeto empresa creado en el payload
      const usuarioPayload = {
        nombre: usuarioData.nombre,
        correo: usuarioData.correo,
        contrasena: contrasena,
        rolSistema: usuarioData.rolSistema ?? 'ADMIN',
        empresa: {
          nombreEmpresa: empresaCreada.nombreEmpresa ?? empresaCreada.nombreEmpresa,
          nit: empresaCreada.nit,
          correoContacto: empresaCreada.correoContacto
        }
      };

      this.usuarioService.registrar(usuarioPayload as any).subscribe({
        next: () => {
          this.mensaje = 'Registro completado correctamente.';
          this.cargando = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.mensaje = 'Error al registrar el usuario.';
          this.cargando = false;
        }
      });
    },
    error: (err) => {
      console.error(err);
      this.mensaje = 'Error al crear la empresa.';
      this.cargando = false;
    }
  });
}

}
 