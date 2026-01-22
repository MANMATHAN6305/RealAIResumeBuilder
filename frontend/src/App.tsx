import { useState } from 'react';
import { exportToPDF, exportToText, downloadTextFile } from './utils/exportResume';
import { signOut } from './utils/auth';
import { useResumeBuilder } from './hooks/useResumeBuilder';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { BuilderPage } from './pages/BuilderPage';

type View = 'home' | 'login' | 'signup' | 'builder';

function App() {
  const [view, setView] = useState<View>('home');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'suggestions'>('edit');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const {
    resume,
    setResume,
    templateStyle,
    setTemplateStyle,
    isSaving,
    lastSaved,
    handleManualSave,
    resetResume,
  } = useResumeBuilder({ userId, isDemoUser });

  const handleLoginSuccess = (email: string, id: string) => {
    setIsDemoUser(false);
    setUserEmail(email);
    setUserId(id);
    setView('builder');
  };

  const handleDemoLogin = () => {
    setIsDemoUser(true);
    setUserEmail('demo@example.com');
    setUserId('demo-user');
    setView('builder');
  };

  const handleLogout = async () => {
    await signOut();
    setIsDemoUser(false);
    setUserId(null);
    setUserEmail(null);
    setView('home');
    resetResume();
  };

  const handleSave = async () => {
    try {
      await handleManualSave();
      alert('Resume saved successfully.');
    } catch (e) {
      alert((e as Error)?.message || 'Failed to save resume. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    setActiveTab('preview');
    await new Promise((resolve) => setTimeout(resolve, 100));
    await exportToPDF(resume, templateStyle);
  };

  const handleExportText = () => {
    const textContent = exportToText(resume);
    const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}.txt`;
    downloadTextFile(textContent, filename);
  };

  if (view === 'home') {
    return <HomePage onGetStarted={() => setView('login')} onDemo={handleDemoLogin} />;
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLogin={handleLoginSuccess}
        onSignUpClick={() => setView('signup')}
        onBack={() => setView('home')}
        onDemoLogin={handleDemoLogin}
      />
    );
  }

  if (view === 'signup') {
    return (
      <SignUpPage
        onSignUp={handleLoginSuccess}
        onBack={() => setView('login')}
      />
    );
  }

  return (
    <BuilderPage
      resume={resume}
      templateStyle={templateStyle}
      activeTab={activeTab}
      userEmail={userEmail}
      isAuthenticated={Boolean(userId)}
      isSaving={isSaving}
      lastSaved={lastSaved}
      isDemoUser={isDemoUser}
      onResumeChange={setResume}
      onTemplateChange={setTemplateStyle}
      onTabChange={setActiveTab}
      onSave={handleSave}
      onExportText={handleExportText}
      onExportPDF={handleExportPDF}
      onLogout={handleLogout}
    />
  );
}

export default App;
