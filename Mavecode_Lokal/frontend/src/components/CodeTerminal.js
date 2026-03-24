import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Button } from './ui/button';
import { toast } from 'sonner';

const LANGUAGE_MAP = {
    'javascript': { alias: 'js', piston: 'javascript', version: '18.15.0' },
    'js': { alias: 'js', piston: 'javascript', version: '18.15.0' },
    'python': { alias: 'py', piston: 'python', version: '3.10.0' },
    'python3': { alias: 'py', piston: 'python', version: '3.10.0' },
    'py': { alias: 'py', piston: 'python', version: '3.10.0' },
    'php': { alias: 'php', piston: 'php', version: '8.2.3' },
    'c': { alias: 'c', piston: 'c', version: '10.2.0' },
    'cpp': { alias: 'cpp', piston: 'c++', version: '10.2.0' },
    'c++': { alias: 'cpp', piston: 'c++', version: '10.2.0' },
    'go': { alias: 'go', piston: 'go', version: '1.16.2' },
    'rust': { alias: 'rs', piston: 'rust', version: '1.68.2' },
    'rs': { alias: 'rs', piston: 'rust', version: '1.68.2' },
};

const CodeTerminal = ({ code: initialCode, language = 'javascript' }) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const langInfo = LANGUAGE_MAP[language.toLowerCase()] || LANGUAGE_MAP['javascript'];

    const runCode = async () => {
        setRunning(true);
        setError(null);
        setOutput('Memulai eksekusi...');

        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: langInfo.piston,
                version: langInfo.version,
                files: [
                    {
                        content: code
                    }
                ],
            });

            const { run } = response.data;
            if (run.stderr) {
                setError(run.stderr);
                setOutput(run.stdout + "\n" + run.stderr);
            } else {
                setOutput(run.stdout || 'Program selesai tanpa ada output.');
            }
        } catch (err) {
            console.error(err);
            setError('Gagal menghubungkan ke server eksekusi.');
            setOutput('Error: Terjadi kesalahan saat mencoba menjalankan kode.');
        } finally {
            setRunning(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Kode disalin!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setCode(initialCode);
        setOutput('');
        setError(null);
    };

    return (
        <div className="my-8 rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-xl shadow-2xl group">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="h-4 w-[1px] bg-border mx-1" />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{language}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={handleCopy} title="Salin Kode">
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={handleReset} title="Reset">
                        <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="h-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-3"
                        onClick={runCode}
                        disabled={running}
                    >
                        {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>Run</span>
                    </Button>
                </div>
            </div>

            {/* Editor/Code Display */}
            <div className="relative">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    className="w-full min-h-[150px] max-h-[400px] p-4 bg-transparent font-mono text-sm leading-relaxed focus:outline-none resize-none scrollbar-thin scrollbar-thumb-muted"
                />
                <div className="absolute right-4 bottom-4 p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <TerminalIcon className="w-3 h-3" /> INTERACTIVE
                    </span>
                </div>
            </div>

            {/* Output Console */}
            <div className={`border-t border-border transition-all duration-300 ${output || running ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="bg-black/40 p-4 font-mono text-xs leading-relaxed overflow-auto max-h-[250px] scrollbar-thin scrollbar-thumb-muted">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground border-b border-border/10 pb-1">
                        <TerminalIcon className="w-3 h-3" />
                        <span>Output Console</span>
                    </div>
                    {error && (
                        <div className="flex items-start gap-2 text-red-400 mb-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <p className="whitespace-pre-wrap">{error}</p>
                        </div>
                    )}
                    <p className={`whitespace-pre-wrap ${error ? 'text-red-300/80' : 'text-green-400'}`}>
                        {output}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CodeTerminal;
