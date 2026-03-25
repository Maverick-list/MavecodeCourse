import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, MessageSquareText, Sparkles, Send, Maximize2, Minimize2, Cpu, CheckCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { usePageContext } from '../hooks/usePageContext';
import { toast } from 'sonner';
import { API } from '../context/AppContext';

// Helper to format code blocks in AI response
const formatAIResponse = (text) => {
    if (!text) return null;
    
    // Clean text by removing any metrics metadata
    let cleanText = text.replace(/\[METRICS:.*?\]/g, '').trim();

    // Split text by markdown code blocks
    const segments = cleanText.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, index) => {
        if (segment.startsWith('```')) {
            const match = segment.match(/```(\w+)?\n?([\s\S]*?)```/);
            const language = match?.[1] || 'javascript';
            const code = match?.[2] || '';
            
            return (
                <div key={index} className="my-3 rounded-xl overflow-hidden border border-primary/30 bg-black/50">
                    <div className="bg-primary/20 px-3 py-1 text-[10px] text-primary font-mono uppercase tracking-widest flex items-center justify-between">
                        <span>{language}</span>
                        <Code2 size={12} />
                    </div>
                    <div className="p-3 overflow-x-auto text-xs font-mono text-slate-300">
                        <pre><code>{code.trim()}</code></pre>
                    </div>
                </div>
            );
        }
        
        const formattedText = segment.split(/(\*\*.*?\*\*)/g).map((part, i) => {
            if (part && part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
        
        return <p key={index} className="mb-2 last:mb-0 leading-relaxed text-sm whitespace-pre-wrap">{formattedText}</p>;
    });
};

export const MaveMentor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'code'
    
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Halo! Saya MaveMentor, Asisten AI dan Code Reviewer pribadimu. Ada materi yang belum paham atau kode yang error? 🚀' }
    ]);
    const [input, setInput] = useState('');
    const [code, setCode] = useState('// Ketik atau paste kode kamu di sini...\n\nfunction calculateTechScore() {\n  return "ASEAN Ready 2026!";\n}');
    const [loading, setLoading] = useState(false);
    
    const pageContext = usePageContext();
    const chatScrollRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() && activeTab === 'chat') return;
        if (!code.trim() && activeTab === 'code') return;
        if (loading) return;

        const currentMessage = activeTab === 'code' ? input || 'Tolong review kode ini.' : input;
        
        // Add user message to UI immediately
        const userMsg = { role: 'user', content: activeTab === 'code' ? `[CODE REVIEW REQUEST]\n${currentMessage}` : currentMessage };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Include history to maintain conversation context
            const res = await fetch(`${API}/mavementor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentMessage,
                    code: activeTab === 'code' ? code : '',
                    mode: activeTab,
                    pageContext,
                    history: messages
                })
            });

            if (!res.ok) {
                // If the backend isn't deployed yet or fails, fallback to error message
                throw new Error('API request failed');
            }

            const data = await res.json();
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.response || "Maaf, aku tidak mendapatkan respon yang valid dari server." 
            }]);
            
            toast.success(activeTab === 'code' ? 'Code Review Selesai!' : 'Balasan Diterima!', {
                icon: <Sparkles className="w-4 h-4 text-primary" />
            });
            
        } catch (error) {
            console.error('MaveMentor Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Waduh, koneksi ke modul AI sepertinya terganggu. Pastikan kamu terhubung ke internet. 🔌" 
            }]);
            toast.error('Gagal terhubung ke MaveMentor AI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Widget Button (Bottom Left) */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                    transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 left-6 z-50 rounded-2xl bg-gradient-to-br from-indigo-600 to-primary p-[2px] shadow-2xl shadow-primary/20 backdrop-blur-md group"
                >
                    <div className="bg-slate-950/90 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <div className="relative">
                            <Cpu className="text-primary w-6 h-6" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-[10px] uppercase font-bold text-primary tracking-widest leading-none mb-1">AI Mentor</p>
                            <p className="text-sm font-bold text-white leading-none">MaveMentor</p>
                        </div>
                    </div>
                </motion.button>
            )}

            {/* AI Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed bottom-6 left-6 z-50 bg-slate-950/95 backdrop-blur-2xl border border-primary/30 rounded-3xl shadow-2xl shadow-primary/20 flex flex-col overflow-hidden transition-all duration-300 ${isExpanded ? 'w-[800px] h-[80vh] max-w-[calc(100vw-48px)]' : 'w-[400px] h-[600px] max-w-[calc(100vw-48px)]'}`}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary/20 to-transparent px-5 py-4 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
                            {/* Animated Background Glow */}
                            <motion.div 
                                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} 
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-10 -left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl pointer-events-none" 
                            />
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/50 flex items-center justify-center relative">
                                    <Sparkles className="text-primary w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2 text-sm font-heading">
                                        MaveMentor AI
                                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-primary/20 text-primary uppercase font-bold tracking-wider">BETA</span>
                                    </h3>
                                    <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Membaca: {pageContext.language}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)} 
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    title={isExpanded ? "Perkecil" : "Perbesar"}
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)} 
                                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/5 bg-black/20">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'chat' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <MessageSquareText size={14} />
                                Chat Mentor
                                {activeTab === 'chat' && <motion.div layoutId="mm-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'code' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Code2 size={14} />
                                Code Review
                                {activeTab === 'code' && <motion.div layoutId="mm-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Code Editor (Only visible in 'code' tab) */}
                            {activeTab === 'code' && (
                                <div className={`flex-1 border-r border-white/5 bg-[#1e1e1e] flex flex-col ${isExpanded ? 'border-b-0' : 'border-b border-r-0'}`}>
                                    <div className="px-4 py-2 bg-[#2d2d2d] border-b border-black/50 text-[10px] uppercase font-bold tracking-widest text-slate-400 flex justify-between items-center">
                                        <span>Editor ({pageContext.language})</span>
                                        <button onClick={() => setCode('')} className="hover:text-white transition-colors">Clear</button>
                                    </div>
                                    <div className="flex-1 min-h-[150px]">
                                        <Editor
                                            height="100%"
                                            language={pageContext.language.toLowerCase().includes('python') ? 'python' : 'javascript'}
                                            theme="vs-dark"
                                            value={code}
                                            onChange={setCode}
                                            options={{
                                                minimap: { enabled: false },
                                                fontSize: 12,
                                                padding: { top: 10 },
                                                scrollBeyondLastLine: false,
                                                quickSuggestions: true,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Chat Area */}
                            <div className={`flex flex-col bg-transparent ${activeTab === 'code' && isExpanded ? 'w-[400px]' : 'flex-1'}`}>
                                <div 
                                    ref={chatScrollRef}
                                    className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar"
                                >
                                    {messages.map((msg, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xl ${
                                                msg.role === 'user' 
                                                ? 'bg-primary text-black rounded-tr-none shadow-primary/20' 
                                                : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                            }`}>
                                                {msg.role === 'assistant' ? formatAIResponse(msg.content) : (
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-slate-900 border-t border-white/5">
                                    <div className="relative flex items-center gap-2">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            disabled={loading}
                                            placeholder={activeTab === 'code' ? 'Apa yang ingin ditanyakan tentang kode ini?' : `Tanya seputar ${pageContext.topic}...`}
                                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white rounded-xl py-3 px-4 pr-12 text-sm transition-all outline-none"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={loading || (!input.trim() && activeTab === 'chat')}
                                            className="absolute right-2 p-2 bg-primary text-black rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-lg"
                                        >
                                            <Send size={16} className={loading ? 'animate-pulse' : ''} />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                        <span>Gemini 1.5 Pro</span>
                                        <span className="flex items-center gap-1"><CheckCircle size={10} className="text-green-500" /> Context-Aware</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MaveMentor;
