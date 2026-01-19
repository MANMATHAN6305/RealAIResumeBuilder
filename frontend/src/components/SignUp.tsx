import { useState, type FormEvent } from 'react';
import { ArrowRight, Mail, Lock, FileText, User, Calendar } from 'lucide-react';
import { signUp } from '../utils/auth';

interface SignUpProps {
  onSignUp: (email: string, userId: string) => void;
  onBack: () => void;
}

export default function SignUp({ onSignUp, onBack }: SignUpProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validate all fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !dateOfBirth) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Validate age (must be at least 13)
    const age = calculateAge(dateOfBirth);
    if (age < 13) {
      setError('You must be at least 13 years old');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up:', email.trim());
      const result = await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        dateOfBirth
      });

      console.log('Sign up result:', result);

      if (result.error) {
        const errorMsg = result.error?.message || result.error || 'Failed to create account. Please try again.';
        console.error('Sign up error:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      if (result && result.user && result.user.id) {
        console.log('Sign up successful, user ID:', result.user.id);
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          onSignUp(email.trim(), result.user.id);
        }, 1500);
      } else {
        console.error('Sign up failed - no user data:', result);
        setError('Account creation failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Sign up exception:', err);
      const errorMessage = err?.message || 'An error occurred. Please check your connection and try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

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
            <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
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
          
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-slate-600">
                Sign up to start building your professional resume
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password (minimum 8 characters)
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
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-3d flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
