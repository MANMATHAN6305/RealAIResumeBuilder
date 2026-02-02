import { FileText, Eye, Sparkles } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'edit' | 'preview' | 'suggestions';
  onTabChange: (tab: 'edit' | 'preview' | 'suggestions') => void;
  templateStyle: 'professional' | 'modern' | 'minimal';
  onTemplateChange: (style: 'professional' | 'modern' | 'minimal') => void;
}

export function TabNavigation({ activeTab, onTabChange, templateStyle, onTemplateChange }: TabNavigationProps) {
  return (
    <div className="mb-6 glass-card p-4 sm:p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onTabChange('edit')}
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
            onClick={() => onTabChange('preview')}
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
            onClick={() => onTabChange('suggestions')}
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
              onChange={(e) => onTemplateChange(e.target.value as 'professional' | 'modern' | 'minimal')}
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
  );
}
