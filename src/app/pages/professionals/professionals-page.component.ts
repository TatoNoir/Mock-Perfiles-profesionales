import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/features/search/search-bar.component';
import { FiltersPanelComponent } from '../../components/features/search/filters-panel.component';
import { ProfessionalListComponent } from '../../components/features/professional-list/professional-list.component';
import { Router } from '@angular/router';
import { PROFESSIONALS } from '../../data/professionals.mock';

@Component({
  selector: 'app-professionals-page',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, FiltersPanelComponent, ProfessionalListComponent],
  template: `
    <app-search-bar></app-search-bar>
    <app-filters-panel></app-filters-panel>
    <app-professional-list (selectProfessional)="goToDetail($event)"></app-professional-list>
  `
})
export class ProfessionalsPageComponent {
  constructor(private router: Router) {}
  goToDetail(profile: { id?: number; name: string }) {
    const found = profile.id ?? PROFESSIONALS.find(p => p.name === profile.name)?.id ?? 0;
    this.router.navigate(['/profesionales', found]);
  }
}


