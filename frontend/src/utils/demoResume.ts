import { Resume } from '../types/resume';

export const getEmptyResume = (): Resume => ({
  title: 'My Resume',
  templateStyle: 'professional',
  targetRole: '',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  professionalSummary: '',
  workExperience: [],
  education: [],
  skills: {},
  certifications: [],
  projects: [],
});

export const getDemoResume = (): Resume => ({
  title: 'Senior Frontend Engineer',
  templateStyle: 'modern',
  targetRole: 'Frontend Engineer',
  personalInfo: {
    fullName: 'Avery Johnson',
    email: 'avery.johnson@example.com',
    phone: '+1 (555) 213-8899',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/averyjohnson',
    website: 'avery.dev',
  },
  professionalSummary:
    'Frontend engineer with 7+ years building fast, accessible web apps. Led design system adoption, improved Lighthouse scores by 30%, and shipped AI-powered resume tooling used by 50k+ users.',
  workExperience: [
    {
      id: 'exp-1',
      company: 'Nimbus Labs',
      position: 'Senior Frontend Engineer',
      location: 'Remote',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      achievements: [
        'Redesigned resume builder UI, increasing conversion by 18% and reducing time-to-first-export by 35%',
        'Implemented component library with Storybook and Vite, cutting new feature delivery time by 25%'
      ],
    },
    {
      id: 'exp-2',
      company: 'Brightview',
      position: 'Frontend Engineer',
      location: 'Seattle, WA',
      startDate: '2018',
      endDate: '2021',
      current: false,
      achievements: [
        'Built collaborative document editor with CRDT-based syncing for 10k monthly active users',
        'Optimized critical user journeys, improving Core Web Vitals (LCP) from 3.1s to 1.5s'
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Washington',
      degree: 'B.S.',
      field: 'Computer Science',
      location: 'Seattle, WA',
      graduationDate: '2018',
      gpa: '3.7'
    },
  ],
  skills: {
    technical: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind', 'Playwright'],
    tools: ['Vite', 'Storybook', 'Jest', 'GitHub Actions'],
    languages: ['English', 'Spanish'],
    soft: ['Product thinking', 'Mentoring', 'System design'],
  },
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023',
      expiryDate: '2026',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'AI Resume Builder',
      description: 'Full-stack resume builder with AI suggestions, PDF export, and template switching.',
      technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'MySQL'],
      link: 'https://github.com/avery/resume-builder',
      highlights: [
        'Designed scalable component architecture with reusable UI primitives',
        'Integrated AI-based resume critique delivering 25% faster editing'
      ],
    },
  ],
});
