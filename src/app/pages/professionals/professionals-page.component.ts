import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersPanelComponent } from '../../components/shared/search/filters-panel/filters-panel.component';
import { ProfessionalListComponent } from '../../components/features/professional-list/professional-list.component';
import { Router } from '@angular/router';
import { PROFESSIONALS } from '../../data/professionals.mock';

@Component({
  selector: 'app-professionals-page',
  standalone: true,
  imports: [CommonModule, FiltersPanelComponent, ProfessionalListComponent],
  template: `
    <div class="professionals-layout-single">
      <app-filters-panel (search)="onSearch($event)"></app-filters-panel>
      <app-professional-list [professionals]="filteredProfessionals" (selectProfessional)="goToDetail($event)"></app-professional-list>
    </div>
  `,
  styles: [`
    .professionals-layout-single { display: flex; flex-direction: column; gap: 1.5rem; }
  `]
})
export class ProfessionalsPageComponent {
  constructor(private router: Router) {}
  filteredProfessionals = PROFESSIONALS;
  onSearch(term: string) {
    const t = term.toLowerCase();
    this.filteredProfessionals = PROFESSIONALS.filter(p => p.name.toLowerCase().includes(t));
  }
  goToDetail(profile: { id?: number; name: string }) {
    const found = profile.id ?? PROFESSIONALS.find(p => p.name === profile.name)?.id ?? 0;
    this.router.navigate(['/profesionales', found]);
  }
}


