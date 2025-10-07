import { Professional, ProfessionalProfile } from '../models/professional.model';

export function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

type ProfessionalWithId = Professional & { id: number; location: string; avatarUrl?: string; email?: string; phone?: string };

export const PROFESSIONALS: ProfessionalWithId[] = [
  {
    id: 1,
    name: 'Marcos García', initials: 'AG', specialty: 'Médico Cirujano',
    description: 'Especialista en cirugía general con amplia experiencia en procedimientos complejos.',
    skills: ['Cirugía', 'Emergencias', 'Diagnóstico'], experience: 8,
    location: 'Buenos Aires, Argentina', email: 'ana@example.com'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez', initials: 'CR', specialty: 'Abogado Corporativo',
    description: 'Experto en derecho mercantil y contratos internacionales.',
    skills: ['Contratos', 'Litigios', 'M&A'], experience: 12,
    location: 'CABA, Argentina', email: 'carlos@example.com'
  },
  {
    id: 3,
    name: 'María López', initials: 'ML', specialty: 'Ingeniera de Software',
    description: 'Desarrolladora full-stack especializada en aplicaciones web modernas.',
    skills: ['Angular', 'Node.js', 'AWS'], experience: 6,
    location: 'Córdoba, Argentina', email: 'maria@example.com'
  },
  {
    id: 4,
    name: 'Juan Martínez', initials: 'JM', specialty: 'Arquitecto',
    description: 'Diseño arquitectónico sostenible y proyectos de remodelación.',
    skills: ['AutoCAD', 'BIM', 'Sostenibilidad'], experience: 10,
    location: 'Mendoza, Argentina', email: 'juan@example.com'
  }
];

export function getProfileById(id: number): ProfessionalProfile | undefined {
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return undefined;
  return {
    id: p.id,
    name: p.name,
    specialty: p.specialty,
    description: p.description,
    location: p.location,
    avatarUrl: undefined,
    email: p.email,
    phone: p.phone,
    skills: p.skills,
    experienceYears: p.experience
  };
}


