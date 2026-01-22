import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

type HomePageProps = {
  onGetStarted: () => void;
  onDemo: () => void;
};

export function HomePage({ onGetStarted, onDemo }: HomePageProps) {
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-70" />
      <div className="absolute -top-40 right-0 h-96 w-96 bg-blue-200 blur-3xl opacity-40" />
      <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 bg-cyan-200 blur-3xl opacity-40" />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg">
            <Sparkles className="text-white" size={26} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">AI Resume Generator</p>
            <h1 className="text-xl font-semibold text-slate-900">Craft hiring-ready resumes faster</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onDemo} className="btn-3d hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900">
            Try Demo
            <ArrowRight size={18} />
          </button>
          <button onClick={onGetStarted} className="btn-3d hidden sm:inline-flex items-center gap-2">
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>
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
                <button onClick={onDemo} className="btn-3d inline-flex items-center gap-2 justify-center bg-gradient-to-r from-slate-700 to-slate-900">
                  Try Demo
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
                  ['Modern templates', 'Professional, minimal, bold'],
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
                      AI
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Real-time guidance</p>
                      <p className="text-lg font-semibold text-slate-900">AI resume insights</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-4">
                    <p className="text-sm text-slate-300">"Quantify achievements to stand out"</p>
                    <p className="text-xs text-slate-400 mt-1">AI Suggestion • 2s ago</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="panel-3d p-3">
                      <p className="text-xs text-slate-500">Templates</p>
                      <p className="text-sm font-semibold text-slate-900">Professional, Modern, Minimal</p>
                    </div>
                    <div className="panel-3d p-3">
                      <p className="text-xs text-slate-500">Exports</p>
                      <p className="text-sm font-semibold text-slate-900">PDF & Text</p>
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
