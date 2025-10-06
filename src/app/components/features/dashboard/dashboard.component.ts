import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1 class="dashboard-title">Dashboard</h1>
      
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="card-number">120</div>
            <div class="card-text">Total de profesionales registrados</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="card-number">8</div>
            <div class="card-text">Nuevos registros esta semana</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="card-number">32</div>
            <div class="card-text">Contactos enviados</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="card-specialty">Cirugía</div>
            <div class="card-text">Especialidad más buscada</div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="data-table-container">
        <div class="table-header"><h3 class="table-title">Últimos usuarios registrados</h3></div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha de registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Carlos García</td>
              <td>Médico</td>
              <td><span class="status-badge active">Activo</span></td>
              <td>15/03/2024</td>
              <td><button class="action-button">Ver Perfil</button></td>
            </tr>
            <tr>
              <td>Carlos Rodríguez</td>
              <td>Abogado</td>
              <td><span class="status-badge inactive">Inactivo</span></td>
              <td>08/01/2024</td>
              <td><button class="action-button">Ver Perfil</button></td>
            </tr>
            <tr>
              <td>María López</td>
              <td>Ingeniera</td>
              <td><span class="status-badge active">Activo</span></td>
              <td>17/11/2023</td>
              <td><button class="action-button">Ver Perfil</button></td>
            </tr>
            <tr>
              <td>Juan Martínez</td>
              <td>Arquitecto</td>
              <td><span class="status-badge active">Activo</span></td>
              <td>29/09/2023</td>
              <td><button class="action-button">Ver Perfil</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      background-color: #ffffff;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 2rem 0;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background-color: #3b82f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-content {
      flex: 1;
    }

    .card-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .card-specialty {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1;
    }

    .card-text {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .data-table-container {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .table-header { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
    .table-title { margin: 0; font-size: 1.1rem; color: #1f2937; font-weight: 600; }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background-color: #f9fafb;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }

    .data-table tbody tr:hover {
      background-color: #f9fafb;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-badge.inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .action-button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .action-button:hover {
      background-color: #2563eb;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .data-table-container {
        overflow-x: auto;
      }

      .data-table {
        min-width: 600px;
      }
    }
  `]
})
export class DashboardComponent {}
