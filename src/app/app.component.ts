import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { ProfessionalProfile } from './models/professional.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    RouterOutlet
  ],
  template: `
    <ng-container *ngIf="!isAuthRoute; else authLayout">
      <div class="app-container">
        <app-header (logout)="onLogout()"></app-header>
        <div class="main-layout">
          <app-sidebar></app-sidebar>
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </ng-container>

    <ng-template #authLayout>
      <router-outlet></router-outlet>
    </ng-template>
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
  constructor(private router: Router) {}
  async onLogout() {
    console.log('Logout pulsado (autenticación deshabilitada)');
  }
  get isAuthRoute(): boolean {
    return this.router.url.startsWith('/login');
  }
}

