import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private router: Router) {}

  irLogin() {
    this.router.navigate(['/login']);
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}
