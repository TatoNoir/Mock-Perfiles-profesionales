export interface Professional {
  id?: number;
  name: string;
  initials: string;
  specialty: string;
  description: string;
  skills: string[];
  experience: number;
}

export interface ProfessionalProfile {
  id?: number;
  name: string;
  specialty: string;
  description: string;
  location: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experienceYears?: number;
}
