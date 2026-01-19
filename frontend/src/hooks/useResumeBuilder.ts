import { useEffect, useRef, useState } from 'react';
import { Resume, PersonalInfo, Skills } from '../types/resume';
import { loadResumeForUser, saveResumeForUser } from '../utils/resumeStorage';
import { getDemoResume, getEmptyResume } from '../utils/demoResume';

interface UseResumeBuilderOptions {
  userId: string | null;
  isDemoUser?: boolean;
}

export function useResumeBuilder({ userId, isDemoUser = false }: UseResumeBuilderOptions) {
  const [resume, setResume] = useState<Resume>(getEmptyResume());
  const [templateStyle, setTemplateStyle] = useState<'professional' | 'modern' | 'minimal'>('professional');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate resume whenever user changes
  useEffect(() => {
    if (!userId) {
      setResume(getEmptyResume());
      setTemplateStyle('professional');
      return;
    }

    if (isDemoUser) {
      const demo = getDemoResume();
      setResume(demo);
      setTemplateStyle(demo.templateStyle);
      return;
    }

    (async () => {
      const existing = await loadResumeForUser(userId);
      if (existing) {
        setResume(existing);
        setTemplateStyle(existing.templateStyle);
      } else {
        setResume(getEmptyResume());
        setTemplateStyle('professional');
      }
    })();
  }, [userId, isDemoUser]);

  // Auto-save with debounce (disabled for demo users)
  useEffect(() => {
    if (!userId || isDemoUser) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveResumeForUser(userId, { ...resume, templateStyle });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [resume, templateStyle, userId, isDemoUser]);

  const handleManualSave = async () => {
    if (!userId || isDemoUser) {
      throw new Error('Save is unavailable for demo users. Please sign in to save your resume.');
    }

    setIsSaving(true);
    await saveResumeForUser(userId, { ...resume, templateStyle });
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const applyTemplateStyle = (style: 'professional' | 'modern' | 'minimal') => {
    setTemplateStyle(style);
    setResume((prev) => ({ ...prev, templateStyle: style }));
  };

  const resetResume = () => {
    const empty = getEmptyResume();
    setResume(empty);
    setTemplateStyle(empty.templateStyle);
    setLastSaved(null);
  };

  return {
    resume,
    setResume,
    templateStyle,
    setTemplateStyle: applyTemplateStyle,
    isSaving,
    lastSaved,
    handleManualSave,
    resetResume,
  };
}
