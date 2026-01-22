import { FileText, Download, Save, LogOut } from 'lucide-react';

interface AppHeaderProps {
  userEmail: string | null;
  showAuthActions: boolean;
  onSave: () => void;
  onExportText: () => void;
  onExportPDF: () => void;
  onLogout: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  isSaveDisabled?: boolean;
}

export function AppHeader({
  userEmail,
  showAuthActions,
  onSave,
  onExportText,
  onExportPDF,
  onLogout,
  isSaving,
  lastSaved,
  isSaveDisabled = false,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="glass-card w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(37,99,235,0.18)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg">
              <FileText className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Resume Generator</h1>
              <p className="text-sm text-gray-600">Create ATS-friendly, professional resumes in minutes</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-end w-full sm:w-auto">
            {showAuthActions && (
              <>
                <div className="text-sm text-gray-600 hidden sm:block">{userEmail}</div>
                <button
                  onClick={onSave}
                  disabled={isSaving || isSaveDisabled}
                  className="btn-3d flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  title={isSaveDisabled ? 'Sign in to save your work' : 'Manual save'}
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
                  onClick={onLogout}
                  className="btn-3d flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  title="Sign out"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            )}
            <button
              onClick={onExportText}
              className="btn-3d flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900"
            >
              <Download size={18} />
              Export Text
            </button>
            <button onClick={onExportPDF} className="btn-3d flex items-center gap-2">
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
