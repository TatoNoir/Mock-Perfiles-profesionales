import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalDetailComponent } from '../../components/features/professional-detail/professional-detail.component';
import { ProfessionalProfile } from '../../models/professional.model';
import { getProfileById } from '../../data/professionals.mock';

@Component({
  selector: 'app-professional-detail-page',
  standalone: true,
  imports: [CommonModule, ProfessionalDetailComponent],
  template: `
    <button class="back-btn" (click)="goBack()">← Volver</button>
    <app-professional-detail [profile]="profile"></app-professional-detail>
  `,
  styles: [`
    .back-btn { margin-bottom: 1rem; background: #1f4c85; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 0.9rem; cursor: pointer; }
  `]
})
export class ProfessionalDetailPageComponent {
  profile: ProfessionalProfile = { name: 'Profesional', specialty: 'Especialidad', description: 'Descripción', location: '—' };
  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(id)) {
      const profile = getProfileById(id);
      if (profile) this.profile = profile;
    }
  }
  goBack() { this.router.navigate(['/profesionales']); }
}


