import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type User = {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'activo' | 'inactivo';
  lastAccess: string; // ISO or formatted
  createdAt: string;  // ISO or formatted
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="users">
      <h2 class="title">Usuarios</h2>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.name }}</td>
              <td class="muted">{{ u.email }}</td>
              <td>
                <span class="badge" [class.badge-admin]="u.role==='admin'" [class.badge-editor]="u.role==='editor'" [class.badge-viewer]="u.role==='viewer'">{{ u.role }}</span>
              </td>
              <td>
                <span class="status" [class.online]="u.status==='activo'" [class.offline]="u.status==='inactivo'">{{ u.status }}</span>
              </td>
              <td class="muted">{{ u.lastAccess }}</td>
              <td class="muted">{{ u.createdAt }}</td>
              <td class="actions">
                <button class="btn">Ver</button>
                <button class="btn btn-secondary">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .users { display: flex; flex-direction: column; gap: 1rem; }
    .title { margin: 0; font-size: 1.5rem; font-weight: 600; color: #1f2937; }
    .table-wrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    thead { background: #f9fafb; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
    th { font-weight: 600; color: #374151; font-size: 0.9rem; }
    td { color: #374151; font-size: 0.95rem; }
    .muted { color: #6b7280; }
    .actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .btn { padding: 0.35rem 0.8rem; background: #4a90e2; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
    .btn:hover { background: #357abd; }
    .btn-secondary { background: #eef2f7; color: #1f2937; }
    .btn-secondary:hover { background: #e5e7eb; }
    .badge { padding: 0.2rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; text-transform: capitalize; }
    .badge-admin { background: #fee2e2; color: #991b1b; }
    .badge-editor { background: #e0e7ff; color: #3730a3; }
    .badge-viewer { background: #dcfce7; color: #166534; }
    .status { text-transform: capitalize; }
    .online { color: #16a34a; }
    .offline { color: #b91c1c; }
  `]
})
export class UsersComponent {
  users: User[] = [
    { name: 'Ana García', email: 'ana@example.com', role: 'admin', status: 'activo', lastAccess: '2025-10-03 11:20', createdAt: '2024-06-12' },
    { name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'editor', status: 'activo', lastAccess: '2025-10-02 18:04', createdAt: '2024-08-01' },
    { name: 'María López', email: 'maria@example.com', role: 'viewer', status: 'inactivo', lastAccess: '2025-08-21 09:11', createdAt: '2023-12-05' },
    { name: 'Juan Martínez', email: 'juan@example.com', role: 'viewer', status: 'activo', lastAccess: '2025-10-01 22:15', createdAt: '2024-02-19' }
  ];
}


