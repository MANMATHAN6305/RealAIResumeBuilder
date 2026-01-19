import apiRequest from './api';
import { Resume } from '../types/resume';

/**
 * Save resume data to MySQL backend via Express API
 */
export async function saveResumeForUser(userId: string, resume: Resume): Promise<void> {
  try {
    await apiRequest('/resume', {
      method: 'POST',
      body: JSON.stringify({
        title: resume.title,
        templateStyle: resume.templateStyle,
        targetRole: resume.targetRole,
        personalInfo: resume.personalInfo,
        professionalSummary: resume.professionalSummary,
        workExperience: resume.workExperience,
        education: resume.education,
        skills: resume.skills,
        certifications: resume.certifications,
        projects: resume.projects,
      }),
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
}

/**
 * Load resume data from MySQL backend via Express API
 */
export async function loadResumeForUser(userId: string): Promise<Resume | null> {
  try {
    const resumeData = await apiRequest<Resume>('/resume');
    return resumeData;
  } catch (error: any) {
    // 404 means no resume exists yet, which is fine
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      return null;
    }
    console.error('Error loading resume:', error);
    return null;
  }
}

/**
 * Delete resume for a user
 */
export async function deleteResumeForUser(userId: string): Promise<void> {
  try {
    await apiRequest('/resume', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}
