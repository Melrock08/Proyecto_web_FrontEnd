import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuarioService } from '../../services/usuario.service';
import { Login } from '../../models/Login';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, FooterComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginData = new Login('', '');
  errorMsg: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMsg = null;

    this.usuarioService.login(this.loginData).subscribe({
      next: (usuario) => {
        console.log('Sesión iniciada:', usuario);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMsg = 'Credenciales incorrectas. Intente nuevamente.';
      }
    });
  }
}
