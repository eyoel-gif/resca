import React, { createContext, useContext, useState, useEffect } from 'react';
import { backend } from '../services/backend';
import { Language, TRANSLATIONS } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(TRANSLATIONS.en);

  useEffect(() => {
    // Simulate backend fetch for language pack
    const loadTranslations = async () => {
      const pack = await backend.getTranslations(language);
      setTranslations(pack);

      // Handle Document Direction
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
    };
    loadTranslations();
  }, [language]);

  // Nested key retrieval function (e.g., t('nav.marketplace'))
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for: ${path} in ${language}`);
        return path;
      }
      current = current[key];
    }
    
    return typeof current === 'string' ? current : path;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};