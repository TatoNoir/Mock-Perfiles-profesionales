import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ZoneType = 'Urbana' | 'Suburbana' | 'Rural';

interface ZoneRow {
  country: string;
  province: string;
  city: string;
  postalCode: string;
  neighborhood: string;
  type: ZoneType;
  flag?: string; // emoji or small icon
}

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="zones">
      <h2 class="title">Zonas</h2>

      <div class="filters">
        <div class="field">
          <label>País</label>
          <select [(ngModel)]="filters.country" disabled>
            <option>Argentinanía</option>
          </select>
        </div>
        <div class="field">
          <label>Provincia</label>
          <select [(ngModel)]="filters.province">
            <option value="">Localidad</option>
          </select>
        </div>
        <div class="field">
          <label>Localidad</label>
          <select [(ngModel)]="filters.city">
            <option value="">Localidad</option>
          </select>
        </div>
        <div class="field">
          <label>Código Postal</label>
          <input type="text" [(ngModel)]="filters.postalCode" placeholder="" />
        </div>
        <div class="actions">
          <button class="btn primary" (click)="onSearch()">Buscar</button>
        </div>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>País</th>
              <th>Provincia / Estado</th>
              <th>Localidad</th>
              <th>CP</th>
              <th>Zona / Barrio</th>
              <th>Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows">
              <td>
                <span class="flag" aria-hidden="true">{{ row.flag }}</span>
                {{ row.country }}
              </td>
              <td>{{ row.province }}</td>
              <td>{{ row.city }}</td>
              <td>{{ row.postalCode }}</td>
              <td>{{ row.neighborhood }}</td>
              <td>{{ row.type }}</td>
              <td class="row-actions">
                <button class="btn ghost" (click)="onEdit(row)">Editar</button>
                <button class="btn danger ghost" *ngIf="row.country==='CMX'" (click)="onDelete(row)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <button class="btn primary" (click)="onAdd()">Agregar Zona</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .zones { display: grid; gap: 1.25rem; }
    .title { margin: 0; font-size: 1.5rem; font-weight: 600; color: #0f172a; }

    .filters { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)) auto; gap: 0.75rem; align-items: end; background: #fff; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 12px; }
    .field { display: grid; gap: 0.35rem; }
    label { color: #475569; font-size: 0.9rem; }
    select, input { height: 40px; padding: 0 0.75rem; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; color: #0f172a; }
    .actions { display: flex; justify-content: flex-end; }

    .table-card { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f8fafc; }
    th, td { text-align: left; padding: 0.9rem 1rem; border-bottom: 1px solid #f1f5f9; color: #111827; }
    .flag { margin-right: 0.5rem; }
    .row-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }

    .table-footer { padding: 0.9rem 1rem; display: flex; justify-content: flex-end; }

    .btn { height: 40px; padding: 0 0.9rem; border: 1px solid transparent; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .btn.primary { background: #1f4c85; color: #fff; }
    .btn.ghost { background: transparent; border-color: #e5e7eb; color: #1f2937; }
    .btn.danger { color: #b91c1c; border-color: #fecaca; }
    .btn.danger.ghost:hover { background: #fee2e2; }

    @media (max-width: 1024px) {
      .filters { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class ZonesComponent {
  filters = { country: 'Argentinanía', province: '', city: '', postalCode: '' };
  rows: ZoneRow[] = [
    { flag: '🇦🇷', country: 'Argentin', province: 'Buenos Aires', city: 'La Plata', postalCode: '1900', neighborhood: 'Microcentro', type: 'Urbana' },
    { flag: '🇲🇽', country: 'CMX', province: 'CDMX', city: 'Coyoacán', postalCode: '04100', neighborhood: 'Roma Sur', type: 'Suburbana' },
    { flag: '🇨🇱', country: 'Chile', province: 'Región Metropolitana', city: 'Santiago', postalCode: '8320000', neighborhood: 'Ñuñoa', type: 'Urbana' }
  ];

  onSearch() {}
  onAdd() {}
  onEdit(_row: ZoneRow) {}
  onDelete(_row: ZoneRow) {}
}


