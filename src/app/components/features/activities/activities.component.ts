import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ActivityLevel = 'Básico' | 'Medio' | 'Avanzado';
type ActivityStatus = 'Activa' | 'Inactiva';

interface ActivityRow {
  category: string;
  activity: string;
  level: ActivityLevel;
  description: string;
  status: ActivityStatus;
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="activities">
      <h2 class="title">Actividades Profesionales</h2>

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
        <div class="field">
          <label>Nivel de especialización</label>
          <select [(ngModel)]="filters.level">
            <option value="">Cualquiera</option>
            <option *ngFor="let l of levels" [ngValue]="l">{{ l }}</option>
          </select>
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
              <th>Nivel</th>
              <th>Descripción breve</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows">
              <td>{{ row.category }}</td>
              <td>{{ row.activity }}</td>
              <td>{{ row.level }}</td>
              <td class="muted">{{ row.description }}</td>
              <td>
                <span class="badge" [class.green]="row.status==='Activa'" [class.gray]="row.status==='Inactiva'">{{ row.status }}</span>
              </td>
              <td class="row-actions">
                <button class="link" (click)="onEdit(row)">Editar</button>
                <button class="link danger" (click)="onDelete(row)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <button class="btn primary" (click)="onAdd()">Agregar Actividad</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .activities { display: grid; gap: 1.25rem; }
    .title { margin: 0; font-size: 1.5rem; font-weight: 600; color: #0f172a; }

    .filters { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.75rem; align-items: end; background: #fff; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 12px; }
    .field { display: grid; gap: 0.35rem; }
    label { color: #475569; font-size: 0.9rem; }
    select, input { height: 40px; padding: 0 0.75rem; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; color: #0f172a; }
    .actions { display: flex; justify-content: flex-end; }

    .table-card { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f8fafc; }
    th, td { text-align: left; padding: 0.9rem 1rem; border-bottom: 1px solid #f1f5f9; color: #111827; }
    .muted { color: #6b7280; }
    .row-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

    .badge { padding: 0.2rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
    .badge.green { background: #dcfce7; color: #166534; }
    .badge.gray { background: #e5e7eb; color: #374151; }

    .table-footer { padding: 0.9rem 1rem; display: flex; justify-content: flex-end; }
    .link { background: transparent; border: none; color: #1f4c85; cursor: pointer; }
    .link.danger { color: #b91c1c; }

    .btn { height: 40px; padding: 0 0.9rem; border: 1px solid transparent; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .btn.primary { background: #1f4c85; color: #fff; }

    @media (max-width: 1024px) {
      .filters { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class ActivitiesComponent {
  categories: string[] = ['Instalaciones', 'Mantenimiento', 'Jardinería'];
  levels: ActivityLevel[] = ['Básico', 'Medio', 'Avanzado'];
  filters = { category: '', activity: '', level: '' as '' | ActivityLevel };

  rows: ActivityRow[] = [
    { category: 'Instalaciones', activity: 'Electricísta', level: 'Avanzado', description: 'Instalación y reparación eléctrica', status: 'Activa' },
    { category: 'Mantenimiento', activity: 'Plomero', level: 'Medio', description: 'Reparaciones de caños y grifería', status: 'Activa' },
    { category: 'Jardinería', activity: 'Jardinero', level: 'Básico', description: 'Corte de césped y mantenimiento', status: 'Inactiva' }
  ];

  onSearch() {}
  onAdd() {}
  onEdit(_row: ActivityRow) {}
  onDelete(_row: ActivityRow) {}
}


