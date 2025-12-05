import { Resume } from '../types/resume';

interface ResumePreviewProps {
  resume: Resume;
  templateStyle: 'professional' | 'modern' | 'minimal';
}

export default function ResumePreview({ resume, templateStyle }: ResumePreviewProps) {
  const templates = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate
  };

  const Template = templates[templateStyle];

  return (
    <div className="bg-white shadow-lg" id="resume-preview">
      <Template resume={resume} />
    </div>
  );
}

function ProfessionalTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="p-12 max-w-4xl mx-auto font-serif">
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>•</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>•</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
        {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
          <div className="flex justify-center gap-4 text-sm text-gray-600 mt-1">
            {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
            {resume.personalInfo.linkedin && resume.personalInfo.website && <span>•</span>}
            {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
          </div>
        )}
      </div>

      {resume.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wider border-b border-gray-800">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {resume.professionalSummary}
          </p>
        </section>
      )}

      {resume.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-800">
            Work Experience
          </h2>
          {resume.workExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600 italic">
                    {exp.company} | {exp.location}
                  </p>
                </div>
                <span className="text-gray-600 text-sm whitespace-nowrap">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700">
                  {exp.achievements.filter(a => a.trim()).map((achievement, idx) => (
                    <li key={idx} className="leading-relaxed">{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-800">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-gray-600 italic">
                    {edu.institution} | {edu.location}
                  </p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-600 text-sm">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {(resume.skills.technical || resume.skills.tools || resume.skills.soft || resume.skills.languages) && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-800">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resume.skills.technical && resume.skills.technical.length > 0 && (
              <div>
                <strong className="text-gray-900">Technical:</strong>{' '}
                <span className="text-gray-700">{resume.skills.technical.join(', ')}</span>
              </div>
            )}
            {resume.skills.tools && resume.skills.tools.length > 0 && (
              <div>
                <strong className="text-gray-900">Tools:</strong>{' '}
                <span className="text-gray-700">{resume.skills.tools.join(', ')}</span>
              </div>
            )}
            {resume.skills.soft && resume.skills.soft.length > 0 && (
              <div>
                <strong className="text-gray-900">Soft Skills:</strong>{' '}
                <span className="text-gray-700">{resume.skills.soft.join(', ')}</span>
              </div>
            )}
            {resume.skills.languages && resume.skills.languages.length > 0 && (
              <div>
                <strong className="text-gray-900">Languages:</strong>{' '}
                <span className="text-gray-700">{resume.skills.languages.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-800">
            Projects
          </h2>
          {resume.projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-600 text-sm mt-1">
                  <strong>Technologies:</strong> {project.technologies.join(', ')}
                </p>
              )}
              {project.link && (
                <p className="text-gray-600 text-sm">
                  <strong>Link:</strong> {project.link}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.certifications && resume.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-800">
            Certifications
          </h2>
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              <p className="text-gray-600">
                {cert.issuer} | {cert.date}
                {cert.expiryDate && ` | Expires: ${cert.expiryDate}`}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function ModernTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="p-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-blue-600 mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex gap-3 text-sm text-gray-600 flex-wrap">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>|</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>|</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>|</span>}
          {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
          {resume.personalInfo.website && <span>|</span>}
          {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
        </div>
      </div>

      {resume.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-1 border-b-2 border-blue-600">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{resume.professionalSummary}</p>
        </section>
      )}

      {resume.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-1 border-b-2 border-blue-600">
            EXPERIENCE
          </h2>
          {resume.workExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-blue-700 font-medium">
                    {exp.company} • {exp.location}
                  </p>
                </div>
                <span className="text-gray-600 font-medium">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700">
                  {exp.achievements.filter(a => a.trim()).map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-1 border-b-2 border-blue-600">
            EDUCATION
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-blue-700 font-medium">
                    {edu.institution} • {edu.location}
                  </p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-600 font-medium">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {(resume.skills.technical || resume.skills.tools || resume.skills.soft || resume.skills.languages) && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-1 border-b-2 border-blue-600">
            SKILLS
          </h2>
          <div className="space-y-2">
            {resume.skills.technical && resume.skills.technical.length > 0 && (
              <div>
                <strong className="text-blue-700">Technical:</strong>{' '}
                <span className="text-gray-700">{resume.skills.technical.join(' • ')}</span>
              </div>
            )}
            {resume.skills.tools && resume.skills.tools.length > 0 && (
              <div>
                <strong className="text-blue-700">Tools:</strong>{' '}
                <span className="text-gray-700">{resume.skills.tools.join(' • ')}</span>
              </div>
            )}
            {resume.skills.soft && resume.skills.soft.length > 0 && (
              <div>
                <strong className="text-blue-700">Soft Skills:</strong>{' '}
                <span className="text-gray-700">{resume.skills.soft.join(' • ')}</span>
              </div>
            )}
            {resume.skills.languages && resume.skills.languages.length > 0 && (
              <div>
                <strong className="text-blue-700">Languages:</strong>{' '}
                <span className="text-gray-700">{resume.skills.languages.join(' • ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-1 border-b-2 border-blue-600">
            PROJECTS
          </h2>
          {resume.projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
              <p className="text-gray-700">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-600 mt-1">
                  <strong className="text-blue-700">Tech:</strong> {project.technologies.join(' • ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.certifications && resume.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-1 border-b-2 border-blue-600">
            CERTIFICATIONS
          </h2>
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h3 className="text-lg font-bold text-gray-900">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer} • {cert.date}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function MinimalTemplate({ resume }: { resume: Resume }) {
  return (
    <div className="p-12 max-w-4xl mx-auto font-serif">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-sm text-gray-600 space-x-2">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
          {resume.personalInfo.website && <span>• {resume.personalInfo.website}</span>}
        </div>
      </div>

      {resume.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{resume.professionalSummary}</p>
        </section>
      )}

      {resume.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Experience
          </h2>
          {resume.workExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 italic mb-1">
                {exp.company}, {exp.location}
              </p>
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-700">
                  {exp.achievements.filter(a => a.trim()).map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {edu.degree}, {edu.field}
                  </h3>
                  <p className="text-sm text-gray-600 italic">
                    {edu.institution}, {edu.location}
                  </p>
                </div>
                <span className="text-xs text-gray-600">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {(resume.skills.technical || resume.skills.tools || resume.skills.soft || resume.skills.languages) && (
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Skills
          </h2>
          <div className="text-sm space-y-1">
            {resume.skills.technical && resume.skills.technical.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Technical: </span>
                <span className="text-gray-700">{resume.skills.technical.join(', ')}</span>
              </div>
            )}
            {resume.skills.tools && resume.skills.tools.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Tools: </span>
                <span className="text-gray-700">{resume.skills.tools.join(', ')}</span>
              </div>
            )}
            {resume.skills.soft && resume.skills.soft.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Soft Skills: </span>
                <span className="text-gray-700">{resume.skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Projects
          </h2>
          {resume.projects.map((project) => (
            <div key={project.id} className="mb-2">
              <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
              <p className="text-sm text-gray-700">{project.description}</p>
            </div>
          ))}
        </section>
      )}

      {resume.certifications && resume.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Certifications
          </h2>
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-1">
              <span className="font-medium text-gray-900 text-sm">{cert.name}</span>
              <span className="text-sm text-gray-600"> — {cert.issuer}, {cert.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
