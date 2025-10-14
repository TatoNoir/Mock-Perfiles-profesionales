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
  profile_picture?: string | null;
  email?: string;
  phone?: string;
  skills?: string[];
  experienceYears?: number;
  created_at?: string;
}
