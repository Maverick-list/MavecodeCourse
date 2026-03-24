import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Code2, MessageSquare, Sparkles, Send, 
    Cpu, CheckCircle, Bug, Zap, Lightbulb, 
    Terminal, Play, Copy, RefreshCcw, Maximize2 
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { usePageContext } from '../hooks/usePageContext';
import { toast } from 'sonner';
import { API } from '../context/AppContext';

// Helper to format code blocks in AI response
const formatAIResponse = (text) => {
    if (!text) return null;
    const segments = text.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, index) => {
        if (segment.startsWith('```')) {
            const match = segment.match(/```(\w+)?\n?([\s\S]*?)```/);
            const language = match?.[1] || 'javascript';
            const code = match?.[2] || '';
            
            return (
                <div key={index} className="my-4 rounded-xl overflow-hidden border border-primary/30 bg-black/50 shadow-lg">
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
        
        const formattedText = segment.split(/(\*\*.*?\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
        
        return <p key={index} className="mb-4 last:mb-0 leading-relaxed text-sm text-slate-300 whitespace-pre-wrap">{formattedText}</p>;
    });
};

const MentorDashboard = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Selamat datang di **MaveMentor AI Lab**. Saya adalah asisten AI tingkat lanjut yang siap menganalisis, memperbaiki, dan mengoptimalkan kode Anda.\n\nSilakan paste kode Anda di panel kiri dan pilih salah satu fitur analisis di atas atau tanya langsung di chat. 🚀' }
    ]);
    const [input, setInput] = useState('');
    const [code, setCode] = useState('// Ketik atau paste kode kamu di sini...\n\nfunction calculateTechScore() {\n  return "ASEAN Ready 2026!";\n}');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Ready for Analysis');
    const [activeAnalysisMode, setActiveAnalysisMode] = useState(null);
    
    const pageContext = usePageContext();
    const chatScrollRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages]);

    const runAnalysis = async (mode, customPrompt = '') => {
        if (loading) return;
        
        let prompt = customPrompt;
        setActiveAnalysisMode(mode);
        
        switch(mode) {
            case 'review': 
                prompt = "Tolong review kode ini secara mendalam berdasarkan standar industri terkini."; 
                setStatusMessage('AI is Reviewing Quality...');
                break;
            case 'fix': 
                prompt = "Temukan bug atau potensi error dari kode ini dan berikan solusinya."; 
                setStatusMessage('AI is Hunting for Bugs...');
                break;
            case 'optimize': 
                prompt = "Bagaimana cara mengoptimalkan performa atau efisiensi dari kode ini?"; 
                setStatusMessage('AI is Optimizing Logic...');
                break;
            case 'explain': 
                prompt = "Jelaskan alur logika kode ini secara mendetail untuk pemula."; 
                setStatusMessage('AI is Breaking Down Logic...');
                break;
            default:
                setStatusMessage('Thinking...');
        }

        const userMsg = { role: 'user', content: customPrompt || `[COMMAND: ${mode.toUpperCase()}]` };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await fetch(`${API}/mavementor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: prompt,
                    code: code,
                    mode: 'code',
                    pageContext,
                    history: messages
                })
            });

            const data = await res.json();
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.response || "Gagal memproses permintaan." 
            }]);
            
            toast.success('Analysis Complete!');
        } catch (error) {
            console.error('MaveMentor Lab Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Terjadi gangguan pada sirkuit AI. Mohon coba lagi." 
            }]);
            toast.error('Connection Lost');
        } finally {
            setLoading(false);
            setStatusMessage('Ready for Analysis');
            setActiveAnalysisMode(null);
        }
    };

    const handleChatSubmit = () => {
        if (!input.trim() || loading) return;
        const msg = input;
        setInput('');
        runAnalysis('chat', msg);
    };

    return (
        <div className="min-h-screen pt-20 bg-slate-950 text-slate-200 font-sans selection:bg-primary/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)] flex flex-col gap-4 pb-4 mt-4">
                
                {/* Header Stats / Status Bar */}
                <div className="flex flex-wrap items-center justify-between bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-glow-sm shadow-primary/5">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                                <Sparkles className="text-primary w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                                    MAVEMENTOR <span className="text-primary">AI LAB</span>
                                </h1>
                                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Industry Grade Mentorship • V1.5 Pro</p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-6 h-10">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Context Detection</span>
                                <span className="text-xs font-mono text-primary uppercase">{pageContext.language}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">AI Status</span>
                                <span className="text-xs font-mono flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-green-500'}`} />
                                    {statusMessage}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold font-mono">
                            <Terminal size={14} className="text-primary" />
                            SESSION_LOGS
                        </button>
                    </div>
                </div>

                {/* Split Main Area */}
                <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
                    
                    {/* Left: Enhanced Editor */}
                    <div className="flex-[1.2] flex flex-col bg-slate-900/30 rounded-3xl border border-white/10 overflow-hidden group shadow-2xl backdrop-blur-sm">
                        {/* Editor Controls */}
                        <div className="px-5 py-3 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                </div>
                                <span className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">workspace_v1.js</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCode('')}
                                    className="p-1 text-slate-500 hover:text-white transition-colors"
                                    title="Reset Code"
                                >
                                    <RefreshCcw size={14} />
                                </button>
                                <button className="p-1 text-slate-500 hover:text-white transition-colors">
                                    <Maximize2 size={14} />
                                </button>
                                <button 
                                    onClick={() => runAnalysis('review')}
                                    disabled={loading}
                                    className="ml-2 flex items-center gap-2 bg-primary px-4 py-1.5 rounded-xl text-black font-black text-[10px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    <Play size={12} fill="currentColor" />
                                    Review
                                </button>
                            </div>
                        </div>

                        {/* Monaco Editor Container */}
                        <div className="flex-1 min-h-[300px] p-2 relative bg-[#1e1e1e]">
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language={pageContext.language.toLowerCase().includes('python') ? 'python' : 'javascript'}
                                value={code}
                                onChange={setCode}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: true,
                                    scrollBeyondLastLine: false,
                                    readOnly: loading,
                                    padding: { top: 20 },
                                    cursorStyle: 'block-outline',
                                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                                    fontLigatures: true,
                                    scrollbar: {
                                        useShadows: false,
                                        verticalHasArrows: false,
                                        horizontalHasArrows: false,
                                        vertical: 'hidden',
                                        horizontal: 'hidden'
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: AI Brain Terminal */}
                    <div className="flex-1 flex flex-col bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative backdrop-blur-sm">
                        
                        {/* Action Buttons Toolbar */}
                        <div className="grid grid-cols-4 border-b border-white/10 bg-slate-900/80">
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
                                    className={`flex flex-col items-center justify-center gap-2 py-4 border-r last:border-r-0 border-white/10 hover:bg-white/5 transition-all relative group disabled:opacity-50 ${activeAnalysisMode === btn.id ? 'bg-primary/10' : ''}`}
                                >
                                    <btn.icon size={20} className={`${btn.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{btn.label}</span>
                                    {activeAnalysisMode === btn.id && (
                                        <motion.div layoutId="mode-border" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Chat Context Content */}
                        <div 
                            ref={chatScrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
                        >
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`group relative max-w-[90%] rounded-2xl px-5 py-4 shadow-xl overflow-hidden ${
                                            msg.role === 'user' 
                                            ? 'bg-primary/90 text-black font-semibold' 
                                            : 'bg-slate-800/40 border border-white/10 backdrop-blur-md'
                                        }`}>
                                            {/* AI message decorative indicator */}
                                            {msg.role === 'assistant' && (
                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                                            )}
                                            
                                            <div className="flex flex-col gap-1.5">
                                                {msg.role === 'assistant' ? formatAIResponse(msg.content) : (
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {loading && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-800/20 border border-primary/20 rounded-2xl px-6 py-4 flex gap-4 items-center">
                                        <div className="relative">
                                            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <div className="absolute inset-0 w-6 h-6 border-2 border-primary/10 rounded-full animate-ping scale-150 opacity-20" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-primary animate-pulse uppercase tracking-[0.2em]">{statusMessage}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">Neural Processing Gemini 1.5 Pro</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-slate-900/80 border-t border-white/10 relative overflow-hidden">
                            {/* Input Glow Surround */}
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 pointer-events-none" />
                            
                            <div className="relative flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                        disabled={loading}
                                        placeholder={`Tanya Mentor seputar ${pageContext.language}...`}
                                        className="w-full bg-black/40 border border-white/10 focus:border-primary/50 text-white rounded-2xl py-4 px-5 pr-12 text-sm transition-all outline-none backdrop-blur-md shadow-inner"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 group">
                                        <div className="hidden group-hover:block text-[8px] font-mono text-slate-500 pr-2">Enter to Send</div>
                                        <MessageSquare size={16} className="text-slate-600" />
                                    </div>
                                </div>
                                <button
                                    onClick={handleChatSubmit}
                                    disabled={loading || !input.trim()}
                                    className="p-4 bg-primary text-black rounded-2xl hover:bg-primary/80 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-xl shadow-primary/20 active:scale-90"
                                >
                                    <Send size={20} className={loading ? 'animate-pulse' : ''} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> API SECURE
                                    </span>
                                    <span className="flex items-center gap-1 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                                        <RefreshCcw size={10} /> AUTO_SAVE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
