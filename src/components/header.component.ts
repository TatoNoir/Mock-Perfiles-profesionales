import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <h1 class="title">Perfiles Profesionales</h1>
      <nav class="menu">
        <a href="#" class="menu-item">Inicio</a>
        <a href="#" class="menu-item">Profesionales</a>
        <a href="#" class="menu-item">Servicios</a>
        <a href="#" class="menu-item">Zonas</a>
        <a href="#" class="menu-item">Usuarios</a>
        <a href="#" class="menu-item">Contacto</a>
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
  `]
})
export class HeaderComponent {}
