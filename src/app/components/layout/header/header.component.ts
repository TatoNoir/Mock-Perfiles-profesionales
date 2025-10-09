import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="brand">
        <div class="logo-container">
          <img src="assets/images/logo.png" alt="Portal de Profesionales" class="logo" />
        </div>
        <h1 class="title">Portal de Profesionales</h1>
      </div>
      <div class="actions">
        <div class="avatar" (click)="toggleDropdown()">MP</div>
        <div class="dropdown" *ngIf="dropdownOpen">
          <button class="dropdown-item" (click)="onMisDatos()">Mis Datos</button>
          <button class="dropdown-item" (click)="onConfiguracion()">Configuración</button>
          <button class="dropdown-item" (click)="onTema()">Tema</button>
          <div class="divider"></div>
          <button class="dropdown-item danger" (click)="logout.emit()">Cerrar Sesión</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #1f4c85;
      color: white;
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      min-height: 80px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70px;
      width: auto;
      padding: 8px;
      background: white;
    }

    .logo {
      height: 65px;
      width: auto;
      object-fit: contain;
      object-position: center;
      transition: transform 0.2s ease;
      background: transparent;
      border: none;
      outline: none;
      display: block;
      filter: none;
      mix-blend-mode: normal;
      opacity: 1;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .brand {
        gap: 0.5rem;
      }
      
      .logo-container {
        height: 60px;
        padding: 6px;
      }
      
      .logo {
        height: 55px;
      }
      
      .title {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .title {
        display: none;
      }
      
      .logo-container {
        height: 55px;
        padding: 5px;
      }
      
      .logo {
        height: 50px;
      }
    }

    .actions { position: relative; display: flex; align-items: center; }
    .avatar { width: 36px; height: 36px; border-radius: 9999px; background: #4a90e2; display: flex; align-items: center; justify-content: center; font-weight: 700; letter-spacing: 0.02em; cursor: pointer; box-shadow: 0 0 0 2px rgba(255,255,255,0.3) inset; }
    .dropdown { position: absolute; right: 0; top: 48px; background: #ffffff; color: #111827; min-width: 200px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.18); padding: 0.5rem; border: 1px solid #e5e7eb; }
    .dropdown-item { width: 100%; text-align: left; padding: 0.5rem 0.75rem; background: transparent; border: none; border-radius: 6px; cursor: pointer; font-size: 0.95rem; color: #111827; }
    .dropdown-item:hover { background: #f3f4f6; }
    .dropdown-item.danger { color: #b91c1c; }
    .dropdown-item.danger:hover { background: #fee2e2; }
    .divider { height: 1px; background: #e5e7eb; margin: 0.25rem 0.5rem; }
  `]
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
  dropdownOpen = false;

  toggleDropdown() { this.dropdownOpen = !this.dropdownOpen; }
  onMisDatos() { 
    this.dropdownOpen = false; 
    this.router.navigateByUrl('/mis-datos');
  }
  onConfiguracion() {
    this.dropdownOpen = false;
    this.router.navigateByUrl('/configuracion');
  }
  onTema() { this.dropdownOpen = false; }

  constructor(private router: Router) {}
}
