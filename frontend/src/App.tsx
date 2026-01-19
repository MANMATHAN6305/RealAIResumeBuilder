import { useState, useEffect, useRef } from 'react';
import { FileText, Download, Sparkles, Eye, ArrowRight, CheckCircle2, Save, LogOut } from 'lucide-react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AISuggestions from './components/AISuggestions';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Resume, PersonalInfo, Skills } from './types/resume';
import { exportToText, exportToPDF, downloadTextFile } from './utils/exportResume';
import { loadResumeForUser, saveResumeForUser } from './utils/resumeStorage';
import { signOut } from './utils/auth';

function App() {
  const [view, setView] = useState<'home' | 'login' | 'signup' | 'builder'>('home');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'suggestions'>('edit');
  const [templateStyle, setTemplateStyle] = useState<'professional' | 'modern' | 'minimal'>('professional');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [resume, setResume] = useState<Resume>({
    title: 'My Resume',
    templateStyle: 'professional',
    targetRole: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    } as PersonalInfo,
    professionalSummary: '',
    workExperience: [],
    education: [],
    skills: {} as Skills,
    certifications: [],
    projects: []
  });

  const handleTemplateChange = (style: 'professional' | 'modern' | 'minimal') => {
    setTemplateStyle(style);
    setResume({ ...resume, templateStyle: style });
  };

  const handleLoginSuccess = async (email: string, id: string) => {
    setUserEmail(email);
    setUserId(id);
    setView('builder');

    // Try to load existing resume for this user
    const existing = await loadResumeForUser(id);
    if (existing) {
      setResume(existing);
      setTemplateStyle(existing.templateStyle);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserId(null);
    setUserEmail(null);
    setView('home');
    setResume({
      title: 'My Resume',
      templateStyle: 'professional',
      targetRole: '',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
      } as PersonalInfo,
      professionalSummary: '',
      workExperience: [],
      education: [],
      skills: {} as Skills,
      certifications: [],
      projects: []
    });
  };

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (!userId) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveResumeForUser(userId, { ...resume, templateStyle });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    // Cleanup function
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [resume, templateStyle, userId]);

  const handleSave = async () => {
    if (!userId) {
      alert('Please log in before saving your resume.');
      return;
    }

    try {
      setIsSaving(true);
      await saveResumeForUser(userId, { ...resume, templateStyle });
      setLastSaved(new Date());
      alert('Resume saved successfully.');
    } catch (e) {
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    // Switch to preview tab to ensure the resume preview element is rendered
    setActiveTab('preview');
    // Wait a bit for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));
    await exportToPDF(resume, templateStyle);
  };

  const handleExportText = () => {
    const textContent = exportToText(resume);
    const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}.txt`;
    downloadTextFile(textContent, filename);
  };

  if (view === 'home') {
    return <HomeScreen onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return (
      <Login
        onLogin={handleLoginSuccess}
        onSignUpClick={() => setView('signup')}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'signup') {
    return (
      <SignUp
        onSignUp={handleLoginSuccess}
        onBack={() => setView('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-60" />
      <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-40" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-200 blur-3xl opacity-40" />

      <header className="sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="glass-card flex items-center justify-between p-4 sm:p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(37,99,235,0.18)]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Resume Generator</h1>
                <p className="text-sm text-gray-600">Create ATS-friendly, professional resumes in minutes</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {userId && (
                <>
                  <div className="text-sm text-gray-600 hidden sm:block">
                    {userEmail}
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-3d flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Manual save"
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>
                  {lastSaved && (
                    <span className="text-xs text-gray-500 hidden sm:block">
                      Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn-3d flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    title="Sign out"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              )}
              <button
                onClick={handleExportText}
                className="btn-3d flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900"
              >
                <Download size={18} />
                Export Text
              </button>
              <button
                onClick={handleExportPDF}
                className="btn-3d flex items-center gap-2"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 glass-card p-4 sm:p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.15)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shadow ${
                  activeTab === 'edit'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]'
                    : 'bg-white text-gray-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <FileText size={18} />
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shadow ${
                  activeTab === 'preview'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]'
                    : 'bg-white text-gray-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Eye size={18} />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shadow ${
                  activeTab === 'suggestions'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]'
                    : 'bg-white text-gray-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Sparkles size={18} />
                AI Suggestions
              </button>
            </div>

            {activeTab === 'preview' && (
              <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-xl border border-white/60 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Template</span>
                <select
                  value={templateStyle}
                  onChange={(e) => handleTemplateChange(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'edit' && (
            <div>
              <ResumeForm resume={resume} onChange={setResume} />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="overflow-hidden">
              <ResumePreview resume={resume} templateStyle={templateStyle} />
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div>
              <AISuggestions resume={resume} />
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-4 sm:p-6 text-center text-sm text-gray-600">
            Built with AI-powered suggestions to help you create the perfect resume
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-70" />
      <div className="absolute -top-40 right-0 h-96 w-96 bg-blue-200 blur-3xl opacity-40" />
      <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 bg-cyan-200 blur-3xl opacity-40" />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg">
            <FileText className="text-white" size={26} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">AI Resume Generator</p>
            <h1 className="text-xl font-semibold text-slate-900">Craft hiring-ready resumes faster</h1>
          </div>
        </div>
        <button onClick={onGetStarted} className="btn-3d hidden sm:inline-flex items-center gap-2">
          Get Started
          <ArrowRight size={18} />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        <div className="glass-card relative overflow-hidden p-8 sm:p-12 shadow-[0_18px_45px_rgba(15,23,42,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="badge-soft inline-flex items-center gap-2">
                <Sparkles size={16} />
                AI tuned for ATS-ready resumes
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Stand out with a polished, <span className="text-blue-600">job-ready</span> resume
              </h2>
              <p className="text-lg text-slate-600">
                Start with a beautiful template, refine it with AI-powered suggestions, and export to text or PDF
                with a single click.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onGetStarted} className="btn-3d inline-flex items-center gap-2 justify-center">
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 border border-white/60 shadow-sm">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">No signup required</p>
                    <p className="text-xs text-slate-600">Build and export instantly</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  ['Export to PDF', 'Share polished resumes fast'],
                  ['AI suggestions', 'Tailored edits for clarity'],
                  ['Modern templates', 'Professional, minimal, bold']
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="panel-3d p-4 bg-white/80 shadow-[0_12px_30px_rgba(37,99,235,0.08)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.12)]"
                  >
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-600 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="panel-3d p-0 overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 h-12 w-full" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-semibold">
                      CV
                    </div>
                    <div>
                      <p className="text-slate-900 font-semibold">Product Designer</p>
                      <p className="text-slate-600 text-sm">Updated: Today</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                    <div className="bg-white/70 rounded-xl p-3 shadow-inner border border-white/70">
                      <p className="text-xs text-slate-500">Summary</p>
                      <p className="font-semibold">Concise, impact-driven intro</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3 shadow-inner border border-white/70">
                      <p className="text-xs text-slate-500">Skills</p>
                      <p className="font-semibold">React • Figma • Systems</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3 shadow-inner border border-white/70">
                      <p className="text-xs text-slate-500">Experience</p>
                      <p className="font-semibold">Quantified achievements</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3 shadow-inner border border-white/70">
                      <p className="text-xs text-slate-500">Export</p>
                      <p className="font-semibold">PDF & Text ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
