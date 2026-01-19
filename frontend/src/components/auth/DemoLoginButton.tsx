import { Play } from 'lucide-react';

interface DemoLoginButtonProps {
  onDemoLogin: () => void;
}

export function DemoLoginButton({ onDemoLogin }: DemoLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onDemoLogin}
      className="w-full btn-3d flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900"
    >
      <Play size={16} />
      Try Demo (no signup)
    </button>
  );
}
