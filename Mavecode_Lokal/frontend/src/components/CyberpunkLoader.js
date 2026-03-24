import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const CyberpunkLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('boot'); // boot, loading, ready
  const [bootLines, setBootLines] = useState([]);
  const canvasRef = useRef(null);
  const { t } = useLanguage();

  const bootSequence = [
    '> INITIALIZING MAVECODE KERNEL...',
    '> LOADING NEURAL NETWORKS... OK',
    '> DECRYPTING ASSETS...',
    '> ESTABLISHING SECURE CHANNEL...',
    '> CALIBRATING 3D MODULES...',
    '> SYSTEM READY.',
  ];

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01MAVECODEアイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.8 ? '#39FF14' : '#00FFFF';
        ctx.globalAlpha = Math.random() * 0.4 + 0.1;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence
  useEffect(() => {
    let lineIndex = 0;
    const timer = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev.slice(-5), bootSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(timer);
        setPhase('loading');
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Loading progress
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase('ready');
          return 100;
        }
        return prev + Math.random() * 5 + 2;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [phase]);

  // Auto-complete
  useEffect(() => {
    if (phase === 'ready') {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050510] flex flex-col items-center justify-center overflow-hidden font-mono"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />
      
      {/* 3D Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div 
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#00FFFF]/10 to-transparent"
        />
      </div>

      {/* Main 3D-like Loader Container */}
      <div className="relative z-20 flex flex-col items-center gap-12 perspective-[1000px]">
        
        {/* 3D Rotating Cube/Hex Shape */}
        <motion.div 
          animate={{ 
            rotateY: 360,
            rotateX: [0, 10, 0, -10, 0],
            rotateZ: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotateZ: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-32 h-32"
        >
          {/* Inner Logo */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(20px)' }}>
            <img src={LOGO_URL} alt="Mavecode" className="w-16 h-16 rounded-full border-2 border-[#00FFFF] shadow-[0_0_20px_#00FFFF]" />
          </div>

          {/* 3D Rings */}
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute inset-0 border-2 border-[#00FFFF]/30 rounded-xl"
              style={{ 
                transform: `rotateX(${i * 60}deg) rotateY(${i * 45}deg) translateZ(0px)`,
                boxShadow: '0 0 15px rgba(0,255,255,0.2)'
              }}
            />
          ))}

          {/* Glowing Points at Vertices */}
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-[#39FF14] rounded-full shadow-[0_0_10px_#39FF14]"
              style={{ 
                top: i % 2 === 0 ? '-4px' : 'auto',
                bottom: i % 2 !== 0 ? '-4px' : 'auto',
                left: i < 2 ? '-4px' : 'auto',
                right: i >= 2 ? '-4px' : 'auto',
                transform: `translateZ(${i * 10}px)`
              }}
            />
          ))}
        </motion.div>

        {/* Text & Progress */}
        <div className="flex flex-col items-center text-center">
          <motion.h1 
            animate={{ textShadow: ['0 0 10px #00FFFF', '0 0 30px #00FFFF', '0 0 10px #00FFFF'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#00FFFF] mb-2"
          >
            MAVE<span className="text-[#39FF14]">CODE</span>
          </motion.h1>
          
          <div className="flex gap-2 text-[10px] text-[#00FFFF]/50 tracking-widest uppercase mb-6">
            <span>Neural Link</span>
            <span className="animate-pulse">|</span>
            <span>Uplink Active</span>
          </div>

          {/* Glitch Progress Bar */}
          <div className="w-64 h-1 bg-white/5 relative overflow-hidden border border-white/10">
            <motion.div 
              animate={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00FFFF] to-[#39FF14] shadow-[0_0_15px_rgba(0,255,255,0.8)]"
            />
            {/* Scanned line over progress */}
            <motion.div 
              animate={{ left: ['-10%', '110%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 w-8 h-full bg-white/30 skew-x-12"
            />
          </div>

          <div className="mt-4 flex flex-col gap-1 items-center">
            <span className="text-[#39FF14] text-xs font-bold tracking-widest leading-none">
              {Math.floor(progress)}% {t('loading').toUpperCase()}
            </span>
            <div className="h-4 overflow-hidden text-[9px] text-white/30 uppercase max-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bootLines.length}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                >
                  {bootLines[bootLines.length - 1] || t('loading').toUpperCase() + '...'}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Floor */}
      <div 
        className="absolute bottom-0 w-full h-1/4 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(0deg, #00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          maskImage: 'linear-gradient(to top, black, transparent)'
        }}
      />
    </motion.div>
  );
};

export default CyberpunkLoader;
