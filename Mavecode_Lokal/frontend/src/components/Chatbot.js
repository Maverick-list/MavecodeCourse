import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API } from '../context/AppContext';
import axios from 'axios';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

export const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! 👋 Saya Mavecode AI, asisten cerdas yang siap membantu perjalanan coding kamu. Mau tanya tentang kursus, teknologi, atau butuh rekomendasi? 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // --- Utility Functions (useCallback first to avoid hoisting issues) ---

  const handleNavigation = useCallback((content) => {
    if (!content || typeof content !== 'string') return content || '';

    const navMatch = content.match(/\[NAVIGATE:([^\]]+)\]/);
    if (navMatch) {
      const path = navMatch[1];
      setTimeout(() => {
        navigate(path);
        toast.success(`Membuka ${path}...`);
      }, 1500);
      return content.replace(/\[NAVIGATE:[^\]]+\]/g, '');
    }
    return content;
  }, [navigate]);

  const speak = useCallback((text) => {
    if (!voiceEnabled || !synthRef.current || !text) return;
    try {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.1;
      utterance.pitch = 1;

      const voices = synthRef.current.getVoices();
      const indonesianVoice = voices.find(v => v.lang.includes('id')) || voices.find(v => v.lang.includes('en'));
      if (indonesianVoice) utterance.voice = indonesianVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis error:", e);
    }
  }, [voiceEnabled]);

  const sendMessage = useCallback(async (messageOverride = null, isVoice = false) => {
    const userMessage = (messageOverride || input).trim();
    if (!userMessage || loading) return;

    // Reset input immediately
    if (!messageOverride) setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const fullUrl = `${API}/chat`;

      const res = await axios.post(fullUrl, {
        message: userMessage,
        session_id: sessionId
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000
      });

      if (res.data && res.data.response) {
        setSessionId(res.data.session_id);
        const aiResponse = handleNavigation(res.data.response);

        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

        // Only speak if the request came via voice AND voice is enabled
        if (isVoice && voiceEnabled) {
          speak(aiResponse.substring(0, 300));
        }
      } else {
        throw new Error('Respon server tidak valid');
      }
    } catch (err) {
      console.error('[Chatbot Error]:', err);
      let errorDisplay = "Maaf, kepalaku lagi pusing sebentar. 🔌";
      if (err.response?.status === 429) errorDisplay = "Waduh, aku lagi rame banget yang nanya! ⏳";
      else if (!err.response && err.request) errorDisplay = "Backend-ku lagi tidur (5001). 😴";

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${errorDisplay} (Detail: ${err.message})`
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, voiceEnabled, handleNavigation, speak]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
        toast.info('🎤 Mendengarkan...');
      } catch (e) {
        setIsListening(false);
        console.error("Speech recognition error:", e);
      }
    }
  }, [isListening]);

  // --- Effects ---

  // Initialize Speech Recognition ONCE
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        // Direct call to sendMessage with voice flag
        sendMessage(transcript, true);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    // Cleanup on unmount
    const currentRecognition = recognitionRef.current;
    const currentSynth = synthRef.current;
    return () => {
      if (currentRecognition) currentRecognition.abort();
      if (currentSynth) currentSynth.cancel();
    };
  }, [sendMessage]); // Only re-run if sendMessage changes, but we try to keep it stable

  // Stop speaking when closed or muted
  useEffect(() => {
    if (!isOpen || !voiceEnabled) {
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen, voiceEnabled]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // --- Internal Handlers ---

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(null, false);
    }
  };

  const quickActions = [
    { label: '📚 Rekomendasi Kursus', message: 'Rekomendasikan kursus untuk saya' },
    { label: '💰 Info Harga', message: 'Berapa harga kursus di Mavecode?' },
    { label: '🚀 Cara Mulai', message: 'Bagaimana cara mulai belajar di Mavecode?' },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white p-0.5 shadow-2xl flex items-center justify-center border-2 border-primary"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img src={LOGO_URL} alt="Mavecode AI" className="w-full h-full object-cover" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-primary rounded-full"
            />
          </div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-48px)] bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-primary p-0.5 bg-white relative">
                  <img src={LOGO_URL} alt="Mavecode" className="w-full h-full rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                    Mavecode AI <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {isSpeaking ? '🔊 Berbicara...' : isListening ? '🎤 Mendengarkan...' : 'Online • Powered by Gemini'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-8 h-8 ${voiceEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none shadow-lg'
                      : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-none'
                      }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card/50">
              {messages.length <= 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.message, false)}
                      className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold rounded-xl whitespace-nowrap"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanya Mavecode..."
                    className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <button
                    onClick={startListening}
                    disabled={isListening || loading}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:text-primary'
                      }`}
                  >
                    <motion.div animate={isListening ? { scale: [1, 1.2, 1] } : {}}>
                      <X className={`w-4 h-4 ${isListening ? '' : 'hidden'}`} />
                      <svg className={`w-4 h-4 ${isListening ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </motion.div>
                  </button>
                </div>
                <button
                  onClick={() => sendMessage(null, false)}
                  disabled={!input.trim() || loading}
                  className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/40 text-center mt-3 uppercase tracking-widest font-bold">
                Mavecode Intelligent Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
