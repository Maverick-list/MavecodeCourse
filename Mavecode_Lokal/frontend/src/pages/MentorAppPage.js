import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Terminal, Database, History, Search, 
    Settings, Globe, ShieldCheck, Code2, Play, Hexagon, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentorAppPage = () => {
    const navigate = useNavigate();
    const [activeSidebarItem, setActiveSidebarItem] = useState('history');
    
    // ASEAN Mock Impact Metrics
    const aseanImpact = { reach: 840, languages: ['🇮🇩', '🇻🇳', '🇹🇭', '🇵🇭'] };

    return (
        <div className="w-screen h-screen bg-[#070a13] text-slate-300 font-sans flex overflow-hidden selection:bg-primary/30">
            {/* Primary Left Rail (Like VS Code activity bar) */}
            <div className="w-14 bg-[#0a0f1c] border-r border-white/5 flex flex-col items-center py-4 justify-between z-20">
                <div className="flex flex-col gap-6 items-center">
                    <button 
                        onClick={() => navigate('/mentor')}
                        className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
                        title="Back to Web Version"
                    >
                        <Hexagon size={20} className="drop-shadow-[0_0_8px_currentColor]" />
                    </button>
                    
                    <div className="w-6 h-[1px] bg-white/10" />

                    <NavIcon icon={History} label="History" isActive={activeSidebarItem === 'history'} onClick={() => setActiveSidebarItem('history')} />
                    <NavIcon icon={ShieldCheck} label="Linter" isActive={activeSidebarItem === 'linter'} onClick={() => setActiveSidebarItem('linter')} />
                    <NavIcon icon={Globe} label="ASEAN Impact" isActive={activeSidebarItem === 'asean'} onClick={() => setActiveSidebarItem('asean')} />
                </div>
                
                <div className="flex flex-col gap-4 items-center">
                    <NavIcon icon={Settings} label="Settings" />
                </div>
            </div>

            {/* Sidebar Secondary Panel */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeSidebarItem}
                    initial={{ x: -250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -250, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="w-72 bg-[#0c111d] border-r border-white/5 flex flex-col z-10 shadow-2xl"
                >
                    <div className="h-14 border-b border-white/5 flex items-center px-4">
                        <span className="text-xs uppercase font-black tracking-widest text-slate-400">
                            {activeSidebarItem === 'history' ? 'Check History' : activeSidebarItem === 'linter' ? 'Code Linter' : 'ASEAN Dashboard'}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeSidebarItem === 'history' && (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 hover:border-primary/40 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-mono text-primary">#REQ-84{i}</span>
                                            <span className="text-[9px] text-slate-500">2 min ago</span>
                                        </div>
                                        <p className="text-xs text-slate-400 truncate">Optimized auth flow...</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSidebarItem === 'linter' && (
                            <div className="flex flex-col gap-6">
                                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 flex flex-col items-center justify-center py-8">
                                    <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" strokeDasharray="276" strokeDashoffset="40" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute text-2xl font-black font-mono text-green-500 drop-shadow-md">85%</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-green-500">Neatness Metric</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs text-amber-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Removed unused imports</div>
                                    <div className="text-xs text-green-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Syntax properly indented</div>
                                </div>
                            </div>
                        )}

                        {activeSidebarItem === 'asean' && (
                            <div className="flex flex-col gap-5">
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <div className="text-3xl font-black text-white glow-text mb-1">{aseanImpact.reach}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Simulated Regional Impact</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Toggle Translation Context</span>
                                    {aseanImpact.languages.map((flag, idx) => (
                                        <button key={idx} className="p-3 rounded-lg border border-white/5 hover:bg-white/5 flex items-center justify-between group transition-all">
                                            <span className="text-2xl">{flag}</span>
                                            <span className="text-xs text-slate-400 group-hover:text-white font-mono">Sync Channel</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Main Desktop IDE Area */}
            <div className="flex-1 flex flex-col relative z-0">
                {/* File Tabs */}
                <div className="h-10 bg-[#070a13] flex items-end px-2 border-b border-white/5">
                    <div className="px-5 py-2 bg-[#0d1322] border-t border-x border-primary/30 rounded-t-lg text-xs font-mono text-primary flex items-center gap-3">
                         <Code2 size={14} /> MaveMentor Engine
                         <button className="hover:text-white ml-2"><div className="w-2 h-2 rounded-full bg-red-500" /></button>
                    </div>
                </div>

                {/* Simulated IDE Content */}
                <div className="flex-1 bg-[#0d1322] p-8 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_100%)]" />
                    
                    <div className="text-center relative z-10">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center mb-6">
                            <div className="w-24 h-24 border border-primary/30 rounded-3xl flex items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                                <Globe size={40} className="text-primary animate-pulse" />
                            </div>
                        </motion.div>
                        <h2 className="text-2xl font-black tracking-tight text-white mb-2">MAVEMENTOR DIMENSION</h2>
                        <p className="text-sm text-slate-400 max-w-md mx-auto">
                            The elite desktop-grade development environment for the AI Ready ASEAN 2026 Competition.
                            <br /><br />
                            <span className="text-primary font-mono text-xs">(Full editor functionality syncing in progress...)</span>
                        </p>
                    </div>
                </div>
                
                {/* App Bottom Status Bar */}
                <div className="h-6 bg-primary text-black flex items-center justify-between px-3 text-[10px] font-mono font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Terminal size={12} /> Dimension Root</span>
                        <span className="flex items-center gap-1">UTF-8</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Linter: OK</span>
                        <span>0 Errors, 0 Warnings</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NavIcon = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
        <Icon size={20} className={isActive ? 'drop-shadow-[0_0_5px_currentColor]' : ''} />
        {/* Tooltip */}
        <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[10px] rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {label}
        </div>
    </button>
);

export default MentorAppPage;
