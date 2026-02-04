import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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

  // Setup Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // Text to Speech
  const speak = useCallback((text) => {
    if (!voiceEnabled || !synthRef.current) return;
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

    synthRef.current.speak(utterance);
  }, [voiceEnabled]);

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      toast.info('🎤 Mendengarkan...');
    }
  };

  // Handle navigation from AI response
  const handleNavigation = (content) => {
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
  };

  // Send message via backend API
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat`, {
        message: userMessage,
        session_id: sessionId
      });

      setSessionId(res.data.session_id);
      let aiResponse = handleNavigation(res.data.response);

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      if (voiceEnabled) {
        speak(aiResponse.substring(0, 300));
      }
    } catch (err) {
      console.error('Chat API Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, aku sedang mengalami gangguan teknis. 😅 Coba lagi ya!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick actions
  const quickActions = [
    { label: '📚 Rekomendasi Kursus', message: 'Rekomendasikan kursus untuk saya' },
    { label: '💰 Info Harga', message: 'Berapa harga kursus di Mavecode?' },
    { label: '🚀 Cara Mulai', message: 'Bagaimana cara mulai belajar di Mavecode?' },
  ];

  const sendQuickMessage = (message) => {
    setInput(message);
    setTimeout(() => {
      const fakeEvent = { key: 'Enter', shiftKey: false, preventDefault: () => { } };
      handleKeyPress(fakeEvent);
    }, 100);
  };

  return (
    <>
      {/* Chat Button with Bubbling Animation */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: { duration: 0.3 }
        }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white p-0.5 shadow-2xl flex items-center justify-center border-2 border-primary ${isOpen ? 'hidden' : ''}`}
        style={{
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.2)',
        }}
        data-testid="chatbot-toggle"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <img src={LOGO_URL} alt="Mavecode AI" className="w-full h-full object-cover" />
          {/* Animated rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-2 border-primary rounded-full pointer-events-none"
          />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[550px] bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 255, 0.1)' }}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-primary p-0.5 bg-white relative">
                  <img src={LOGO_URL} alt="Mavecode" className="w-full h-full rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-1.5">
                    Mavecode AI <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {isSpeaking ? '🔊 Berbicara...' : isListening ? '🎤 Mendengarkan...' : 'Online • Powered by Gemini'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`hover:bg-primary/10 w-8 h-8 ${voiceEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                  title={voiceEnabled ? 'Matikan suara' : 'Nyalakan suara'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-red-500/10 hover:text-red-500 w-8 h-8"
                  data-testid="chatbot-close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendQuickMessage(action.message)}
                    className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-2xl whitespace-nowrap transition-all shadow-sm"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-5" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === 'user' ? 'bg-primary/20' : 'p-0.5 bg-white border border-primary'
                      }`}>
                      {msg.role === 'user' ? (
                        <User className="w-5 h-5 text-primary" />
                      ) : (
                        <img src={LOGO_URL} alt="Bot" className="w-full h-full rounded-full object-cover" />
                      )}
                    </div>
                    <div className={`max-w-[85%] rounded-[20px] px-4 py-3 shadow-sm ${msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-muted/50 backdrop-blur-sm border border-white/5 rounded-tl-none'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full p-0.5 bg-white border border-primary flex items-center justify-center shadow-md">
                      <img src={LOGO_URL} alt="Bot" className="w-full h-full rounded-full object-cover grayscale" />
                    </div>
                    <div className="bg-muted/50 backdrop-blur-sm border border-white/5 rounded-[20px] rounded-tl-none px-5 py-4">
                      <div className="flex gap-1.5">
                        <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary rounded-full" />
                        <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-accent rounded-full" />
                        <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Container */}
            <div className="p-5 bg-gradient-to-t from-background to-transparent">
              <div className="relative flex gap-2 p-1.5 bg-muted/50 backdrop-blur-md rounded-3xl border border-white/5 shadow-inner">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startListening}
                  disabled={loading}
                  className={`w-10 h-10 rounded-full flex-shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-primary hover:bg-primary/20'}`}
                  title="Bicara dengan AI"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Mavecode AI..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50 h-10"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex-shrink-0 shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground/40 text-center mt-3 uppercase tracking-[0.2em] font-bold">
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
