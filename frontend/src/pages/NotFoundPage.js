import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Terminal, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFoundPage = () => {
    const [glitchText, setGlitchText] = useState('404');
    const [typedText, setTypedText] = useState('');
    const errorMessage = "ERROR: Page not found in the matrix...";

    // Glitch effect
    useEffect(() => {
        const glitchChars = ['4', '0', '@', '#', '!', '?', '*', '%'];
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const newText = '404'.split('').map(char =>
                    Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
                ).join('');
                setGlitchText(newText);
                setTimeout(() => setGlitchText('404'), 100);
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Typewriter effect
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < errorMessage.length) {
                setTypedText(errorMessage.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/50 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl">
                {/* 404 Text with Glitch Effect */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="mb-8"
                >
                    <h1
                        className="font-heading text-[150px] md:text-[200px] font-black leading-none tracking-tighter relative"
                        style={{ textShadow: '0 0 50px rgba(0, 255, 255, 0.5)' }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary to-primary/30">
                            {glitchText}
                        </span>
                        {/* Glitch layers */}
                        <span className="absolute inset-0 text-red-500/30 animate-pulse" style={{ clipPath: 'inset(10% 0 60% 0)', transform: 'translateX(-2px)' }}>
                            {glitchText}
                        </span>
                        <span className="absolute inset-0 text-blue-500/30 animate-pulse" style={{ clipPath: 'inset(60% 0 10% 0)', transform: 'translateX(2px)' }}>
                            {glitchText}
                        </span>
                    </h1>
                </motion.div>

                {/* Terminal-style Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/80 border border-primary/30 rounded-lg p-6 mb-8 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-2 text-xs text-muted-foreground font-mono">terminal</span>
                    </div>
                    <div className="text-left font-mono text-sm">
                        <p className="text-muted-foreground mb-2">
                            <span className="text-primary">mavecode@server</span>
                            <span className="text-white">:</span>
                            <span className="text-accent">~</span>
                            <span className="text-white">$ </span>
                            <span className="text-red-400">{typedText}</span>
                            <span className="animate-pulse">_</span>
                        </p>
                        <p className="text-muted-foreground">
                            <span className="text-primary">mavecode@server</span>
                            <span className="text-white">:</span>
                            <span className="text-accent">~</span>
                            <span className="text-white">$ </span>
                            <span className="text-yellow-400">Redirecting to homepage is recommended...</span>
                        </p>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="font-heading text-2xl font-bold text-white mb-4">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Sepertinya kamu tersesat di dunia digital. Halaman yang kamu cari tidak ada atau sudah dipindahkan.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold rounded-none px-8">
                        <Link to="/">
                            <Home className="mr-2 w-5 h-5" /> Kembali ke Beranda
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-none border-white/20 hover:border-primary/50 px-8">
                        <Link to="/courses">
                            <Search className="mr-2 w-5 h-5" /> Cari Kursus
                        </Link>
                    </Button>
                </motion.div>

                {/* Fun Facts */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                    <div className="flex items-center justify-center gap-2 text-accent text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-mono">Fun fact: Error 404 pertama kali muncul di CERN pada tahun 1992!</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
