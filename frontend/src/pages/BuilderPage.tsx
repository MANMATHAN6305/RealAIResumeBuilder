import { Resume } from '../types/resume';
import AISuggestions from '../components/AISuggestions';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { AppHeader } from '../components/layout/AppHeader';
import { TabNavigation } from '../components/layout/TabNavigation';

type BuilderPageProps = {
  resume: Resume;
  templateStyle: 'professional' | 'modern' | 'minimal';
  activeTab: 'edit' | 'preview' | 'suggestions';
  userEmail: string | null;
  isAuthenticated: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  isDemoUser: boolean;
  onResumeChange: (resume: Resume) => void;
  onTemplateChange: (style: 'professional' | 'modern' | 'minimal') => void;
  onTabChange: (tab: 'edit' | 'preview' | 'suggestions') => void;
  onSave: () => Promise<void> | void;
  onExportText: () => void;
  onExportPDF: () => Promise<void>;
  onLogout: () => void;
};

export function BuilderPage({
  resume,
  templateStyle,
  activeTab,
  userEmail,
  isAuthenticated,
  isSaving,
  lastSaved,
  isDemoUser,
  onResumeChange,
  onTemplateChange,
  onTabChange,
  onSave,
  onExportText,
  onExportPDF,
  onLogout,
}: BuilderPageProps) {
  const isSaveDisabled = isDemoUser || !isAuthenticated;

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-60" />
      <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-40" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-200 blur-3xl opacity-40" />

      <AppHeader
        userEmail={userEmail}
        showAuthActions={isAuthenticated}
        onSave={onSave}
        onExportText={onExportText}
        onExportPDF={onExportPDF}
        onLogout={onLogout}
        isSaving={isSaving}
        lastSaved={lastSaved}
        isSaveDisabled={isSaveDisabled}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          templateStyle={templateStyle}
          onTemplateChange={onTemplateChange}
        />

        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'edit' && (
            <div>
              <ResumeForm resume={resume} onChange={onResumeChange} />
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
