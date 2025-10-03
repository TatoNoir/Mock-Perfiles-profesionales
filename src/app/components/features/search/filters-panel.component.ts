import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="filters-card">
      <div class="filters-grid">
        <div class="filter-column">
          <div class="filter-group">
            <label class="filter-label">Ubicación</label>
            <input type="text" class="filter-input" placeholder="Ciudad">
          </div>
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
      </div>

      <div class="actions">
        <button class="apply-button">Buscar</button>
        <button class="clear-button">Limpiar</button>
      </div>
    </section>
  `,
  styles: [`
    .filters-card {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .filter-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (max-width: 1024px) {
      .filters-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .filters-grid { grid-template-columns: 1fr; }
    }

    .filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .filter-label { font-size: 0.875rem; color: #555; }
    .filter-select, .filter-input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.875rem; }
    .filter-select:focus, .filter-input:focus { outline: none; border-color: #4a90e2; }
    .checkbox-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; color: #555; font-size: 0.875rem; }

    .actions { margin-top: 2rem; display: flex; gap: 0.75rem; }
    .apply-button { padding: 0.6rem 1.25rem; background-color: #4a90e2; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    .apply-button:hover { background-color: #357abd; }
    .clear-button { padding: 0.6rem 1.25rem; background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer; }
    .clear-button:hover { background-color: #e5e7eb; }
  `]
})
export class FiltersPanelComponent {}


