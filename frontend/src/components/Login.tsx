import { useState, type FormEvent, useEffect } from 'react';
import { ArrowRight, Mail, Lock, FileText, UserPlus } from 'lucide-react';
import { signIn, signInWithGoogle } from '../utils/auth';

interface LoginProps {
  onLogin: (email: string, userId: string) => void;
  onSignUpClick: () => void;
  onBack: () => void;
}

export default function Login({ onLogin, onSignUpClick, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Trim whitespace from email
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Validate email format
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
      console.log('Attempting to sign in:', trimmedEmail);
      const result = await signIn(trimmedEmail, password);
      console.log('Sign in result:', result);

      if (result.error) {
        const errorMsg = result.error?.message || result.error || 'Invalid email or password. Please try again.';
        console.error('Sign in error:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (result && result.user && result.user.id) {
        console.log('Login successful, user ID:', result.user.id);
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          onLogin(trimmedEmail, result.user.id);
        }, 1000);
      } else {
        console.error('Login failed - no user data:', result);
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      const errorMessage = err?.message || 'An error occurred. Please check your connection and try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = credentialResponse.credential;
      console.log('Google token received, signing in...');

      const result = await signInWithGoogle(token);
      console.log('Google sign-in result:', result);

      if (result.error) {
        const errorMsg = result.error?.message || result.error || 'Google sign-in failed.';
        console.error('Google sign-in error:', errorMsg);
        setError(errorMsg);
        setIsGoogleLoading(false);
        return;
      }

      if (result.requiresCompletion) {
        // Redirect to profile completion
        console.log('Profile completion required');
        setError('');
        setSuccessMessage('Please complete your profile...');
        setTimeout(() => {
          // This would be handled by App.tsx to show profile completion
          window.location.href = `/complete-profile?googleId=${result.googleId}&email=${result.email}`;
        }, 1000);
        return;
      }

      if (result && result.user && result.user.id) {
        console.log('Google login successful, user ID:', result.user.id);
        setSuccessMessage('Google login successful! Redirecting...');
        setTimeout(() => {
          onLogin(result.user.email, result.user.id);
        }, 1000);
      } else {
        console.error('Google login failed - no user data:', result);
        setError('Google authentication failed. Please try again.');
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      console.error('Google sign-in exception:', err);
      const errorMessage = err?.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In button (only if client ID is configured)
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Only initialize Google Sign-In if client ID is properly configured
    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID' || !googleClientId.trim()) {
      console.log('Google OAuth not configured - hiding Google sign-in button');
      const buttonContainer = document.getElementById('google-signin-button');
      if (buttonContainer) {
        buttonContainer.style.display = 'none';
      }
      return;
    }

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(checkGoogle);
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleSignIn,
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with'
            }
          );
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          const buttonContainer = document.getElementById('google-signin-button');
          if (buttonContainer) {
            buttonContainer.style.display = 'none';
          }
        }
      }
    }, 100);

    // Cleanup after 10 seconds if Google doesn't load
    setTimeout(() => {
      clearInterval(checkGoogle);
      if (!window.google || !window.google.accounts) {
        console.warn('Google Sign-In script failed to load');
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          buttonContainer.style.display = 'none';
        }
      }
    }, 10000);

    return () => clearInterval(checkGoogle);
  }, []);

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
            <h1 className="text-xl font-semibold text-slate-900">Sign in to continue</h1>
          </div>
        </div>
        <button 
          onClick={onBack} 
          className="btn-3d hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900"
        >
          Back
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        <div className="glass-card relative overflow-hidden p-8 sm:p-12 shadow-[0_18px_45px_rgba(15,23,42,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-600">
                Sign in to create your professional resume
              </p>
            </div>

            {/* Google Sign-In Button (only shown if configured) */}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && 
             import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && (
              <>
                <div className="mb-6">
                  <div 
                    id="google-signin-button" 
                    className="flex justify-center"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">or continue with email</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
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
                disabled={isLoading}
                className="w-full btn-3d flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
              >
                <UserPlus size={16} />
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

