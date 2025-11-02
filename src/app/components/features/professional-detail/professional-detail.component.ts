import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalProfile } from '../../../models/professional.model';

@Component({
  selector: 'app-professional-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-detail.component.html',
  styleUrls: ['./professional-detail.component.css']
})
export class ProfessionalDetailComponent {
  @Input() profile?: ProfessionalProfile;
}


