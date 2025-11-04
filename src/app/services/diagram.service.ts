import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DiagramElement, DiagramConnection } from '../models/DiagramElement.model';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private elements = new BehaviorSubject<DiagramElement[]>([]);
  private connections = new BehaviorSubject<DiagramConnection[]>([]);
  
  elements$ = this.elements.asObservable();
  connections$ = this.connections.asObservable();

  addElement(element: DiagramElement) {
    const current = this.elements.value;
    this.elements.next([...current, element]);
  }

  updateElementPosition(id: string, x: number, y: number) {
    const current = this.elements.value;
    const updated = current.map(el => 
      el.id === id ? { ...el, x, y } : el
    );
    this.elements.next(updated);
  }

  addConnection(connection: DiagramConnection) {
    const current = this.connections.value;
    this.connections.next([...current, connection]);
  }

  removeElement(id: string) {
    const currentElements = this.elements.value.filter(el => el.id !== id);
    const currentConnections = this.connections.value.filter(
      conn => conn.sourceId !== id && conn.targetId !== id
    );
    
    this.elements.next(currentElements);
    this.connections.next(currentConnections);
  }
}