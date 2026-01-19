export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface Skills {
  technical?: string[];
  soft?: string[];
  languages?: string[];
  tools?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface Resume {
  id?: string;
  userId?: string;
  title: string;
  templateStyle: 'professional' | 'modern' | 'minimal';
  targetRole: string;
  personalInfo: PersonalInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AISuggestion {
  id?: string;
  resumeId: string;
  section: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  applied: boolean;
  createdAt?: string;
}
