import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <h1 class="title">Portal de Profesionales</h1>
      <nav class="menu">
        <a href="#" class="menu-item">Inicio</a>
        <a href="#" class="menu-item">Profesionales</a>
        <a href="#" class="menu-item">Servicios</a>
        <a href="#" class="menu-item">Contacto</a>
        <button class="logout-button" (click)="logout.emit()">Cerrar Sesión</button>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background-color: #1f4c85;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .menu {
      display: flex;
      gap: 2rem;
    }

    .menu-item {
      color: white;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .menu-item:hover {
      color: #4a90e2;
    }

    .logout-button {
      padding: 0.5rem 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .logout-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
}
