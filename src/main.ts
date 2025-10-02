import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { SearchBarComponent } from './components/search-bar.component';
import { ProfessionalListComponent } from './components/professional-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    SearchBarComponent,
    ProfessionalListComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
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
export class App {}

bootstrapApplication(App);
