import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

const FocusModeContext = createContext(null);

export const useFocusMode = () => {
    const context = useContext(FocusModeContext);
    if (!context) throw new Error('useFocusMode must be used within FocusModeProvider');
    return context;
};

export const FocusModeProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef(null);

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
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, handleComplete]);

    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }, []);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
    };

    const resetAll = () => {
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
        setSessions(0);
    };

    const openFocusMode = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const closeFocusMode = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    const minimizeFocusMode = () => {
        setIsMinimized(true);
    };

    const expandFocusMode = () => {
        setIsMinimized(false);
    };

    return (
        <FocusModeContext.Provider value={{
            isOpen,
            isMinimized,
            timeLeft,
            isRunning,
            isBreak,
            sessions,
            progress,
            totalTime,
            formatTime,
            toggleTimer,
            resetTimer,
            resetAll,
            openFocusMode,
            closeFocusMode,
            minimizeFocusMode,
            expandFocusMode,
            WORK_TIME,
            BREAK_TIME
        }}>
            {children}
        </FocusModeContext.Provider>
    );
};

export default FocusModeProvider;
