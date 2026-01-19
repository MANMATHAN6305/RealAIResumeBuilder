import { type ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, onBack, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-70" />
      <div className="absolute -top-40 right-0 h-96 w-96 bg-blue-200 blur-3xl opacity-40" />
      <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 bg-cyan-200 blur-3xl opacity-40" />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg">
            <span className="text-white font-semibold">AI</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">AI Resume Generator</p>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="btn-3d hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900"
        >
          Back
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <div className="glass-card relative overflow-hidden p-8 sm:p-12 shadow-[0_18px_45px_rgba(15,23,42,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
          <div className="relative">{children}</div>
        </div>
      </main>
    </div>
  );
}
