import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent],
  templateUrl: './register.component.html'
})
export class RegistroComponent {
  usuario = new Usuario(0, '', '', 'USUARIO');
  contrasena: string = '';
  mensaje: string | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onRegistrar() {
    this.usuarioService.registrar(this.usuario, this.contrasena).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.mensaje = 'Registro exitoso. Ya puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Ocurrió un error al registrar. Inténtalo de nuevo.';
      }
    });
  }
}
