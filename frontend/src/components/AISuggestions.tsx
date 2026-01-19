import { Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { Resume } from '../types/resume';
import { analyzeSummary, analyzeWorkExperience, analyzeSkills, actionVerbs } from '../utils/aiSuggestions';

interface AISuggestionsProps {
  resume: Resume;
}

export default function AISuggestions({ resume }: AISuggestionsProps) {
  const summarySuggestions = resume.professionalSummary ? analyzeSummary(resume.professionalSummary) : [];
  const experienceSuggestions = resume.workExperience.length > 0 ? analyzeWorkExperience(resume.workExperience) : [];
  const skillsSuggestions = analyzeSkills(resume.skills);

  const allSuggestions = [...summarySuggestions, ...experienceSuggestions, ...skillsSuggestions];

  const tips = [
    'Use strong action verbs to start each bullet point',
    'Quantify achievements with numbers, percentages, or dollar amounts',
    'Tailor your resume to match job descriptions',
    'Keep formatting consistent and ATS-friendly',
    'Use industry-specific keywords relevant to your target role',
    'Focus on achievements rather than responsibilities',
    'Keep your resume to 1-2 pages maximum'
  ];

  return (
    <div className="space-y-6">
      <section className="panel-3d">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">AI-Powered Suggestions</h2>
        </div>

        {allSuggestions.length === 0 ? (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium text-green-900">Great job!</p>
              <p className="text-sm text-green-700 mt-1">
                Your resume follows best practices. Keep refining it as you gain more experience.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {allSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel-3d">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Action Verbs Library</h3>
        <p className="text-sm text-gray-600 mb-3">
          Start your bullet points with these powerful action verbs to make your achievements stand out:
        </p>
        <div className="flex flex-wrap gap-2">
          {actionVerbs.map((verb) => (
            <span
              key={verb}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => navigator.clipboard.writeText(verb)}
              title="Click to copy"
            >
              {verb}
            </span>
          ))}
        </div>
      </section>

      <section className="panel-3d">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Resume Best Practices</h3>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
              <span className="text-sm text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-3d">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">ATS Optimization Tips</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-900">Use Standard Section Headers:</strong>
            <p className="mt-1">Stick to conventional headers like "Work Experience," "Education," and "Skills" so ATS can parse your resume correctly.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-900">Avoid Graphics and Images:</strong>
            <p className="mt-1">ATS systems cannot read images, charts, or graphics. Use text only for important information.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-900">Include Keywords:</strong>
            <p className="mt-1">Mirror keywords from job descriptions in your resume, especially in skills and experience sections.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-900">Simple Formatting:</strong>
            <p className="mt-1">Use standard fonts, avoid tables and text boxes, and save as PDF or DOCX format.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
