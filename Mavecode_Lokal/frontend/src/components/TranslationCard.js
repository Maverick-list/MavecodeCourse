import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  Trash2,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

const TranslationCard = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('id');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // API Call logic
  const handleTranslate = useCallback(async (text) => {
    if (!text.trim()) {
      setTranslatedText('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Primary: Argos Open Tech (Better CORS support)
      // Alternative instances: translate.terraprint.co, libretranslate.de
      const response = await axios.post('https://translate.argosopentech.com/translate', {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
        api_key: ""
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.translatedText) {
        setTranslatedText(response.data.translatedText);
      }
    } catch (err) {
      console.error('Translation Error:', err);
      // If primary fails, we inform the user it's an API limitation
      setError('Gagal menerjemahkan. Server sedang sibuk atau membatasi akses. Silakan coba bahasa lain atau tunggu sebentar.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang]);

  // Debounce Logic: 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText) {
        handleTranslate(sourceText);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [sourceText, handleTranslate]);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    toast.success('Disalin ke clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const clearText = () => {
    setSourceText('');
    setTranslatedText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-4 md:p-6"
    >
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        {/* Header Section */}
        <div className="p-6 border-b border-border bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Languages className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI Translator</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Powered by MAVECODE Engine</p>
            </div>
          </div>
          <div className="flex gap-2 text-[10px] items-center font-mono opacity-50 hidden sm:flex">
             <span className="px-2 py-1 bg-white/5 rounded">LIBRE_API_v1.2</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> NETWORK_READY</span>
          </div>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border h-full min-h-[400px]">
          
          {/* Source Input */}
          <div className="p-6 flex flex-col gap-4 bg-transparent group">
            <div className="flex items-center justify-between">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-white/5 border border-border rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer hover:bg-white/10"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-card text-foreground">{lang.flag} {lang.name}</option>
                ))}
              </select>
              <button 
                onClick={clearText}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                title="Clear text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Masukkan teks di sini..."
              className="flex-1 w-full bg-transparent resize-none outline-none text-lg leading-relaxed placeholder:text-muted-foreground/30 font-medium min-h-[200px]"
            />
          </div>

          {/* Result Output */}
          <div className="p-6 flex flex-col gap-4 bg-primary/[0.02] relative group">
            <div className="flex items-center justify-between">
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-white/5 border border-border rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer hover:bg-white/10"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-card text-foreground">{lang.flag} {lang.name}</option>
                ))}
              </select>
              
              <button 
                disabled={!translatedText}
                onClick={copyToClipboard}
                className="p-2 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/10 disabled:opacity-20 flex items-center gap-2"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="text-[10px] font-bold uppercase tracking-tighter sm:inline hidden">Copy</span>
              </button>
            </div>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4 opacity-40" />
                    <p className="text-sm font-mono text-muted-foreground animate-pulse">TRANSLATING_DATA...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <AlertCircle className="w-10 h-10 text-destructive mb-4" />
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={translatedText}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-lg leading-relaxed font-medium ${!translatedText ? 'text-muted-foreground/20' : 'text-foreground'}`}
                  >
                    {translatedText || 'Hasil terjemahan akan muncul di sini...'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Swap Floating Button */}
            <button 
              onClick={swapLanguages}
              className="absolute left-0 top-0 md:left-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-card border border-border rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 md:flex hidden hover:scale-110 active:scale-90"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground transition-colors">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> API_STATUS: ACTIVE</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">CHAR_COUNT: {sourceText.length}</span>
          </div>
          <div className="flex items-center gap-1 text-primary/60">
             MADE FOR MAVECODE ELITE <Check className="w-3 h-3" />
          </div>
        </div>
      </div>
      
      {/* Mobile Swap Button */}
      <div className="flex justify-center mt-4 md:hidden">
        <button 
          onClick={swapLanguages}
          className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary/10"
        >
          <ArrowRightLeft className="w-4 h-4" /> Swap Language
        </button>
      </div>
    </motion.div>
  );
};

export default TranslationCard;
