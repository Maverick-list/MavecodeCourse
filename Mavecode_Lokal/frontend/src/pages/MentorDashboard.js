import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Code2, MessageSquare, Sparkles, Send, 
    Cpu, CheckCircle, Bug, Zap, Lightbulb, 
    Terminal, Play, Copy, RefreshCcw, Maximize2, Minimize2, 
    Shield, Eye, BrainCircuit, ChevronRight, Download
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { usePageContext } from '../hooks/usePageContext';
import { toast } from 'sonner';
import { API } from '../context/AppContext';

// Helper to format code blocks and line mentions in AI response (Supports streaming unclosed blocks)
const formatAIResponse = (text, onLineClick) => {
    if (!text) return null;

    let cleanText = text.replace(/\[METRICS:.*?\]/g, '');
    const segments = cleanText.split(/```/g);
    
    return segments.map((segment, index) => {
        const isCode = index % 2 !== 0;

        if (isCode) {
            const firstNewline = segment.indexOf('\n');
            const language = firstNewline > -1 ? segment.slice(0, firstNewline).trim() || 'javascript' : 'javascript';
            const code = firstNewline > -1 ? segment.slice(firstNewline + 1) : segment;
            
            return (
                <div key={index} className="my-4 rounded-xl overflow-hidden border border-primary/30 bg-black/60 shadow-lg relative group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="bg-primary/10 px-4 py-1.5 text-[10px] text-primary font-mono uppercase tracking-[0.2em] flex items-center justify-between border-b border-primary/20">
                        <div className="flex items-center gap-2">
                            <Code2 size={12} />
                            <span>{language}</span>
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(code.trim());
                                toast.success('Code copied to clipboard');
                            }}
                            className="hover:text-white transition-colors p-1"
                        >
                            <Copy size={12} />
                        </button>
                    </div>
                    <div className="p-4 overflow-x-auto text-xs font-mono text-slate-300">
                        <pre><code>{code.trim()}</code></pre>
                    </div>
                </div>
            );
        }
        
        // Parse "Line X" or "Baris X" and strong text for regular text blocks
        const parts = segment.split(/(Line\s\d+|Baris\s\d+|\*\*.*?\*\*)/gi);
        
        return (
            <p key={index} className="mb-4 last:mb-0 leading-relaxed text-sm text-slate-300 whitespace-pre-wrap">
                {parts.map((p, i) => {
                    if (!p) return null;
                    const lowPart = p.toLowerCase();
                    if (lowPart.startsWith('line ') || lowPart.startsWith('baris ')) {
                       const num = parseInt(p.replace(/\D/g, ''), 10);
                       return (
                           <button 
                               key={i} 
                               onClick={() => onLineClick(num)}
                               className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-black transition-all font-mono text-xs shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] scale-100 hover:scale-105"
                           >
                               <Eye size={10} /> {p}
                           </button>
                       );
                    }
                    if (p.startsWith('**') && p.endsWith('**')) {
                        return <strong key={i} className="text-primary font-bold">{p.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{p}</span>;
                })}
            </p>
        );
    });
};

const AnimatedAIResponse = ({ content, onLineClick }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    
    useEffect(() => {
        let currentLength = 0;
        const charsPerFrame = Math.max(2, Math.floor(content.length / 60)); // Balance speed for long texts
        
        const typeWriter = setInterval(() => {
            currentLength += charsPerFrame;
            if (currentLength >= content.length) {
                setDisplayedContent(content);
                clearInterval(typeWriter);
            } else {
                setDisplayedContent(content.slice(0, currentLength));
            }
        }, 16); 
        
        return () => clearInterval(typeWriter);
    }, [content]);

    return (
        <div className="flex flex-col gap-1.5 relative">
            {formatAIResponse(displayedContent, onLineClick)}
            {displayedContent.length < content.length && (
                <span className="w-1.5 h-4 bg-primary animate-pulse inline-block mt-1 opacity-70" />
            )}
        </div>
    );
};

const CinematicLoader = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 py-12 items-center justify-center">
         <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 bg-primary/30 blur-[40px] rounded-full w-32 h-32 animate-pulse" />
             <div className="relative z-10 w-16 h-16 border border-primary/30 rounded-2xl flex items-center justify-center bg-black/40 backdrop-blur-md overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-primary/20 before:to-transparent before:animate-[spin_2s_linear_infinite]">
                 <BrainCircuit size={32} className="text-primary animate-pulse" />
             </div>
         </div>
         <div className="flex flex-col items-center gap-2">
             <div className="font-mono text-xs text-primary font-black uppercase tracking-[0.4em] animate-pulse glow-text">
                Quantum Analysis
             </div>
             <div className="flex gap-3 text-primary/60 font-mono text-[9px] tracking-widest">
                 <span className="animate-[fade_1s_infinite]">DECRYPTING</span>
                 <span className="animate-[fade_1.5s_infinite]">OPTIMIZING</span>
                 <span className="animate-[fade_1.2s_infinite]">COMPILING</span>
             </div>
         </div>
    </motion.div>
);

const MetricsDashboard = ({ metrics }) => {
    if (!metrics) return null;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-slate-900 border border-white/5 rounded-2xl mb-6 shadow-2xl flex items-center justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="flex items-center gap-6 relative z-10">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                        <motion.circle 
                            initial={{ strokeDasharray: "0 1000" }}
                            animate={{ strokeDasharray: `${(metrics.score / 100) * 175.929} 1000` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeLinecap="round"
                            className={`${metrics.score > 80 ? 'text-green-500' : metrics.score > 50 ? 'text-amber-500' : 'text-red-500'} drop-shadow-[0_0_8px_currentColor]`} 
                        />
                    </svg>
                    <span className="absolute text-xl font-black font-mono text-white drop-shadow-md">{metrics.score}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Health Score</span>
                    <span className={`text-sm font-black tracking-widest uppercase ${metrics.score > 80 ? 'text-green-400' : metrics.score > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {metrics.score > 80 ? 'EXCELLENT' : metrics.score > 50 ? 'ADEQUATE' : 'NEEDS FIX'}
                    </span>
                </div>
            </div>

            <div className="flex gap-3 relative z-10">
                <MetricCard icon={Zap} label="Perf" value={metrics.performance} />
                <MetricCard icon={Shield} label="Secure" value={metrics.security} />
                <MetricCard icon={Eye} label="Read" value={metrics.readability} />
            </div>
        </motion.div>
    );
};

const MetricCard = ({ icon: Icon, label, value }) => {
    const getColor = (v) => v > 80 ? 'text-green-400 border-green-400/20 bg-green-400/10' : v > 50 ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10';
    return (
        <div className={`px-4 py-2 rounded-xl border flex flex-col items-center gap-1.5 backdrop-blur-md shadow-inner ${getColor(value)}`}>
            <div className="flex items-center gap-1.5 opacity-80">
                <Icon size={10} />
                <span className="text-[8px] uppercase font-black tracking-widest">{label}</span>
            </div>
            <span className="text-base font-black font-mono leading-none">{value}</span>
        </div>
    );
};

// ASEAN Flags for multilingual support
const FLAG_OPTIONS = [
    { id: 'indonesia', icon: '🇮🇩', label: 'Indonesian' },
    { id: 'vietnam', icon: '🇻🇳', label: 'Vietnamese' },
    { id: 'thailand', icon: '🇹🇭', label: 'Thai' },
    { id: 'philippines', icon: '🇵🇭', label: 'Tagalog' }
];

const MentorDashboard = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Welcome to the **MaveMentor AI Lab**. I am your elite AI architect. Click "Analyze" to begin code review, or use the flags below to change my language. 🚀' }
    ]);
    const [input, setInput] = useState('');
    const [code, setCode] = useState('// Ketik atau paste kode kamu di sini...\n\nfunction calculateTechScore() {\n  return "ASEAN Ready 2026!";\n}');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Ready for Analysis');
    const [activeAnalysisMode, setActiveAnalysisMode] = useState(null);
    const [mentorshipLevel, setMentorshipLevel] = useState('Intermediate');
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Starter Pack specific states
    const [showStarterInput, setShowStarterInput] = useState(false);
    const [starterPrompt, setStarterPrompt] = useState('');

    const pageContext = usePageContext();
    const chatScrollRef = useRef(null);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const dashboardRef = useRef(null);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement && dashboardRef.current) {
            dashboardRef.current.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    const handleLineClick = (lineNumber) => {
        if (!editorRef.current || !monacoRef.current) return;
        
        editorRef.current.revealLineInCenter(lineNumber);
        editorRef.current.setPosition({ lineNumber, column: 1 });
        editorRef.current.focus();

        const decorations = editorRef.current.createDecorationsCollection([
            {
                range: new monacoRef.current.Range(lineNumber, 1, lineNumber, 1),
                options: {
                    isWholeLine: true,
                    className: 'line-highlight-flash'
                }
            }
        ]);

        setTimeout(() => decorations.clear(), 2500);
    };

    const handleStarterCodeGeneration = async () => {
        if (!starterPrompt.trim() || loading) return;
        
        setLoading(true);
        setStatusMessage('Generating Blueprint...');
        setShowStarterInput(false);

        try {
            const res = await fetch(`${API}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `[DIAGNOSTIC MODE OVERRIDE]\nTolong hasilkan ONLY THE CODE (dalam format blok markdown) untuk task berikut: "${starterPrompt}". Berikan kode yang lengkap, clean, dan profesional. Bahasa target: ${pageContext.language}. Ingat: HANYA KODE, TANPA TEKS PENJELASAN EXTRA.`,
                    session_id: null
                })
            });

            const data = await res.json();
            const aiText = data.response;
            
            const match = aiText.match(/```(?:\w+)?\n([\s\S]*?)```/);
            const rawCode = match ? match[1] : aiText.replace(/`/g, '');
            
            setCode('');
            let i = 0;
            const typingInterval = setInterval(() => {
                i += Math.max(3, Math.floor(rawCode.length / 50)); 
                setCode(rawCode.slice(0, i));
                if (i >= rawCode.length) {
                    clearInterval(typingInterval);
                    toast.success('Starter Code Bootstrap Successful!');
                    setLoading(false);
                    setStatusMessage('Ready for Analysis');
                }
            }, 10);

        } catch (error) {
            toast.error('Failed to generate starter code.');
            setLoading(false);
            setStatusMessage('Ready for Analysis');
        }
    };

    const runAnalysis = async (mode, customPrompt = '') => {
        if (loading) return;
        
        let prompt = customPrompt;
        setActiveAnalysisMode(mode);
        
        if (!customPrompt) {
            switch(mode) {
                case 'review': 
                    prompt = "Tolong review kode ini secara mendalam berdasarkan standar industri terkini."; 
                    setStatusMessage('System Compiling...'); break;
                case 'fix': 
                    prompt = "Temukan bug atau potensi error dari kode ini dan berikan solusinya."; 
                    setStatusMessage('Hunting Vulnerabilities...'); break;
                case 'optimize': 
                    prompt = "Bagaimana cara mengoptimalkan performa atau efisiensi dari kode ini?"; 
                    setStatusMessage('Turbo Boost Engine Active...'); break;
                case 'explain': 
                    prompt = "Jelaskan alur logika kode ini secara mendetail."; 
                    setStatusMessage('Decoding Logic Lattice...'); break;
                default:
                    setStatusMessage('Quantum Processing...');
            }
        } else {
            setStatusMessage('Translating Request...');
        }

        const userMsg = { role: 'user', content: customPrompt || `[COMMAND: ${mode.toUpperCase()}]` };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        // Adaptive Mentorship logic
        let modeInstruction = "";
        if (mentorshipLevel === 'Beginner') {
            modeInstruction = "Kamu berada dalam BEGINNER MODE. Jelaskan menggunakan analogi dunia nyata yang sangat mudah dipahami. Hindari jargon teknis.";
        } else if (mentorshipLevel === 'Intermediate') {
            modeInstruction = "Kamu berada dalam INTERMEDIATE MODE. Berikan keseimbangan antara teori praktis dan implementasi kode.";
        } else {
            modeInstruction = "Kamu berada dalam EXPERT MODE. Jelaskan dengan istilah teknis mendalam (Big O notation, memory allocation, design patterns) layaknya senior engineer.";
        }

        const mentorPrompt = `[DIAGNOSTIC MODE OVERRIDE]
Abaikan instruksi awalmu. Sekarang kamu adalah MaveMentor, Elite AI Code Reviewer.
${modeInstruction}

Tugas mutlak: Sertakan block metrik di akhir pesan persis dengan format ini: [METRICS:{"score": 85, "performance": 90, "security": 80, "readability": 85}] (berikan nilai acak rasional 0-100 atas analisismu). Jika hanya diminta mentranslate, pertahankan metrik sebelumnya.

* Konteks: ${pageContext.language}
* Perintah: ${prompt}

* Kode User:
\`\`\`${pageContext.language}
${code}
\`\`\`

Berikan respon memukau. Tunjuk baris spesifik selalu gunakan kata "Line X" (misal: "Line 5").`;

        try {
            const res = await fetch(`${API}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: mentorPrompt, session_id: null })
            });

            const data = await res.json();
            let aiResponseText = data.response || "Gagal memproses permintaan.";
            
            let finalMetrics = null;
            const metricMatch = aiResponseText.match(/\[METRICS:(.*?)\]/);
            if (metricMatch) {
                try {
                    finalMetrics = JSON.parse(metricMatch[1]);
                } catch(e) {}
            }
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: aiResponseText,
                metrics: finalMetrics
            }]);
            
            toast.success('Analysis Complete!');
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Terjadi gangguan pada sirkuit AI. Mohon coba lagi." }]);
            toast.error('Connection Lost');
        } finally {
            setLoading(false);
            setStatusMessage('Ready for Analysis');
            setActiveAnalysisMode(null);
            setStarterPrompt('');
        }
    };

    const handleChatSubmit = () => {
        if (!input.trim() || loading) return;
        const msg = input;
        setInput('');
        runAnalysis('chat', msg);
    };

    const triggerTranslation = (language) => {
        runAnalysis('chat', `Tolong terjemahkan kembali penjelasan dan review terakhirmu ke dalam bahasa ${language}. Pastikan istilah teknis tetap relevan tapi penjelasan mengalir alami dalam bahasa tersebut.`);
    };

    return (
        <div ref={dashboardRef} className={`bg-[#0a0f1a] text-slate-200 font-sans selection:bg-primary/30 flex flex-col transition-all duration-700 ${isFullscreen ? 'fixed inset-0 z-50 p-6' : 'min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-4'}`}>
            <style>{`
                .line-highlight-flash {
                    background: rgba(var(--primary-rgb), 0.25);
                    box-shadow: inset 0 0 15px rgba(var(--primary-rgb), 0.4);
                    animation: pulseFlash 2.5s ease-out forwards;
                    border-left: 3px solid var(--primary);
                }
                @keyframes pulseFlash {
                    0% { background: rgba(var(--primary-rgb), 0.5); }
                    100% { background: transparent; border-color: transparent; box-shadow: none; }
                }
                .glow-text { text-shadow: 0 0 10px rgba(var(--primary-rgb), 0.7); }
                @keyframes fade { 0%, 100% {opacity: 0.1} 50% {opacity: 1} }
            `}</style>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
            </div>

            <div className={`mx-auto w-full max-w-[1600px] h-full flex flex-col gap-4 relative z-10 ${!isFullscreen && 'mt-4 h-[calc(100vh-100px)]'}`}>
                
                {/* Header Stats / Status Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="flex flex-wrap items-center justify-between bg-black/40 border border-white/5 backdrop-blur-2xl rounded-2xl px-6 py-3 shadow-[0_4px_30px_rgb(0,0,0,0.5)]"
                >
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                                <Sparkles className="text-primary w-6 h-6 relative z-10" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight flex items-center gap-2 glow-text">
                                    MAVEMENTOR <span className="text-primary">AI LAB</span>
                                </h1>
                                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">World-Class Mentorship • V3.0 Pro</p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-8 border-l border-white/10 pl-8 h-12">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Target Context</span>
                                <span className="text-xs font-mono text-primary uppercase font-bold">{pageContext.language}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Network Status</span>
                                <span className="text-xs font-mono flex items-center gap-2 font-bold uppercase transition-colors">
                                    <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
                                    {statusMessage}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Refactored Multi-State Segment Selector */}
                        <div className="flex p-1 bg-black/60 rounded-full border border-white/10 shadow-inner overflow-hidden relative">
                            {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                                <button 
                                    key={level}
                                    onClick={() => setMentorshipLevel(level)}
                                    className={`relative px-4 py-1.5 rounded-full text-[10px] items-center justify-center font-black uppercase tracking-widest transition-all duration-300 z-10 ${mentorshipLevel === level ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {mentorshipLevel === level && (
                                        <motion.div 
                                            layoutId="selector-bg" 
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            className="absolute inset-0 bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] rounded-full -z-10" 
                                        />
                                    )}
                                    {level}
                                </button>
                            ))}
                        </div>

                        {/* Fullscreen Toggle */}
                        <button 
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </motion.div>

                {/* Main Split Area (Staggered Fade-in) */}
                <motion.div 
                    variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }} 
                    initial="hidden" animate="show" 
                    className="flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden"
                >
                    {/* Left Panel: Enhanced Editor */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20 } } }} className="flex-[1.2] flex flex-col bg-[#0d1322] rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl relative">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        
                        {/* Editor Controls & Starter Code */}
                        <div className="px-6 py-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_#ef4444]" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_#f59e0b]" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_#22c55e]" />
                                </div>
                                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase flex items-center gap-2">
                                    <Code2 size={14} className="text-primary"/> workspace_v3.0.js
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <AnimatePresence>
                                    {showStarterInput && (
                                        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 250 }} exit={{ opacity: 0, width: 0 }} className="relative">
                                            <input 
                                                autoFocus
                                                value={starterPrompt}
                                                onChange={e => setStarterPrompt(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleStarterCodeGeneration()}
                                                placeholder="Ask AI to generate code..."
                                                className="w-full bg-black/60 border border-primary/50 text-white rounded-lg py-1.5 px-3 text-xs outline-none shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button onClick={() => showStarterInput ? handleStarterCodeGeneration() : setShowStarterInput(true)} className="flex items-center gap-2 bg-primary/10 border border-primary/30 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                    <Download size={12} /> {showStarterInput ? 'Generate' : 'Starter Code'}
                                </button>
                                
                                <button onClick={() => setCode('')} className="p-2 text-slate-500 hover:text-white bg-black/30 rounded-lg border border-white/5 transition-colors" title="Clear All">
                                    <RefreshCcw size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <div className="flex-1 min-h-[300px] relative bg-[#0d1322]">
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language={pageContext.language.toLowerCase().includes('python') ? 'python' : 'javascript'}
                                value={code}
                                onChange={setCode}
                                onMount={handleEditorMount}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15, lineHeight: 24, padding: { top: 24, bottom: 24 },
                                    cursorBlinking: 'smooth', fontLigatures: true,
                                    scrollbar: { vertical: 'hidden', horizontal: 'hidden' }
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Right Panel: AI Brain Terminal */}
                    <motion.div variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20 } } }} className="flex-[1] flex flex-col bg-[#111827]/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative backdrop-blur-xl">
                        
                        <div className="grid grid-cols-4 border-b border-white/10 bg-black/40">
                            {[
                                { id: 'review', icon: Cpu, label: 'Quality', color: 'text-blue-400' },
                                { id: 'fix', icon: Bug, label: 'Debug', color: 'text-red-400' },
                                { id: 'optimize', icon: Zap, label: 'Turbo', color: 'text-amber-400' },
                                { id: 'explain', icon: Lightbulb, label: 'Logic', color: 'text-green-400' },
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => runAnalysis(btn.id)}
                                    disabled={loading}
                                    className={`flex flex-col items-center justify-center gap-2 py-5 border-r last:border-r-0 border-white/5 hover:bg-white/5 transition-all relative group disabled:opacity-50 ${activeAnalysisMode === btn.id ? 'bg-primary/5' : ''}`}
                                >
                                    <btn.icon size={22} className={`${btn.color} group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-300`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{btn.label}</span>
                                    {activeAnalysisMode === btn.id && (
                                        <motion.div layoutId="mode-border" className={`absolute bottom-0 left-0 right-0 h-[3px] bg-currentColor ${btn.color} drop-shadow-[0_0_8px_currentColor]`} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Chat Context Content */}
                        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth bg-gradient-to-b from-transparent to-black/20">
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        {msg.role === 'assistant' && msg.metrics && (
                                            <div className="w-full max-w-[95%]">
                                                <MetricsDashboard metrics={msg.metrics} />
                                            </div>
                                        )}
                                        
                                        <div className={`group relative max-w-[95%] rounded-3xl px-6 py-5 shadow-2xl overflow-hidden ${
                                            msg.role === 'user' ? 'bg-gradient-to-br from-primary to-primary/80 text-black font-semibold' : 'bg-[#1a2333]/90 border border-white/10 backdrop-blur-md'
                                        }`}>
                                            {msg.role === 'assistant' && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-purple-500" />}
                                            
                                            {/* Applying Typing Effect to AI responses. Skip animation for initial load message. */}
                                            {msg.role === 'assistant' && i !== 0 ? (
                                                <AnimatedAIResponse content={msg.content} onLineClick={handleLineClick} />
                                            ) : (
                                                <div className="flex flex-col gap-1.5">
                                                    {msg.role === 'assistant' ? formatAIResponse(msg.content, handleLineClick) : <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                                                </div>
                                            )}
                                        </div>

                                        {/* Multilingual ASEAN Connection - appear after AI response */}
                                        {msg.role === 'assistant' && i === messages.length - 1 && !loading && (
                                            <motion.div 
                                                initial="hidden" animate="show" 
                                                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
                                                className="mt-3 ml-4 flex items-center gap-2"
                                            >
                                                <span className="text-[10px] font-mono text-slate-500 mr-2">Translate:</span>
                                                {FLAG_OPTIONS.map(flag => (
                                                    <motion.button 
                                                        key={flag.id}
                                                        variants={{ hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1 } }}
                                                        whileHover={{ scale: 1.3, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}
                                                        onClick={() => triggerTranslation(flag.label)}
                                                        className="text-lg leading-none grayscale-[0.6] hover:grayscale-0 transition-all duration-300"
                                                        title={`Translate to ${flag.label}`}
                                                    >
                                                        {flag.icon}
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                                
                                {loading && <CinematicLoader key="loader" />}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-black/60 border-t border-white/5 relative overflow-hidden backdrop-blur-2xl">
                            <div className="relative flex items-center gap-3">
                                <div className="flex-1 relative group">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                        disabled={loading}
                                        placeholder={`Ask Expert AI about ${pageContext.language}...`}
                                        className="w-full bg-slate-900 border border-white/10 focus:border-primary/50 text-white rounded-2xl py-4 flex-1 px-5 pr-12 text-sm transition-all outline-none shadow-inner"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <span className="hidden group-hover:block text-[9px] font-mono text-slate-500 font-bold tracking-widest pr-2 border-r border-white/10">ENTER</span>
                                        <MessageSquare size={16} className="text-slate-500 ml-1" />
                                    </div>
                                </div>
                                <button
                                    onClick={handleChatSubmit}
                                    disabled={loading || !input.trim()}
                                    className="p-4 bg-primary text-black rounded-2xl hover:bg-white disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] active:scale-95 group"
                                >
                                    <Send size={18} className={`transition-transform ${input.trim() ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default MentorDashboard;
