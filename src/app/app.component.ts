import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { SearchBarComponent } from './components/features/search/search-bar.component';
import { ProfessionalListComponent } from './components/features/professional-list/professional-list.component';
import { FiltersPanelComponent } from './components/features/search/filters-panel.component';
import { UsersComponent } from './components/features/users/users.component';
import { DashboardComponent } from './components/features/dashboard/dashboard.component';
import { ZonesComponent } from './components/features/zones/zones.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    SearchBarComponent,
    FiltersPanelComponent,
    ProfessionalListComponent,
    UsersComponent,
    DashboardComponent,
    ZonesComponent
  ],
  template: `
    <div class="app-container">
      <app-header (logout)="onLogout()"></app-header>
      <div class="main-layout">
        <app-sidebar (navigate)="onNavigate($event)"></app-sidebar>
        <main class="main-content">
          <ng-container [ngSwitch]="section">
            <ng-container *ngSwitchCase="'dashboard'">
              <app-dashboard></app-dashboard>
            </ng-container>
            <ng-container *ngSwitchCase="'profesionales'">
              <app-search-bar></app-search-bar>
              <app-filters-panel></app-filters-panel>
              <app-professional-list></app-professional-list>
            </ng-container>
            <ng-container *ngSwitchCase="'usuarios'">
              <app-users></app-users>
            </ng-container>
            <ng-container *ngSwitchCase="'zonas'">
              <app-zones></app-zones>
            </ng-container>
            <ng-container *ngSwitchCase="'actividades'">
              <div>Sección en construcción…</div>
            </ng-container>
            <ng-container *ngSwitchDefault>
              <app-dashboard></app-dashboard>
            </ng-container>
          </ng-container>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      padding: 2rem;
      overflow-y: auto;
      background-color: #ffffff;
    }

    @media (max-width: 768px) {
      .main-layout {
        grid-template-columns: 1fr;
      }

      app-sidebar {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  async onLogout() {
    console.log('Logout pulsado (autenticación deshabilitada)');
  }
  section: 'dashboard' | 'profesionales' | 'usuarios' | 'zonas' | 'actividades' = 'dashboard';
  onNavigate(s: 'dashboard' | 'profesionales' | 'usuarios' | 'zonas' | 'actividades') { this.section = s; }
}

