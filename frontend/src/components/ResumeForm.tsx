import { Plus, Trash2 } from 'lucide-react';
import { Resume, WorkExperience, Education, Project, Certification } from '../types/resume';

interface ResumeFormProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

export default function ResumeForm({ resume, onChange }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...resume,
      personalInfo: { ...resume.personalInfo, [field]: value }
    });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: ['']
    };
    onChange({ ...resume, workExperience: [...resume.workExperience, newExp] });
  };

  const updateWorkExperience = (index: number, field: string, value: string | boolean | string[]) => {
    const updated = [...resume.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, workExperience: updated });
  };

  const removeWorkExperience = (index: number) => {
    onChange({
      ...resume,
      workExperience: resume.workExperience.filter((_, i) => i !== index)
    });
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...resume.workExperience];
    updated[expIndex].achievements.push('');
    onChange({ ...resume, workExperience: updated });
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...resume.workExperience];
    updated[expIndex].achievements[achIndex] = value;
    onChange({ ...resume, workExperience: updated });
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...resume.workExperience];
    updated[expIndex].achievements = updated[expIndex].achievements.filter((_, i) => i !== achIndex);
    onChange({ ...resume, workExperience: updated });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    onChange({ ...resume, education: [...resume.education, newEdu] });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...resume,
      education: resume.education.filter((_, i) => i !== index)
    });
  };

  const updateSkills = (category: string, value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    onChange({
      ...resume,
      skills: { ...resume.skills, [category]: skills }
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      highlights: ['']
    };
    onChange({ ...resume, projects: [...resume.projects, newProject] });
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    const updated = [...resume.projects];
    if (field === 'technologies' && typeof value === 'string') {
      updated[index] = { ...updated[index], [field]: value.split(',').map(s => s.trim()).filter(s => s) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange({ ...resume, projects: updated });
  };

  const removeProject = (index: number) => {
    onChange({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: ''
    };
    onChange({ ...resume, certifications: [...resume.certifications, newCert] });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...resume.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...resume, certifications: updated });
  };

  const removeCertification = (index: number) => {
    onChange({
      ...resume,
      certifications: resume.certifications.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      <section className="panel-3d">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={resume.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            value={resume.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={resume.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            value={resume.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="LinkedIn (optional)"
            value={resume.personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Website (optional)"
            value={resume.personalInfo.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </section>

      <section className="panel-3d">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Professional Summary</h2>
        <textarea
          placeholder="Write a compelling summary highlighting your key achievements and value proposition..."
          value={resume.professionalSummary}
          onChange={(e) => onChange({ ...resume, professionalSummary: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </section>

      <section className="panel-3d">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
          <button
            onClick={addWorkExperience}
            className="btn-3d flex items-center gap-2 px-4 py-2"
          >
            <Plus size={18} />
            Add Experience
          </button>
        </div>
        {resume.workExperience.map((exp, expIndex) => (
          <div
            key={exp.id}
            className="mb-6 p-4 rounded-xl border border-slate-200/70 bg-white/70 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Experience {expIndex + 1}</h3>
              <button
                onClick={() => removeWorkExperience(expIndex)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Position"
                value={exp.position}
                onChange={(e) => updateWorkExperience(expIndex, 'position', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateWorkExperience(expIndex, 'company', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location"
                value={exp.location}
                onChange={(e) => updateWorkExperience(expIndex, 'location', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateWorkExperience(expIndex, 'startDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateWorkExperience(expIndex, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateWorkExperience(expIndex, 'current', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Currently working here</span>
            </label>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Key Achievements</label>
                <button
                  onClick={() => addAchievement(expIndex)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Achievement
                </button>
              </div>
              {exp.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Start with an action verb and include quantifiable results..."
                    value={achievement}
                    onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {exp.achievements.length > 1 && (
                    <button
                      onClick={() => removeAchievement(expIndex, achIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="panel-3d">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Education</h2>
          <button
            onClick={addEducation}
            className="btn-3d flex items-center gap-2 px-4 py-2"
          >
            <Plus size={18} />
            Add Education
          </button>
        </div>
        {resume.education.map((edu, index) => (
          <div
            key={edu.id}
            className="mb-4 p-4 rounded-xl border border-slate-200/70 bg-white/70 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Education {index + 1}</h3>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Location"
                value={edu.location}
                onChange={(e) => updateEducation(index, 'location', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Graduation Date"
                value={edu.graduationDate}
                onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </section>

      <section className="panel-3d">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technical Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="JavaScript, Python, React, Node.js..."
              value={resume.skills.technical?.join(', ') || ''}
              onChange={(e) => updateSkills('technical', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tools & Platforms (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Git, Docker, AWS, MongoDB..."
              value={resume.skills.tools?.join(', ') || ''}
              onChange={(e) => updateSkills('tools', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soft Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Leadership, Communication, Problem-solving..."
              value={resume.skills.soft?.join(', ') || ''}
              onChange={(e) => updateSkills('soft', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages (comma-separated)
            </label>
            <input
              type="text"
              placeholder="English (Native), Spanish (Fluent)..."
              value={resume.skills.languages?.join(', ') || ''}
              onChange={(e) => updateSkills('languages', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      <section className="panel-3d">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Projects (Optional)</h2>
          <button
            onClick={addProject}
            className="btn-3d flex items-center gap-2 px-4 py-2"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
        {resume.projects.map((project, index) => (
          <div
            key={project.id}
            className="mb-4 p-4 rounded-xl border border-slate-200/70 bg-white/70 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Project {index + 1}</h3>
              <button
                onClick={() => removeProject(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                value={project.technologies.join(', ')}
                onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Project Link (optional)"
                value={project.link || ''}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </section>

      <section className="panel-3d">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Certifications (Optional)</h2>
          <button
            onClick={addCertification}
            className="btn-3d flex items-center gap-2 px-4 py-2"
          >
            <Plus size={18} />
            Add Certification
          </button>
        </div>
        {resume.certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="mb-4 p-4 rounded-xl border border-slate-200/70 bg-white/70 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">Certification {index + 1}</h3>
              <button
                onClick={() => removeCertification(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Issuer"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Issue Date"
                value={cert.date}
                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Expiry Date (optional)"
                value={cert.expiryDate || ''}
                onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
