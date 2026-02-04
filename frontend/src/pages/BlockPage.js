import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
    Code2,
    Play,
    Save,
    Share2,
    Settings,
    Files,
    Search,
    Terminal,
    ChevronRight,
    ChevronDown,
    FolderOpen,
    Plus,
    Github,
    Maximize2,
    Minimize2,
    Layout,
    Cpu,
    Globe,
    X,
    RotateCcw,
    Copy,
    Check
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

const FILE_CONTENTS = {
    'App.js': `import React, { useState } from 'react';

function MavecodeApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-slate-900 min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400">
        🚀 Mavecode Block IDE
      </h1>
      <p className="mt-4 text-slate-300">
        Mulai coding bersama teman kursusmu di sini!
      </p>
      
      <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
        <p className="text-2xl mb-4">Counter: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-lg font-bold transition-all mr-2"
        >
          Tambah
        </button>
        <button 
          onClick={() => setCount(0)}
          className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-bold transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default MavecodeApp;`,
    'styles.css': `/* Mavecode Block Styles */
:root {
  --primary: #00d4ff;
  --secondary: #7c3aed;
  --background: #0d1117;
  --foreground: #c9d1d9;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.button {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
}`,
    'utils.py': `# Mavecode Python Utilities
import json
from datetime import datetime

def greet(name: str) -> str:
    """Greet the user with a personalized message."""
    return f"Halo, {name}! Selamat belajar di Mavecode! 🚀"

def calculate_progress(completed: int, total: int) -> float:
    """Calculate learning progress percentage."""
    if total == 0:
        return 0.0
    return round((completed / total) * 100, 2)

def format_duration(minutes: int) -> str:
    """Format duration to human-readable string."""
    hours = minutes // 60
    mins = minutes % 60
    if hours > 0:
        return f"{hours} jam {mins} menit"
    return f"{mins} menit"

class Course:
    def __init__(self, title: str, instructor: str):
        self.title = title
        self.instructor = instructor
        self.created_at = datetime.now()
        self.modules = []
    
    def add_module(self, module_name: str):
        self.modules.append(module_name)
        return self
    
    def to_dict(self):
        return {
            "title": self.title,
            "instructor": self.instructor,
            "modules": self.modules,
            "created_at": self.created_at.isoformat()
        }

# Example usage
if __name__ == "__main__":
    course = Course("Python Mastery", "Firza Ilmi")
    course.add_module("Fundamentals").add_module("OOP").add_module("Async")
    print(json.dumps(course.to_dict(), indent=2))
    print(greet("Developer"))`,
    'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mavecode Block - Online IDE</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        * {
            box-sizing: border-box;
        }
        .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
        }
        .hero h1 {
            font-size: 3.5rem;
            background: linear-gradient(90deg, #00d4ff, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .hero p {
            font-size: 1.25rem;
            color: #8b949e;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>🎯 Mavecode Block</h1>
        <p>Platform coding online kolaboratif untuk belajar bersama</p>
        <button class="button" style="margin-top: 2rem;">
            Mulai Coding
        </button>
    </div>
    <script src="App.js"></script>
</body>
</html>`
};

const LANGUAGE_MAP = {
    'App.js': 'javascript',
    'styles.css': 'css',
    'utils.py': 'python',
    'index.html': 'html'
};

const BlockPage = () => {
    const [activeFile, setActiveFile] = useState('App.js');
    const [files, setFiles] = useState(FILE_CONTENTS);
    const [terminalOutput, setTerminalOutput] = useState([
        { type: 'system', text: 'Initializing Mavecode Block environment...' },
        { type: 'success', text: 'Monaco Editor loaded successfully.' },
        { type: 'info', text: 'Ready to code! Select a file from the explorer.' },
    ]);
    const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const editorRef = useRef(null);

    const fileList = [
        { id: 1, name: 'App.js', icon: Code2, color: 'text-yellow-400' },
        { id: 2, name: 'styles.css', icon: Layout, color: 'text-pink-400' },
        { id: 3, name: 'utils.py', icon: Cpu, color: 'text-blue-400' },
        { id: 4, name: 'index.html', icon: Globe, color: 'text-orange-400' },
    ];

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;

        // Configure Monaco theme
        monaco.editor.defineTheme('mavecode-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'ff7b72' },
                { token: 'string', foreground: 'a5d6ff' },
                { token: 'number', foreground: '79c0ff' },
                { token: 'type', foreground: 'ffa657' },
            ],
            colors: {
                'editor.background': '#0d1117',
                'editor.foreground': '#c9d1d9',
                'editorLineNumber.foreground': '#484f58',
                'editorLineNumber.activeForeground': '#c9d1d9',
                'editor.selectionBackground': '#264f78',
                'editor.lineHighlightBackground': '#161b22',
                'editorCursor.foreground': '#58a6ff',
                'editorWhitespace.foreground': '#21262d',
            }
        });
        monaco.editor.setTheme('mavecode-dark');
    };

    const handleCodeChange = (value) => {
        setFiles(prev => ({
            ...prev,
            [activeFile]: value
        }));
    };

    const handleRun = () => {
        const timestamp = new Date().toLocaleTimeString();
        setTerminalOutput(prev => [
            ...prev,
            { type: 'command', text: `[${timestamp}] Running ${activeFile}...` },
            { type: 'success', text: `✓ Code executed successfully!` },
        ]);
        toast.success('Kode berhasil dijalankan!');
    };

    const handleSave = () => {
        toast.success(`${activeFile} tersimpan!`);
        setTerminalOutput(prev => [
            ...prev,
            { type: 'info', text: `File ${activeFile} saved.` },
        ]);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(files[activeFile]);
        setCopied(true);
        toast.success('Kode disalin ke clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClearTerminal = () => {
        setTerminalOutput([
            { type: 'system', text: 'Terminal cleared.' },
        ]);
    };

    const handleFormat = () => {
        if (editorRef.current) {
            editorRef.current.getAction('editor.action.formatDocument').run();
            toast.success('Kode diformat!');
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#0d1117] text-slate-300 mt-20">
            {/* Activity Bar */}
            <div className="w-12 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-4">
                <div className="p-2 bg-[#21262d] rounded-lg">
                    <Files className="w-5 h-5 text-white" />
                </div>
                <Search className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
                <Github className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
                <Terminal className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
                <div className="flex-1" />
                <Settings className="w-5 h-5 text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" />
            </div>

            {/* Sidebar Explorer */}
            <div className="w-60 bg-[#0d1117] border-r border-[#30363d] flex-col hidden md:flex">
                <div className="h-10 px-4 flex items-center justify-between uppercase text-[10px] font-bold tracking-widest text-[#8b949e]">
                    <span>Explorer</span>
                    <Plus className="w-3 h-3 cursor-pointer hover:text-white" />
                </div>
                <div className="px-2 py-1 flex-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-white mb-2 cursor-pointer hover:text-cyan-400">
                        <ChevronDown className="w-3 h-3" />
                        <FolderOpen className="w-3 h-3 text-cyan-400" />
                        <span>MAVE-PROJECT-01</span>
                    </div>
                    <div className="pl-4 space-y-0.5">
                        {fileList.map(file => (
                            <button
                                key={file.id}
                                onClick={() => setActiveFile(file.name)}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-all ${activeFile === file.name
                                    ? 'bg-[#21262d] text-white border-l-2 border-cyan-500'
                                    : 'text-[#8b949e] hover:bg-[#161b22] hover:text-white'
                                    }`}
                            >
                                <file.icon className={`w-4 h-4 ${file.color}`} />
                                {file.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[#30363d] p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] mb-3">Collaborators</h4>
                    <div className="flex -space-x-2">
                        {['F', 'A', 'R'].map((initial, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-full border-2 border-[#0d1117] flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'
                                    }`}
                            >
                                {initial}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-[#0d1117] bg-[#21262d] flex items-center justify-center text-[10px] font-bold text-slate-400">
                            +5
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-4 text-xs h-8 border-[#30363d] bg-transparent hover:bg-[#21262d] hover:text-white">
                        <Plus className="w-3 h-3 mr-1" /> Undang
                    </Button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Tabs */}
                <div className="h-10 bg-[#161b22] flex items-center overflow-x-auto border-b border-[#30363d]">
                    {fileList.map(file => (
                        <button
                            key={file.id}
                            onClick={() => setActiveFile(file.name)}
                            className={`h-full px-4 flex items-center gap-2 text-xs border-r border-[#30363d] transition-all min-w-[120px] group ${activeFile === file.name
                                ? 'bg-[#0d1117] text-white border-t-2 border-t-cyan-500'
                                : 'bg-[#161b22] text-[#8b949e] hover:bg-[#1c2128] hover:text-white'
                                }`}
                        >
                            <file.icon className={`w-4 h-4 ${file.color}`} />
                            <span className="flex-1">{file.name}</span>
                            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-red-400" />
                        </button>
                    ))}
                </div>

                {/* Breadcrumb & Status */}
                <div className="px-4 py-1.5 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                        <span className="text-[#8b949e]">MAVE-PROJECT-01</span>
                        <ChevronRight className="w-3 h-3 text-[#484f58]" />
                        <span className="text-white">{activeFile}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[#8b949e]">Live Sync</span>
                        </div>
                        <Separator orientation="vertical" className="h-3 bg-[#30363d]" />
                        <span className="text-[#8b949e]">UTF-8</span>
                        <span className="text-cyan-400 font-medium">{LANGUAGE_MAP[activeFile]?.toUpperCase()}</span>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        language={LANGUAGE_MAP[activeFile]}
                        value={files[activeFile]}
                        onChange={handleCodeChange}
                        onMount={handleEditorMount}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                            fontLigatures: true,
                            minimap: { enabled: true, scale: 1 },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            renderLineHighlight: 'all',
                            lineNumbers: 'on',
                            glyphMargin: true,
                            folding: true,
                            bracketPairColorization: { enabled: true },
                            autoIndent: 'full',
                            formatOnPaste: true,
                            formatOnType: true,
                            tabSize: 2,
                            wordWrap: 'on',
                            padding: { top: 16 },
                        }}
                    />

                    {/* Floating Action Buttons */}
                    <div className="absolute top-4 right-6 flex gap-2 z-10">
                        <Button
                            size="sm"
                            onClick={handleRun}
                            className="bg-green-600 hover:bg-green-700 text-white flex gap-2 h-9 px-4 font-bold shadow-lg shadow-green-900/30"
                        >
                            <Play className="w-4 h-4" /> RUN
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleFormat}
                            className="h-9 w-9 border-[#30363d] bg-[#161b22]/80 backdrop-blur text-slate-400 hover:text-white hover:border-cyan-500"
                            title="Format Code"
                        >
                            <Code2 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleSave}
                            className="h-9 w-9 border-[#30363d] bg-[#161b22]/80 backdrop-blur text-slate-400 hover:text-white hover:border-cyan-500"
                            title="Save"
                        >
                            <Save className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCopy}
                            className="h-9 w-9 border-[#30363d] bg-[#161b22]/80 backdrop-blur text-slate-400 hover:text-white hover:border-cyan-500"
                            title="Copy Code"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 border-[#30363d] bg-[#161b22]/80 backdrop-blur text-slate-400 hover:text-white hover:border-cyan-500"
                            title="Share"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Terminal Panel */}
                <div className={`bg-[#161b22] border-t border-[#30363d] flex flex-col transition-all ${isTerminalExpanded ? 'h-80' : 'h-36'}`}>
                    <div className="h-9 px-4 flex items-center justify-between border-b border-[#30363d]">
                        <div className="flex items-center gap-4">
                            <button className="text-[10px] uppercase font-bold text-cyan-400 border-b-2 border-cyan-500 pb-2 -mb-[1px]">
                                Terminal
                            </button>
                            <button className="text-[10px] uppercase font-bold text-[#8b949e] hover:text-white pb-2 -mb-[1px]">
                                Output
                            </button>
                            <button className="text-[10px] uppercase font-bold text-[#8b949e] hover:text-white pb-2 -mb-[1px]">
                                Problems
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <RotateCcw
                                className="w-3.5 h-3.5 text-[#8b949e] cursor-pointer hover:text-white"
                                onClick={handleClearTerminal}
                            />
                            <button onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}>
                                {isTerminalExpanded ? (
                                    <Minimize2 className="w-3.5 h-3.5 text-[#8b949e] cursor-pointer hover:text-white" />
                                ) : (
                                    <Maximize2 className="w-3.5 h-3.5 text-[#8b949e] cursor-pointer hover:text-white" />
                                )}
                            </button>
                            <X className="w-3.5 h-3.5 text-[#8b949e] cursor-pointer hover:text-red-400" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-3 bg-[#0d1117] font-mono text-xs">
                        <div className="space-y-1">
                            {terminalOutput.map((line, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className={`${line.type === 'system' ? 'text-cyan-500' :
                                        line.type === 'success' ? 'text-green-500' :
                                            line.type === 'error' ? 'text-red-500' :
                                                line.type === 'command' ? 'text-yellow-500' :
                                                    'text-[#8b949e]'
                                        }`}>
                                        {line.type === 'command' ? '$' : `[${line.type}]`}
                                    </span>
                                    <span className="text-slate-300">{line.text}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-green-500">❯</span>
                                <span className="text-slate-500 animate-pulse">_</span>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default BlockPage;
