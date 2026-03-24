import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

export const PomodoroTimer = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const totalTime = isBreak ? BREAK_TIME : WORK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(WORK_TIME);
    } else {
      setSessions(s => s + 1);
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    }
    setIsRunning(false);
    
    // Play notification sound
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBreak ? 'Break selesai! Siap belajar lagi?' : 'Sesi selesai! Waktunya istirahat 🎉');
    }
  }, [isBreak]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleComplete]);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center"
        onClick={e => e.stopPropagation()}
        data-testid="pomodoro-modal"
      >
        {/* Mode Indicator */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
          isBreak ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
        }`}>
          {isBreak ? <Coffee className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          <span className="font-medium text-sm">{isBreak ? 'Waktu Istirahat' : 'Waktu Belajar'}</span>
        </div>

        {/* Timer Display */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              strokeLinecap="round"
              className={isBreak ? 'text-green-500' : 'text-primary'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="rounded-full w-12 h-12"
            data-testid="pomodoro-reset"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={`rounded-full w-16 h-16 ${
              isBreak ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'
            }`}
            data-testid="pomodoro-toggle"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="rounded-full w-12 h-12"
            data-testid="pomodoro-close"
          >
            ✕
          </Button>
        </div>

        {/* Sessions Counter */}
        <div className="text-muted-foreground text-sm">
          Sesi selesai hari ini: <span className="text-foreground font-semibold">{sessions}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PomodoroTimer;
