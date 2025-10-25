import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class App {
  protected readonly title = signal('Proyecto_Web_Front');
}

