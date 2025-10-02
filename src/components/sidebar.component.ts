import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <div class="filters-section">

        <div class="filter-group">
          <label class="filter-label">Especialidad/Rubro</label>
          <select class="filter-select">
            <option value="">Todas</option>
            <option value="medico">Médico</option>
            <option value="abogado">Abogado</option>
            <option value="ingeniero">Ingeniero</option>
            <option value="arquitecto">Arquitecto</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Experiencia</label>
          <select class="filter-select">
            <option value="">Cualquiera</option>
            <option value="junior">0-2 años</option>
            <option value="mid">3-5 años</option>
            <option value="senior">5+ años</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Ubicación</label>
          <input type="text" class="filter-input" placeholder="Ciudad">
        </div>

        <div class="filter-group">
          <label class="filter-label">Disponibilidad</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox">
              <span>Inmediata</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox">
              <span>Esta semana</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox">
              <span>Este mes</span>
            </label>
          </div>
        </div>

        <button class="apply-button">Aplicar Filtros</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      background-color: #f8f9fa;
      padding: 1.5rem;
      height: 100%;
      border-right: 1px solid #e0e0e0;
    }

    .filters-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .filters-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
    }

    .filter-select,
    .filter-input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      background-color: white;
    }

    .filter-select:focus,
    .filter-input:focus {
      outline: none;
      border-color: #4a90e2;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #555;
      cursor: pointer;
    }

    .checkbox {
      cursor: pointer;
    }

    .apply-button {
      padding: 0.75rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .apply-button:hover {
      background-color: #357abd;
    }
  `]
})
export class SidebarComponent {}
