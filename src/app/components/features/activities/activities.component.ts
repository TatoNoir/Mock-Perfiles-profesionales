import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ActivityStatus = 'Activa' | 'Inactiva';

interface ActivityRow {
  category: string;
  activity: string;
  description: string;
  status: ActivityStatus;
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="activities">
      <h2 class="title"><svg class="title-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></svg><span>Actividades Profesionales</span></h2>

      <div class="filters">
        <div class="field">
          <label>Categoría</label>
          <select [(ngModel)]="filters.category">
            <option value="">Todas</option>
            <option *ngFor="let c of categories" [ngValue]="c">{{ c }}</option>
          </select>
        </div>
        <div class="field">
          <label>Actividad</label>
          <input type="text" [(ngModel)]="filters.activity" placeholder="Electricista" />
        </div>
        <div class="actions">
          <button class="btn primary" (click)="onSearch()">Buscar</button>
        </div>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Actividad</th>
              <th>Descripción breve</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows">
              <td>{{ row.category }}</td>
              <td>{{ row.activity }}</td>
              <td class="muted">{{ row.description }}</td>
              <td>
                <span class="badge" [class.green]="row.status==='Activa'" [class.gray]="row.status==='Inactiva'">{{ row.status }}</span>
              </td>
              <td class="row-actions">
                <button class="link" (click)="onEdit(row)">
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm14.71-9.04a1 1 0 0 0 0-1.41l-1.51-1.51a1 1 0 0 0-1.41 0l-1.12 1.12 3.75 3.75 1.29-1.29z"></path></svg>
                  <span>Editar</span>
                </button>
                <button class="link danger" (click)="onDelete(row)">
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 1h4v2H4V5h4l1-1z"></path></svg>
                  <span>Eliminar</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <button class="btn primary" (click)="onAdd()">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"></path></svg>
            <span>Agregar Actividad</span>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .activities { display: grid; gap: 1.25rem; }
    .title { margin: 0; font-size: 1.5rem; font-weight: 600; color: #0f172a; display: inline-flex; align-items: center; gap: 0.5rem; }
    .title-icon { width: 22px; height: 22px; fill: currentColor; }

    .filters { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.75rem; align-items: end; background: #fff; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 12px; }
    .field { display: grid; gap: 0.35rem; }
    label { color: #475569; font-size: 0.9rem; }
    select, input { height: 40px; padding: 0 0.75rem; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; color: #0f172a; }
    .actions { display: flex; justify-content: flex-end; }

    .table-card { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f8fafc; }
    th, td { text-align: left; padding: 0.9rem 1rem; border-bottom: 1px solid #f1f5f9; color: #111827; }
    .muted { color: #6b7280; }
    .row-actions { display: flex; gap: 0.75rem; justify-content: flex-start; }

    .badge { padding: 0.2rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
    .badge.green { background: #dcfce7; color: #166534; }
    .badge.gray { background: #e5e7eb; color: #374151; }

    .table-footer { padding: 0.9rem 1rem; display: flex; justify-content: flex-end; }
    .link { background: transparent; border: none; color: #1f4c85; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; }
    .link.danger { color: #b91c1c; }

    .btn { height: 40px; padding: 0 0.9rem; border: 1px solid transparent; border-radius: 10px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn.primary { background: #1f4c85; color: #fff; }

    .icon { width: 16px; height: 16px; fill: currentColor; }

    @media (max-width: 1024px) {
      .filters { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class ActivitiesComponent {
  categories: string[] = ['Instalaciones', 'Mantenimiento', 'Jardinería'];
  filters = { category: '', activity: '' };

  rows: ActivityRow[] = [
    { category: 'Instalaciones', activity: 'Electricísta', description: 'Instalación y reparación eléctrica', status: 'Activa' },
    { category: 'Mantenimiento', activity: 'Plomero', description: 'Reparaciones de caños y grifería', status: 'Activa' },
    { category: 'Jardinería', activity: 'Jardinero', description: 'Corte de césped y mantenimiento', status: 'Inactiva' }
  ];

  onSearch() {}
  onAdd() {}
  onEdit(_row: ActivityRow) {}
  onDelete(_row: ActivityRow) {}
}


