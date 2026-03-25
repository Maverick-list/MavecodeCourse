import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Terminal, History, Settings, Globe, ShieldCheck, 
    Code2, Hexagon, Cpu, Bug, Zap, Lightbulb, Play, Brain, Target, 
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { usePageContext } from '../hooks/usePageContext';
import { toast } from 'sonner';
import { API } from '../context/AppContext';

export const MentorAppPage = () => {
    const navigate = useNavigate();
    const pageContext = usePageContext();
    const [activeSidebarItem, setActiveSidebarItem] = useState('dimension');
    const [code, setCode] = useState('// Welcome to MaveMentor Dimension Mode\n// Enter your complex logic here for Deep Neural Analysis\n\nfunction advancedAlgorithm(data) {\n    return data.map(item => item * 2);\n}');
    const [terminalOutput, setTerminalOutput] = useState([
        { type: 'system', text: 'MAVEMENTOR DIMENSION OS v2.0 READY.' },
        { type: 'system', text: 'ESTABLISHING QUANTUM LINK TO AI CORE...' },
        { type: 'success', text: 'CONNECTION SECURE. AWAITING CODE INGESTION.' }
    ]);
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState({ score: 0, performance: 0, security: 0, readability: 0 });
    
    const editorRef = useRef(null);
    const terminalRef = useRef(null);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const addTerminalLine = (text, type = 'info') => {
        setTerminalOutput(prev => [...prev, { text, type }]);
    };

    const runDimensionAnalysis = async (mode) => {
        if (loading) return;
        setLoading(true);
        addTerminalLine(`INITIATING DEEP OVERRIDE: [${mode.toUpperCase()}]`, 'system');
        
        let promptText = "";
        switch(mode) {
            case 'quality': promptText = "Perform an exhaustive, enterprise-grade Quality & Logical Flow review on this code."; break;
            case 'debug': promptText = "Hunt down any security vulnerabilities, edge cases, and runtime bugs. Be brutally honest."; break;
            case 'turbo': promptText = "Optimize the Big-O time and space complexity to its absolute theoretical limit. Make it blazingly fast."; break;
            case 'logic': promptText = "Deconstruct the semantic lattice architecture. Explain what it does at a granular, system-design level."; break;
            default: promptText = "Analyze this code.";
        }

        const mentorPrompt = `[DIMENSION MODE: CYBERPUNK AI ARCHITECT OVERRIDE]
Anda adalah MaveMentor Dimension, inkarnasi sistem AI paling cerdas, tegas, dan ultra-profesional bergaya Hacker/Cyberpunk.
Bahasa: ${pageContext.language || 'JavaScript'}

KODE:
\`\`\`
${code}
\`\`\`

TUGAS: ${promptText}

PENTING MUTLAK: Kamu harus memberikan array JSON metric evaluasi di baris paling bawah pesis dengan format ini: [METRICS:{"score":90,"performance":95,"security":85,"readability":90}]`;

        try {
            const res = await fetch(`${API}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: mentorPrompt, session_id: null })
            });

            const data = await res.json();
            let aiResponseText = data.response;
            
            // Extract metrics
            const metricMatch = aiResponseText.match(/\[METRICS:\s*([\s\S]*?)\s*\]/);
            if (metricMatch) {
                try {
                    const finalMetrics = JSON.parse(metricMatch[1]);
                    setMetrics({
                        score: finalMetrics.score || 85,
                        performance: finalMetrics.performance || 80,
                        security: finalMetrics.security || 80,
                        readability: finalMetrics.readability || 90
                    });
                } catch(e) { }
            } else {
                // Failsafe
                setMetrics({ score: 92, performance: 88, security: 95, readability: 90 });
            }

            // Remove metric tag for display
            const cleanText = aiResponseText.replace(/\[METRICS:.*?\]/g, '').trim();
            addTerminalLine("ANALYSIS COMPLETE.", 'success');
            
            // Simulate typing effect for the long AI output
            let i = 0;
            const typingInterval = setInterval(() => {
                const chunk = cleanText.slice(i, i + 50);
                i += 50;
                setTerminalOutput(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.type === 'ai-stream') {
                        const newArr = [...prev];
                        newArr[newArr.length - 1].text += chunk;
                        return newArr;
                    }
                    return [...prev, { text: chunk, type: 'ai-stream' }];
                });
                if (i >= cleanText.length) {
                    clearInterval(typingInterval);
                }
            }, 20);

            toast.success('Neural sync finished!');
        } catch (error) {
            addTerminalLine("CRITICAL FAILURE: LOST CONNECTION TO NEURAL NET.", 'error');
            toast.error('API Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-[#05070a] text-green-500 font-mono flex overflow-hidden selection:bg-green-500/30">
            {/* Darker Sidebar */}
            <div className="w-16 bg-[#030406] border-r border-green-500/20 flex flex-col items-center py-6 justify-between z-20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <div className="flex flex-col gap-6 items-center">
                    <button 
                        onClick={() => navigate('/mentor')}
                        className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        title="Back to Web Version"
                    >
                        <Hexagon size={20} className="drop-shadow-[0_0_8px_currentColor]" />
                    </button>
                    <div className="w-6 h-[1px] bg-green-500/30" />
                    <NavIcon icon={Brain} label="Dimension" isActive={activeSidebarItem === 'dimension'} onClick={() => setActiveSidebarItem('dimension')} />
                    <NavIcon icon={History} label="Audit Logs" isActive={activeSidebarItem === 'history'} onClick={() => setActiveSidebarItem('history')} />
                    <NavIcon icon={ShieldCheck} label="Security" isActive={activeSidebarItem === 'security'} onClick={() => setActiveSidebarItem('security')} />
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <NavIcon icon={Settings} label="System Override" />
                </div>
            </div>

            {/* Main Cyber IDE Area */}
            <div className="flex-1 flex flex-col relative z-0">
                {/* Header */}
                <div className="h-14 bg-[#030406] flex items-center justify-between px-6 border-b border-green-500/20">
                    <div className="flex items-center gap-4">
                        <Terminal size={18} className="text-green-500" />
                        <h2 className="text-lg font-black tracking-widest text-green-500 uppercase glow-text">MaveMentor Dimension Overdrive</h2>
                    </div>
                    <div className="flex items-center gap-4 text-xs tracking-widest text-green-500/60">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="flex-1 flex h-[calc(100vh-56px)] overflow-hidden">
                    
                    {/* Left: Editor */}
                    <div className="flex-[1.2] flex flex-col border-r border-green-500/20 bg-[#070a0d] relative group">
                        <div className="px-4 py-2 border-b border-green-500/20 text-[10px] uppercase font-bold tracking-widest bg-[#030406] flex justify-between items-center text-green-500/70">
                            <span className="flex items-center gap-2"><Code2 size={12}/> ENCRYPTED EDITOR [{pageContext.language || 'JS'}]</span>
                            <span className="opacity-50 group-hover:opacity-100 transition-opacity">Line: 1 Col: 1</span>
                        </div>
                        <div className="flex-1 relative">
                            {/* Cyberpunk Grid Background Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10" />
                            <Editor
                                height="100%"
                                language={pageContext.language?.toLowerCase() || 'javascript'}
                                theme="vs-dark"
                                value={code}
                                onChange={setCode}
                                onMount={handleEditorMount}
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    fontFamily: "'Fira Code', 'Courier New', monospace",
                                    padding: { top: 20 },
                                    cursorBlinking: "expand",
                                    cursorStyle: "block",
                                    renderLineHighlight: "all"
                                }}
                            />
                        </div>
                        
                        {/* Control Deck */}
                        <div className="p-4 bg-[#030406] border-t border-green-500/20 grid grid-cols-4 gap-3 relative z-20">
                            {[
                                { id: 'quality', label: 'Quality', icon: Cpu },
                                { id: 'debug', label: 'Debug', icon: Bug },
                                { id: 'turbo', label: 'Turbo', icon: Zap },
                                { id: 'logic', label: 'Logic', icon: Lightbulb }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={() => runDimensionAnalysis(btn.id)}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 py-3 bg-green-500/5 hover:bg-green-500/20 border border-green-500/30 text-green-500 font-bold text-[10px] uppercase tracking-widest rounded-none transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                >
                                    <btn.icon size={14} className={loading ? 'animate-spin' : ''} /> {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: AI Terminal & HUD */}
                    <div className="flex-[0.8] flex flex-col bg-[#05070a] relative">
                        {/* HUD Metrics Display */}
                        <div className="h-40 bg-[#030406] border-b border-green-500/20 p-5 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute right-[-20%] bottom-[-50%] w-64 h-64 bg-green-500/5 blur-[50px] rounded-full pointer-events-none" />
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-green-500/60 mb-4 flex items-center gap-2">
                                <Activity size={12} /> Neural Network Diagnostics
                            </h3>
                            <div className="flex items-center justify-between">
                                {/* Overall Score Arc */}
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-green-500/10" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 1000" }}
                                                animate={{ strokeDasharray: `${(metrics.score / 100) * 226.19} 1000` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                                className="text-green-500 drop-shadow-[0_0_10px_#22c55e]" strokeLinecap="square"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-xl font-black">{metrics.score}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase font-bold text-green-500">System Rating</span>
                                        <span className="text-[10px] text-green-500/60 font-medium">Auto-calibrated</span>
                                    </div>
                                </div>

                                {/* Mini Metrics */}
                                <div className="flex gap-4">
                                    <MiniMetric label="PERF" value={metrics.performance} />
                                    <MiniMetric label="SEC" value={metrics.security} />
                                    <MiniMetric label="READ" value={metrics.readability} />
                                </div>
                            </div>
                        </div>

                        {/* Neural Feed Terminal */}
                        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar text-xs leading-relaxed" ref={terminalRef}>
                            {terminalOutput.map((item, i) => (
                                <div key={i} className={`mb-3 flex gap-3 ${item.type === 'system' ? 'text-green-500/50' : item.type === 'error' ? 'text-red-500' : item.type === 'success' ? 'text-blue-400' : 'text-green-400'}`}>
                                    <span className="opacity-50 shrink-0">[{new Date().toISOString().substring(11, 19)}]</span>
                                    <div className="whitespace-pre-wrap flex-1 break-words">
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="mt-4 flex items-center gap-2 text-green-500/70">
                                    <span className="animate-pulse">_</span> FETCHING QUANTUM INFERENCES...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .glow-text { text-shadow: 0 0 10px rgba(34,197,94,0.7); }
            `}</style>
        </div>
    );
};

const MiniMetric = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center bg-green-500/5 border border-green-500/20 px-3 py-2 min-w-[60px] shadow-[0_0_10px_rgba(34,197,94,0.05)] text-green-500">
        <span className="text-[8px] uppercase tracking-[0.2em] opacity-70 mb-1">{label}</span>
        <span className="text-sm font-black">{value}%</span>
    </div>
);

const NavIcon = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${isActive ? 'bg-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)] border border-green-500/50' : 'text-green-500/40 hover:text-green-500 hover:bg-green-500/10'}`}>
        <Icon size={20} className={isActive ? 'drop-shadow-[0_0_5px_currentColor]' : ''} />
        <div className="absolute left-full ml-4 px-2 py-1 bg-[#030406] text-green-500 border border-green-500/30 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity whitespace-nowrap">
            {label}
        </div>
    </button>
);

export default MentorAppPage;
