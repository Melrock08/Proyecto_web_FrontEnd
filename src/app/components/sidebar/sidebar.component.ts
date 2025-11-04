import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Output() elementoSeleccionado = new EventEmitter<string>();
  @Output() dragStartElemento = new EventEmitter<string>();

  sidebarVisible = true;

  elementos = [
    { nombre: 'Inicio', icono: '⚪', tipo: 'inicio' },
    { nombre: 'Actividad', icono: '⚙️', tipo: 'actividad' },
    { nombre: 'Gateway', icono: '⛓️', tipo: 'gateway' },
    { nombre: 'Fin', icono: '🔴', tipo: 'fin' },
  ];

  seleccionarElemento(tipo: string) {
    this.elementoSeleccionado.emit(tipo);
  }

  onDragStart(evt: DragEvent, tipo: string) {
  // Genera un id único en el cliente y lo manda por dataTransfer
  const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
    ? (crypto as any).randomUUID()
    : `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  evt.dataTransfer?.setData('application/x-elemento', tipo);
  evt.dataTransfer?.setData('application/x-node-id', id);

  // opcional: permitir una imagen de ghost
  // evt.dataTransfer?.setDragImage((evt.target as Element), 0, 0);
  this.dragStartElemento.emit(tipo);
}

}

