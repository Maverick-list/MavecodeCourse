import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code2,
    Play,
    Save,
    Share2,
    Settings,
    Files,
    MessageSquare,
    Users,
    Search,
    Terminal,
    ChevronRight,
    ChevronDown,
    FolderOpen,
    Plus,
    Github,
    Maximize2,
    Layout,
    Cpu,
    Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';

const BlockPage = () => {
    const [activeFile, setActiveFile] = useState('App.js');
    const [code, setCode] = useState(`import React from 'react';

function MavecodeApp() {
  return (
    <div className="bg-slate-900 min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400">
        Mavecode Block Online IDE
      </h1>
      <p className="mt-4 text-slate-300">
        Mulai coding bersama teman kursusmu di sini secara real-time!
      </p>
      
      <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
        <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-lg font-bold transition-all">
          Jalankan Kode
        </button>
      </div>
    </div>
  );
}

export default MavecodeApp;`);

    const files = [
        { id: 1, name: 'App.js', icon: Code2, color: 'text-blue-400' },
        { id: 2, name: 'styles.css', icon: Layout, color: 'text-pink-400' },
        { id: 3, name: 'utils.py', icon: Cpu, color: 'text-yellow-400' },
        { id: 4, name: 'index.html', icon: Globe, color: 'text-orange-400' },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0d1117] text-slate-300">
            {/* Activity Bar (Slim leftmost) */}
            <div className="w-12 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-6">
                <Files className="w-5 h-5 text-white cursor-pointer hover:text-cyan-400 transition-colors" />
                <Search className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
                <Github className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
                <div className="flex-1" />
                <Settings className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
            </div>

            {/* Side Bar (Explorer) */}
            <div className="w-60 bg-[#0d1117] border-r border-[#30363d] flex flex-col hidden md:flex">
                <div className="h-10 px-4 flex items-center justify-between uppercase text-[10px] font-bold tracking-widest text-[#8b949e]">
                    <span>Explorer</span>
                    <Plus className="w-3 h-3 cursor-pointer hover:text-white" />
                </div>
                <div className="px-2 py-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-white mb-2 cursor-pointer">
                        <ChevronDown className="w-3 h-3" />
                        <FolderOpen className="w-3 h-3 text-cyan-400" />
                        <span>MAVE-PROJECT-01</span>
                    </div>
                    <div className="pl-4 space-y-1">
                        {files.map(file => (
                            <button
                                key={file.id}
                                onClick={() => setActiveFile(file.name)}
                                className={`w-full flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-[#161b22] transition-colors ${activeFile === file.name ? 'bg-[#161b22] text-white' : 'text-[#8b949e]'
                                    }`}
                            >
                                <file.icon className={`w-3.5 h-3.5 ${file.color}`} />
                                {file.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto border-t border-[#30363d] p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-4">Collaborators</h4>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-7 h-7 rounded-full border-2 border-[#0d1117] bg-primary/20 flex items-center justify-center text-[10px] font-bold`}>
                                U{i}
                            </div>
                        ))}
                        <div className="w-7 h-7 rounded-full border-2 border-[#0d1117] bg-[#161b22] flex items-center justify-center text-[10px] font-bold">
                            +5
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-4 text-[10px] h-7 border-[#30363d] bg-transparent">
                        Undang Member
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Tabs */}
                <div className="h-10 bg-[#161b22] flex items-center overflow-x-auto no-scrollbar border-b border-[#30363d]">
                    {files.map(file => (
                        <div
                            key={file.id}
                            onClick={() => setActiveFile(file.name)}
                            className={`h-full px-4 flex items-center gap-2 text-xs border-r border-[#30363d] cursor-pointer transition-all min-w-[120px] ${activeFile === file.name
                                    ? 'bg-[#0d1117] border-t-2 border-t-cyan-500 text-white'
                                    : 'bg-[#161b22] text-[#8b949e] hover:bg-[#1c2128]'
                                }`}
                        >
                            <file.icon className={`w-3.5 h-3.5 ${file.color}`} />
                            <span>{file.name}</span>
                        </div>
                    ))}
                </div>

                {/* Real-time Status */}
                <div className="px-4 py-1.5 bg-[#0d1117] border-b border-[#30363d] flex items-center gap-4 text-[10px]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[#8b949e]">Real-time Sync Active</span>
                    </div>
                    <Separator orientation="vertical" className="h-3 border-[#30363d]" />
                    <span className="text-[#8b949e]">UTF-8</span>
                    <span className="text-[#8b949e]">Language: JavaScript</span>
                </div>

                {/* Code View (Textarea simulation for now) */}
                <div className="flex-1 overflow-hidden relative font-mono text-sm leading-6">
                    <div className="absolute inset-0 flex">
                        {/* Line Numbers */}
                        <div className="w-12 bg-[#0d1117] text-[#484f58] flex flex-col items-end px-3 py-4 select-none border-r border-[#30363d]">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>
                        {/* Main Editor */}
                        <ScrollArea className="flex-1 bg-[#0d1117]">
                            <textarea
                                className="w-full min-h-full bg-transparent border-none focus:ring-0 p-4 resize-none text-slate-200 outline-none caret-cyan-400"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck={false}
                            />
                        </ScrollArea>
                    </div>

                    {/* Floating Actions */}
                    <div className="absolute top-4 right-8 flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex gap-2 h-8 px-4 font-bold shadow-lg">
                            <Play className="w-3.5 h-3.5" /> RUN
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 border-[#30363d] bg-[#161b22] text-slate-400 hover:text-white">
                            <Save className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 border-[#30363d] bg-[#161b22] text-slate-400 hover:text-white">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Bottom Panel (Terminal Output) */}
                <div className="h-40 bg-[#161b22] border-t border-[#30363d] flex flex-col">
                    <div className="h-8 px-4 flex items-center border-b border-[#30363d]">
                        <Tabs defaultValue="terminal" className="w-full">
                            <TabsList className="bg-transparent h-auto p-0 gap-4">
                                <TabsTrigger value="output" className="text-[10px] h-8 px-0 border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:border-cyan-500 uppercase font-bold text-[#8b949e] tracking-wider">Output</TabsTrigger>
                                <TabsTrigger value="terminal" className="text-[10px] h-8 px-0 border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:border-cyan-500 uppercase font-bold text-[#8b949e] tracking-wider">Terminal</TabsTrigger>
                                <TabsTrigger value="debug" className="text-[10px] h-8 px-0 border-b-2 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:border-cyan-500 uppercase font-bold text-[#8b949e] tracking-wider">Debug Console</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="ml-auto flex gap-2">
                            <Maximize2 className="w-3 h-3 text-[#8b949e] cursor-pointer" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-3 bg-[#0d1117]">
                        <div className="font-mono text-xs space-y-1">
                            <div className="flex gap-2 text-cyan-500">
                                <span>[system]</span>
                                <span className="text-slate-300">Initializing Mavecode Node environment...</span>
                            </div>
                            <div className="flex gap-2 text-green-500">
                                <span>[success]</span>
                                <span className="text-slate-300">Editor is now connected to Cloud Runner.</span>
                            </div>
                            <div className="flex gap-2 text-slate-500 mt-2">
                                <span>$</span>
                                <span className="text-slate-200">npm start</span>
                            </div>
                            <div className="text-slate-400 pl-4 animate-pulse">
                > Listening on http://localhost:3000
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default BlockPage;
