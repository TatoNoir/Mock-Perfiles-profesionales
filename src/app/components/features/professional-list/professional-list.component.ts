import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Professional, ProfessionalProfile } from '../../../models/professional.model';

@Component({
  selector: 'app-professional-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="professional-list">
      <h2 class="list-title">Profesionales Disponibles</h2>
        <div class="professionals-grid">
        <div class="professional-card" *ngFor="let professional of professionals" (click)="onSelect(professional)">
          <div class="card-header">
            <div class="avatar">{{ professional.initials }}</div>
            <div class="info">
              <h3 class="name">{{ professional.name }}</h3>
              <p class="specialty">{{ professional.specialty }}</p>
            </div>
          </div>
          <div class="card-body">
            <p class="description">{{ professional.description }}</p>
            <div class="tags">
              <span class="tag" *ngFor="let skill of professional.skills">{{ skill }}</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="experience">{{ professional.experience }} años exp.</span>
            <button class="contact-button" (click)="$event.stopPropagation()">Contactar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .professional-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .list-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    .professionals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .professional-card {
      background-color: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: box-shadow 0.3s ease;
      cursor: pointer;
    }

    .professional-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #4a90e2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .info {
      flex: 1;
    }

    .name {
      margin: 0 0 0.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
    }

    .specialty {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .description {
      margin: 0;
      font-size: 0.875rem;
      color: #555;
      line-height: 1.5;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .experience {
      font-size: 0.875rem;
      color: #666;
    }

    .contact-button {
      padding: 0.5rem 1rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .contact-button:hover {
      background-color: #357abd;
    }
    .back-btn { margin-bottom: 1rem; background: #1f4c85; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 0.9rem; cursor: pointer; }
  `]
})
export class ProfessionalListComponent {
  @Output() selectProfessional = new EventEmitter<ProfessionalProfile>();
  onSelect(p: Professional) { this.selectProfessional.emit(this.toProfile(p)); }
  toProfile(p: Professional): ProfessionalProfile {
    return {
      id: p.id,
      name: p.name,
      specialty: p.specialty,
      description: p.description,
      location: '—',
      skills: p.skills,
      experienceYears: p.experience
    };
  }
  @Input() professionals: Professional[] = [
    {
      id: 1,
      name: 'Carlos García',
      initials: 'AG',
      specialty: 'Médico Cirujano',
      description: 'Especialista en cirugía general con amplia experiencia en procedimientos complejos.',
      skills: ['Cirugía', 'Emergencias', 'Diagnóstico'],
      experience: 8
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      initials: 'CR',
      specialty: 'Abogado Corporativo',
      description: 'Experto en derecho mercantil y contratos internacionales.',
      skills: ['Contratos', 'Litigios', 'M&A'],
      experience: 12
    },
    {
      id: 3,
      name: 'María López',
      initials: 'ML',
      specialty: 'Ingeniera de Software',
      description: 'Desarrolladora full-stack especializada en aplicaciones web modernas.',
      skills: ['Angular', 'Node.js', 'AWS'],
      experience: 6
    },
    {
      id: 4,
      name: 'Juan Martínez',
      initials: 'JM',
      specialty: 'Arquitecto',
      description: 'Diseño arquitectónico sostenible y proyectos de remodelación.',
      skills: ['AutoCAD', 'BIM', 'Sostenibilidad'],
      experience: 10
    }
  ];
}
