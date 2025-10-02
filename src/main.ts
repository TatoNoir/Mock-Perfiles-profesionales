import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { SearchBarComponent } from './components/search-bar.component';
import { ProfessionalListComponent } from './components/professional-list.component';
import { LoginComponent } from './components/login.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    SearchBarComponent,
    ProfessionalListComponent,
    LoginComponent
  ],
  template: `
    <div class="app-container" *ngIf="!isAuthenticated">
      <app-login></app-login>
    </div>

    <div class="app-container" *ngIf="isAuthenticated">
      <app-header (logout)="onLogout()"></app-header>
      <div class="main-layout">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <app-search-bar></app-search-bar>
          <app-professional-list></app-professional-list>
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
export class App implements OnInit {
  isAuthenticated = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.currentUser.subscribe(user => {
      this.isAuthenticated = user !== null;
    });
  }

  async onLogout() {
    try {
      await this.supabaseService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

bootstrapApplication(App);
