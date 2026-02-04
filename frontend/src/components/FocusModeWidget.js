import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Minimize2, Maximize2, X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { useFocusMode } from '../context/FocusModeContext';

const FocusModeWidget = () => {
    const {
        isOpen,
        isMinimized,
        timeLeft,
        isRunning,
        isBreak,
        sessions,
        progress,
        formatTime,
        toggleTimer,
        resetTimer,
        closeFocusMode,
        minimizeFocusMode,
        expandFocusMode
    } = useFocusMode();

    // Dragging state
    const [position, setPosition] = useState({ x: 20, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (dragRef.current) {
            setIsDragging(true);
            const rect = dragRef.current.getBoundingClientRect();
            offsetRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - offsetRef.current.x)),
                    y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - offsetRef.current.y))
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    // Minimized View - Small floating pill
    if (isMinimized) {
        return (
            <motion.div
                ref={dragRef}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{ left: position.x, top: position.y }}
                className="fixed z-[9999] flex items-center gap-3 px-4 py-2 bg-card/95 backdrop-blur-xl border border-border rounded-full shadow-2xl cursor-move select-none"
                onMouseDown={handleMouseDown}
            >
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <span className={`font-mono font-bold text-lg ${isBreak ? 'text-green-400' : 'text-primary'}`}>
                    {formatTime(timeLeft)}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); toggleTimer(); }}
                        className="h-8 w-8 rounded-full"
                    >
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); expandFocusMode(); }}
                        className="h-8 w-8 rounded-full"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>
        );
    }

    // Expanded View - Full Widget
    return (
        <motion.div
            ref={dragRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ left: position.x, top: position.y }}
            className="fixed z-[9999] w-72 bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden select-none"
        >
            {/* Drag Handle */}
            <div
                className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border cursor-move"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-sm">Focus Mode</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={minimizeFocusMode}
                        className="h-7 w-7 rounded-full"
                    >
                        <Minimize2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeFocusMode}
                        className="h-7 w-7 rounded-full text-destructive hover:text-destructive"
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            <div className="p-6 text-center">
                {/* Mode Indicator */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-medium ${isBreak ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
                    }`}>
                    {isBreak ? <Coffee className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                    {isBreak ? 'Istirahat' : 'Belajar'}
                </div>

                {/* Timer Display */}
                <div className="relative w-36 h-36 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="72"
                            cy="72"
                            r="66"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-muted"
                        />
                        <circle
                            cx="72"
                            cy="72"
                            r="66"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 66}
                            strokeDashoffset={2 * Math.PI * 66 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className={isBreak ? 'text-green-500' : 'text-primary'}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-3xl font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={resetTimer}
                        className="rounded-full w-10 h-10"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={toggleTimer}
                        className={`rounded-full w-14 h-14 ${isBreak ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'
                            }`}
                    >
                        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </Button>
                </div>

                {/* Sessions Counter */}
                <div className="text-muted-foreground text-xs">
                    Sesi selesai: <span className="text-foreground font-semibold">{sessions}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default FocusModeWidget;
