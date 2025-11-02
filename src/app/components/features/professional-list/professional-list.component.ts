import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Professional, ProfessionalProfile } from '../../../models/professional.model';

@Component({
  selector: 'app-professional-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.css']
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
