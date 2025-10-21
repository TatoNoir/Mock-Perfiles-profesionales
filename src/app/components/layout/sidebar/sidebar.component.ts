import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <nav class="menu">
        <a class="menu-item" routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </span>
          <span>Dashboard</span>
        </a>
        <!-- Temporalmente oculto
        <a class="menu-item" routerLink="/profesionales" routerLinkActive="active">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </span>
          <span>Profesionales</span>
        </a>
        -->
        <a class="menu-item" routerLink="/usuarios" routerLinkActive="active">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </span>
          <span>Usuarios</span>
        </a>
        <a class="menu-item" routerLink="/zonas" routerLinkActive="active">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
          </span>
          <span>Zonas</span>
        </a>
        <a class="menu-item" routerLink="/actividades" routerLinkActive="active">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </span>
          <span>Actividades</span>
        </a>
        <a class="menu-item" routerLink="/comentarios" routerLinkActive="active">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </span>
          <span>Comentarios</span>
        </a>
        <a class="menu-item" routerLink="/valoraciones" routerLinkActive="active">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </span>
          <span>Valoraciones</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar { background-color: #f8f9fa; padding: 1.25rem; height: 100%; color: #2d3748; border-right: 1px solid #e2e8f0; }
    .menu { display: flex; flex-direction: column; gap: 1rem; }
    .menu-item { display: flex; align-items: center; gap: 0.75rem; color: #2d3748; text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 1.1rem; transition: background-color 0.2s ease; }
    .icon { display: inline-flex; width: 20px; height: 20px; color: #2d3748; opacity: 0.8; }
    .menu-item:hover { background-color: #e2e8f0; }
    .menu-item.active { background-color: #cbd5e0; color: #1a202c; }
    .menu-item.active .icon { color: #1a202c; opacity: 1; }
  `]
})
export class SidebarComponent {
  // El estado activo ahora lo resuelve routerLinkActive
}
