import { useState, type FormEvent } from 'react';
import { ArrowRight, Mail, Lock, UserPlus } from 'lucide-react';
import { signIn, signInWithGoogle } from '../utils/auth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { DemoLoginButton } from '../components/auth/DemoLoginButton';

type LoginPageProps = {
  onLogin: (email: string, userId: string) => void;
  onSignUpClick: () => void;
  onBack: () => void;
  onDemoLogin: () => void;
};

export function LoginPage({ onLogin, onSignUpClick, onBack, onDemoLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn(trimmedEmail, password);

      if (result.error) {
        const errorMsg = result.error?.message || result.error || 'Invalid email or password. Please try again.';
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (result?.user?.id) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          onLogin(trimmedEmail, result.user.id);
        }, 800);
      } else {
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred. Please check your connection and try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (token: string) => {
    setError('');
    setSuccessMessage('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithGoogle(token);

      if (result.error) {
        const errorMsg = result.error?.message || result.error || 'Google sign-in failed.';
        setError(errorMsg);
        setIsGoogleLoading(false);
        return;
      }

      if (result.requiresCompletion) {
        setSuccessMessage('Please complete your profile...');
        setTimeout(() => {
          window.location.href = `/complete-profile?googleId=${result.googleId}&email=${result.email}`;
        }, 800);
        return;
      }

      if (result?.user?.id) {
        setSuccessMessage('Google login successful! Redirecting...');
        setTimeout(() => {
          onLogin(result.user.email, result.user.id);
        }, 800);
      } else {
        setError('Google authentication failed. Please try again.');
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to continue"
      subtitle="Access your saved resumes and keep building"
      onBack={onBack}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-600">Sign in to create your professional resume</p>
      </div>

      <div className="space-y-4">
        <GoogleSignInButton
          onSuccess={handleGoogleSignIn}
          onError={(message) => setError(message)}
        />
        <DemoLoginButton onDemoLogin={onDemoLogin} />
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full btn-3d flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSignUpClick}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
          disabled={isGoogleLoading}
        >
          <UserPlus size={16} />
          Don't have an account? Sign up
        </button>
      </div>
    </AuthLayout>
  );
}
