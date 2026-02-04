import React from 'react';
import { motion } from 'framer-motion';
import { Play, FileVideo, Sparkles, Lock, Clock } from 'lucide-react';

const ContentPlaceholder = ({ type = 'video', title = 'Pilih Materi' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full w-full bg-slate-950/50 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative group">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10"
            >
                <div className="w-24 h-24 mb-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center ring-4 ring-white/5 shadow-inner">
                    {type === 'video' ? (
                        <FileVideo className="w-10 h-10 text-primary animate-pulse" />
                    ) : (
                        <Play className="w-10 h-10 text-secondary animate-pulse ml-1" />
                    )}
                </div>

                <h3 className="text-2xl font-bold font-heading mb-3 text-white">
                    {title}
                </h3>

                <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                    Pilih salah satu materi di sebelah kanan untuk memulai petualangan belajarmu hari ini. Jangan lupa siapkan kopi dan catatan! ☕️
                </p>

                <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">High Quality</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            <Lock className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lifetime Access</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            <Clock className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Self Paced</span>
                    </div>
                </div>
            </motion.div>

            {/* Modern floating elements */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-4 h-4 rounded-full bg-primary/20 border border-primary/30"
            />
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-secondary/20 border border-secondary/30"
            />
        </div>
    );
};

export default ContentPlaceholder;
