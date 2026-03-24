import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

// 20 World Languages matches Google language codes
export const languages = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('mavecode_language') || 'id';
  });

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Initialize Google Translate Script
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // Create the callback function
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'id',
          includedLanguages: languages.map(l => l.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, 'google_translate_element');
        setIsScriptLoaded(true);
      };

      // Add Script to Head
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    };

    if (!window.google?.translate?.TranslateElement) {
      addGoogleTranslateScript();
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Sync current language with Google Cookie
  useEffect(() => {
    const langCode = currentLanguage;
    localStorage.setItem('mavecode_language', langCode);
    
    // Google Translate works by setting a specific cookie: googtrans
    // Format: /source/target (e.g., /id/en)
    const cookieValue = `/id/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; domain=.mavecode.my.id; path=/`;
    document.cookie = `googtrans=${cookieValue}; domain=course.mavecode.my.id; path=/`;

    // Force page language attribute
    document.documentElement.lang = langCode;

    // Refresh if not Indonesian (Google sometimes needs a reload or trigger)
    // For a smoother experience, we can try to call the hidden selector
  }, [currentLanguage]);

  const setLanguage = useCallback((code) => {
    setCurrentLanguage(code);
    // Reloading is the most reliable way to ensure Google Translate processes the whole DOM
    window.location.reload();
  }, []);

  // Pass-through t function
  const t = (key) => key;

  // Restore as dummy passthrough to avoid crashes in components using it
  const useAutoTranslate = (text) => text;

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      languages, 
      t, 
      isScriptLoaded,
      useAutoTranslate 
    }}>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" style={{ display: 'none' }} />
      <style>{`
        body { top: 0 !important; }
        .skiptranslate, .goog-te-banner-frame { display: none !important; }
        .goog-te-menu-value:hover { text-decoration: none !important; }
        iframe.goog-te-menu-frame { display: none !important; }
      `}</style>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
