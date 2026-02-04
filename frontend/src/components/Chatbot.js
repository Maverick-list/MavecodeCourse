import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const GEMINI_API_KEY = 'AIzaSyBF31srABxKOmh1pMvf2H3sSZK-Y8u9fG8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// System prompt for Mavecode AI
const SYSTEM_PROMPT = `Kamu adalah Mavecode AI, asisten cerdas untuk platform belajar coding Mavecode. Kepribadianmu:
- Ramah, antusias, dan suportif seperti mentor coding yang berpengalaman
- Berbicara dalam Bahasa Indonesia dengan gaya casual tapi profesional
- Sering menggunakan emoji untuk membuat percakapan lebih friendly
- Memberikan jawaban yang informatif tapi ringkas

TENTANG MAVECODE:
- Platform belajar coding #1 di Indonesia
- Didirikan oleh Firza Ilmi, Full-Stack Developer berpengalaman
- Menyediakan kursus berkualitas dengan harga terjangkau
- Fitur: Club (komunitas Discord-like), Block IDE (coding online), Focus Mode (Pomodoro timer)

KURSUS TERSEDIA:
1. "Full Stack JavaScript" - Rp 299.000 - Belajar React, Node.js, MongoDB (28 jam)
2. "Python untuk Pemula" - Rp 199.000 - Dasar Python hingga automation (20 jam)
3. "React Native Mobile" - Rp 349.000 - Buat aplikasi iOS & Android (32 jam)
4. "Machine Learning Dasar" - Rp 399.000 - AI/ML dengan Python (35 jam)
5. "DevOps & Cloud" - Rp 449.000 - Docker, Kubernetes, AWS (40 jam)
6. "UI/UX Design" - Rp 249.000 - Figma dan design system (18 jam)

ARTIKEL TERBARU:
- "Masa Depan AI 2025" - Trend AI generative
- "Prompt Engineering" - Cara berkomunikasi dengan LLM
- "Tips Belajar Coding" - 10 tips untuk pemula
- "Trend Teknologi 2025" - Skill yang dicari
- "Portfolio Developer" - Cara membuat portfolio menarik

KEMAMPUANMU:
1. Merekomendasikan kursus berdasarkan kebutuhan user
2. Menjawab pertanyaan tentang teknologi dan programming
3. Memberikan tips belajar coding
4. Membantu navigasi website
5. Menjelaskan fitur Mavecode

PANDUAN NAVIGASI (gunakan format [NAVIGATE:/path]):
- Halaman Kursus: [NAVIGATE:/courses]
- Kursus Specific: [NAVIGATE:/courses/{id}]
- Artikel: [NAVIGATE:/articles]
- Club: [NAVIGATE:/club]
- Block IDE: [NAVIGATE:/block]
- Dashboard: [NAVIGATE:/dashboard]
- Harga: [NAVIGATE:/pricing]

Jika user bertanya tentang kursus yang cocok, tanyakan dulu:
1. Level mereka (pemula/menengah/mahir)
2. Bahasa/teknologi yang diminati
3. Tujuan belajar (kerja/freelance/proyek)

Setelah itu rekomendasikan dan tawarkan untuk membawa mereka ke halaman kursus.

PENTING: Jika user menyapa dengan "Hi Mavecode" atau sejenisnya, balas dengan sapaan hangat!`;

export const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! 👋 Saya Mavecode AI, asisten cerdas yang siap membantu perjalanan coding kamu. Mau tanya tentang kursus, teknologi, atau butuh rekomendasi? 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
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
        if (isWakeWordActive) {
          // Check for wake word
          if (transcript.toLowerCase().includes('hi mavecode') ||
            transcript.toLowerCase().includes('hai mavecode') ||
            transcript.toLowerCase().includes('halo mavecode')) {
            setIsOpen(true);
            setIsWakeWordActive(false);
            speak('Hai! Ada yang bisa aku bantu?');
          }
        } else {
          setInput(transcript);
          // Auto-send after voice input
          setTimeout(() => sendMessageWithText(transcript), 500);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [isWakeWordActive]);

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

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.1;
    utterance.pitch = 1;

    // Try to find Indonesian voice
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

  // Send message to Gemini
  const sendMessageWithText = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Build conversation history
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Saya mengerti! Saya adalah Mavecode AI, siap membantu dengan ramah dan informatif. 👋' }] },
            ...history,
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        let aiResponse = data.candidates[0].content.parts[0].text;
        aiResponse = handleNavigation(aiResponse);

        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

        // Speak the response
        if (voiceEnabled) {
          speak(aiResponse.substring(0, 300)); // Limit speech length
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, aku sedang mengalami gangguan teknis. 😅 Coba lagi ya, atau hubungi tim kami via WhatsApp: +62 851 9176 9521'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => sendMessageWithText(input);

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

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg flex items-center justify-center ${isOpen ? 'hidden' : ''}`}
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        data-testid="chatbot-toggle"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[550px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: '0 0 50px rgba(0, 255, 255, 0.2)' }}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1">
                    Mavecode AI <Sparkles className="w-3 h-3" />
                  </h3>
                  <p className="text-xs text-white/70">
                    {isSpeaking ? '🔊 Berbicara...' : isListening ? '🎤 Mendengarkan...' : 'Powered by Gemini'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="text-white hover:bg-white/20 w-8 h-8"
                  title={voiceEnabled ? 'Matikan suara' : 'Nyalakan suara'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 w-8 h-8"
                  data-testid="chatbot-close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-b border-border flex gap-2 overflow-x-auto">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessageWithText(action.message)}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs rounded-full whitespace-nowrap transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20' : 'bg-gradient-to-br from-primary/30 to-accent/30'
                      }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-primary" />
                      ) : (
                        <Bot className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-accent animate-spin" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={startListening}
                  disabled={loading}
                  className={`flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
                  title="Bicara dengan AI"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik atau bicara..."
                  className="flex-1"
                  disabled={loading}
                  data-testid="chatbot-input"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  data-testid="chatbot-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                💡 Tip: Katakan "Hi Mavecode" untuk mengaktifkan saya
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
