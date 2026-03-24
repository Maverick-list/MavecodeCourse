import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import TranslationCard from '../components/TranslationCard';
import { Laptop, ShieldCheck, Zap, Globe2 } from 'lucide-react';

const TranslationPage = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Zap, label: 'Instant AI', color: '#00FFFF' },
    { icon: Globe2, label: 'Global Connect', color: '#f97316' },
    { icon: ShieldCheck, label: 'Encrypted', color: '#39FF14' },
    { icon: Laptop, label: 'Auto-Detect', color: '#FF00FF' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">NEW_MODULE_ALPHA</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-6"
          >
            MAVE<span className="text-accent underline decoration-8 decoration-accent/20">LATE</span> INTERFACE
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium"
          >
            Terjemahkan teks Anda secara instan ke lebih dari 8 bahasa menggunakan mesin AI terenkripsi. Sempurna untuk kolaborasi global.
          </motion.p>
        </div>

        {/* The Card */}
        <TranslationCard />

        {/* Feature Grid Below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <f.icon className="w-5 h-5" style={{ color: f.color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
