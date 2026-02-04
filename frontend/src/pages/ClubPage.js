import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash, MessageSquare, Video, Code, Share2, Users, Search, Plus, Settings,
    Mic, MicOff, Headphones, Send, MoreVertical, Github, Trophy, Zap, X,
    Phone, PhoneOff, VideoOff, Copy, Check, UserPlus, VolumeX, Camera,
    Edit3, Save, Smile, Image as ImageIcon, AudioLines
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { useAuth } from '../context/AppContext';
import { toast } from 'sonner';

// 25 Cute & Adorable Avatar options
const AVATARS = [
    // Adventurer (cute characters)
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Mave1&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Mave2&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Mave3&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Coder1&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Coder2&backgroundColor=ffdfbf',
    // Fun Emoji
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy1',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool2',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cute3',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Love4',
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star5',
    // Lorelei (anime style)
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Anime1',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Anime2',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Anime3',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Kawaii',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Chibi',
    // Notionists (minimal cute)
    'https://api.dicebear.com/7.x/notionists/svg?seed=Notion1',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Notion2',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Notion3',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Notion4',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Notion5',
    // Avataaars (cartoon style)
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar5',
];

const ClubPage = () => {
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState('umum');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, user: 'Firza Ilmi', avatar: AVATARS[0], time: '14:20', text: 'Halo semuanya! Selamat datang di Mavecode Club.', tag: 'Mentor', channel: 'umum' },
        { id: 2, user: 'Budi Raharjo', avatar: AVATARS[1], time: '14:22', text: 'Keren banget fiturnya!', channel: 'umum' },
    ]);

    // Voice/Video State
    const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    // Profile & Invite
    const [showProfile, setShowProfile] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'User Mavecode',
        bio: 'Belajar coding di Mavecode!',
        avatar: AVATARS[0],
        status: 'online'
    });
    const [copied, setCopied] = useState(false);

    // Online users with real-time simulation
    const [onlineUsers, setOnlineUsers] = useState([
        { id: 1, name: 'Firza Ilmi', role: 'Mentor', status: 'online', avatar: AVATARS[0], inVoice: 'live-coding' },
        { id: 2, name: 'Budi Raharjo', role: 'Student', status: 'online', avatar: AVATARS[1], inVoice: 'study-room' },
        { id: 3, name: 'Siti Aminah', role: 'Student', status: 'online', avatar: AVATARS[2], inVoice: 'study-room' },
        { id: 4, name: 'Andi Wijaya', role: 'Student', status: 'idle', avatar: AVATARS[3], inVoice: null },
    ]);

    const channels = [
        { id: 'umum', name: 'umum', icon: Hash },
        { id: 'proyek', name: 'sharing-proyek', icon: Code },
        { id: 'tanya-jawab', name: 'tanya-jawab', icon: MessageSquare },
        { id: 'mabar', name: 'mabar-coding', icon: Zap },
    ];

    const voiceChannels = [
        { id: 'lounge', name: 'Lounge', icon: Mic },
        { id: 'live-coding', name: 'Live Coding Room', icon: Video },
        { id: 'study-room', name: 'Study Group #1', icon: Mic },
    ];

    const messagesEndRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const videoRef = useRef(null);
    const localStreamRef = useRef(null);

    // Start/Stop camera when video is toggled
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !isMuted });
                localStreamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                toast.success('Kamera aktif!');
            } catch (err) {
                toast.error('Gagal mengakses kamera');
                setIsVideoOn(false);
            }
        };

        const stopCamera = () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
        };

        if (isVideoOn && showVideoCall) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => stopCamera();
    }, [isVideoOn, showVideoCall]);

    // Update audio mute state
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted]);

    // Simulate real-time status changes
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineUsers(prev => prev.map(u => ({
                ...u,
                status: Math.random() > 0.9 ? (u.status === 'online' ? 'idle' : 'online') : u.status
            })));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Recording timer
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChannel]);

    const handleSendMessage = (audioUrl = null) => {
        if (!message.trim() && !audioUrl) return;
        const newMsg = {
            id: Date.now(),
            user: profileData.name,
            avatar: profileData.avatar,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            text: audioUrl ? null : message,
            audioUrl,
            channel: activeChannel
        };
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
        toast.success('Pesan terkirim!');
    };

    const handleVoiceRecord = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];
                recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
                recorder.onstop = () => {
                    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    handleSendMessage(url);
                    stream.getTracks().forEach(t => t.stop());
                };
                recorder.start();
                setIsRecording(true);
                toast.info('Merekam suara...');
            } catch {
                toast.error('Gagal akses mikrofon');
            }
        }
    };

    const handleJoinVoice = (channelId) => {
        if (activeVoiceChannel === channelId) {
            setActiveVoiceChannel(null);
            setShowVideoCall(false);
            setOnlineUsers(prev => prev.map(u => u.name === profileData.name ? { ...u, inVoice: null } : u));
            toast.info('Keluar dari voice channel');
        } else {
            setActiveVoiceChannel(channelId);
            if (channelId === 'live-coding') { setShowVideoCall(true); setIsVideoOn(true); }
            setOnlineUsers(prev => prev.map(u => u.name === profileData.name ? { ...u, inVoice: channelId } : u));
            toast.success(`Bergabung ke ${voiceChannels.find(c => c.id === channelId)?.name}`);
        }
    };

    const getUsersInVoice = (channelId) => onlineUsers.filter(u => u.inVoice === channelId);

    const handleCopyInvite = () => {
        navigator.clipboard.writeText('https://mavecode.id/club/invite/abc123');
        setCopied(true);
        toast.success('Link disalin!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveProfile = () => {
        setEditingProfile(false);
        toast.success('Profil disimpan!');
    };

    const filteredMessages = messages.filter(m => m.channel === activeChannel);

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background mt-20">
            {/* Sidebar */}
            <div className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <Button variant="outline" className="w-full justify-between font-bold" onClick={() => setShowInviteModal(true)}>
                        Mavecode Club <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <ScrollArea className="flex-1 px-2 py-4">
                    <p className="px-2 mb-2 text-xs font-bold uppercase text-muted-foreground">Text Channels</p>
                    {channels.map(ch => (
                        <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                            className={`w-full flex items-center px-2 py-1.5 rounded-md mb-0.5 ${activeChannel === ch.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'}`}>
                            <ch.icon className="w-4 h-4 mr-2" />{ch.name}
                        </button>
                    ))}
                    <p className="px-2 mt-4 mb-2 text-xs font-bold uppercase text-muted-foreground">Voice Channels</p>
                    {voiceChannels.map(ch => (
                        <div key={ch.id}>
                            <button onClick={() => handleJoinVoice(ch.id)}
                                className={`w-full flex items-center px-2 py-1.5 rounded-md mb-0.5 ${activeVoiceChannel === ch.id ? 'bg-green-500/20 text-green-400' : 'text-muted-foreground hover:bg-accent'}`}>
                                <ch.icon className="w-4 h-4 mr-2" />{ch.name}
                                {getUsersInVoice(ch.id).length > 0 && <span className="ml-auto text-xs text-green-400">{getUsersInVoice(ch.id).length}</span>}
                            </button>
                            {getUsersInVoice(ch.id).map(u => (
                                <div key={u.id} className="pl-6 flex items-center gap-2 text-xs text-muted-foreground py-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />{u.name}
                                </div>
                            ))}
                        </div>
                    ))}
                </ScrollArea>
                {/* User Bar */}
                <div className="p-3 bg-muted/30 border-t border-border">
                    {activeVoiceChannel && (
                        <div className="mb-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center justify-between">
                            <div><p className="text-xs text-green-400 font-bold">Voice Connected</p>
                                <p className="text-[10px] text-muted-foreground">{voiceChannels.find(c => c.id === activeVoiceChannel)?.name}</p></div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleJoinVoice(activeVoiceChannel)}><PhoneOff className="h-3 w-3" /></Button>
                        </div>
                    )}
                    <div className="flex items-center gap-2" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
                        <Avatar className="h-8 w-8 border-2 border-primary"><AvatarImage src={profileData.avatar} /><AvatarFallback>U</AvatarFallback></Avatar>
                        <div className="flex-1 overflow-hidden"><p className="text-xs font-bold truncate">{profileData.name}</p>
                            <p className="text-[10px] text-muted-foreground">{profileData.status === 'online' ? '🟢 Online' : '🟡 Idle'}</p></div>
                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className={`h-7 w-7 ${isMuted ? 'text-red-400' : ''}`} onClick={e => { e.stopPropagation(); setIsMuted(!isMuted); }}>
                                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>
                        </TooltipTrigger><TooltipContent>{isMuted ? 'Unmute' : 'Mute'}</TooltipContent></Tooltip></TooltipProvider>
                    </div>
                </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur">
                    <div className="flex items-center gap-2"><Hash className="w-5 h-5 text-muted-foreground" /><h2 className="font-bold">{channels.find(c => c.id === activeChannel)?.name}</h2></div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setShowVideoCall(true); handleJoinVoice('live-coding'); }}><Video className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(true)}><UserPlus className="h-5 w-5" /></Button>
                    </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12"><MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Belum ada pesan</p></div>
                    ) : filteredMessages.map(msg => (
                        <div key={msg.id} className="flex gap-3 hover:bg-muted/30 -mx-4 px-4 py-2">
                            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => { setProfileData(p => ({ ...p, viewingUser: msg })); setShowProfile(true); }}>
                                <AvatarImage src={msg.avatar} /><AvatarFallback>{msg.user[0]}</AvatarFallback></Avatar>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-bold text-primary">{msg.user}</span>
                                    {msg.tag && <Badge variant="secondary" className="h-4 text-[10px]">{msg.tag}</Badge>}
                                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                </div>
                                {msg.audioUrl ? (
                                    <audio controls src={msg.audioUrl} className="h-8" />
                                ) : <p className="text-sm">{msg.text}</p>}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </ScrollArea>
                {/* Input */}
                <div className="p-4 bg-background">
                    <div className="flex items-center bg-muted/50 rounded-lg p-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-5 w-5" /></Button>
                        <Input placeholder={`Kirim pesan ke #${channels.find(c => c.id === activeChannel)?.name}`}
                            className="border-none bg-transparent" value={message} onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && message.trim()) handleSendMessage(); }} />
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} onClick={handleVoiceRecord}>
                            {isRecording ? <AudioLines className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        {isRecording && <span className="text-xs text-red-400 mx-2">{recordingTime}s</span>}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSendMessage()} disabled={!message.trim()}><Send className="h-5 w-5" /></Button>
                    </div>
                </div>
            </div>

            {/* Members Sidebar */}
            <div className="w-64 bg-card border-l border-border hidden xl:flex flex-col">
                <div className="p-4 border-b border-border"><h3 className="font-bold text-sm">Members Online — {onlineUsers.filter(u => u.status === 'online').length}</h3></div>
                <ScrollArea className="flex-1 p-2">
                    {onlineUsers.map(u => (
                        <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer" onClick={() => { setProfileData(p => ({ ...p, viewingUser: u })); setShowProfile(true); }}>
                            <div className="relative"><Avatar className="h-9 w-9"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${u.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} /></div>
                            <div><p className={`text-sm font-bold ${u.role === 'Mentor' ? 'text-primary' : ''}`}>{u.name}</p>
                                <p className="text-[10px] text-muted-foreground">{u.inVoice ? `🔊 ${voiceChannels.find(v => v.id === u.inVoice)?.name}` : u.role}</p></div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Video Call Modal */}
            <AnimatePresence>
                {showVideoCall && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl w-full max-w-4xl overflow-hidden">
                            <div className="p-4 border-b border-border flex justify-between"><div><h2 className="font-bold text-lg">Live Coding Room</h2><p className="text-sm text-muted-foreground">{getUsersInVoice('live-coding').length + 1} peserta</p></div>
                                <Button variant="ghost" size="icon" onClick={() => { setShowVideoCall(false); handleJoinVoice('live-coding'); }}><X className="h-5 w-5" /></Button></div>
                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                                {getUsersInVoice('live-coding').map(u => (
                                    <div key={u.id} className="aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center">
                                        <Avatar className="h-16 w-16"><AvatarImage src={u.avatar} /></Avatar>
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs">{u.name}</div>
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    </div>
                                ))}
                                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden border-2 border-primary">
                                    {isVideoOn ? (
                                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Avatar className="h-16 w-16"><AvatarImage src={profileData.avatar} /></Avatar>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs">Anda</div>
                                    {isMuted && <MicOff className="absolute top-2 right-2 w-4 h-4 text-red-400" />}
                                    {isVideoOn && <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-red-500 rounded text-[10px] font-bold"><div className="w-2 h-2 bg-white rounded-full animate-pulse" />LIVE</div>}
                                </div>
                            </div>
                            <div className="p-4 border-t border-border flex justify-center gap-4">
                                <Button variant={isMuted ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12" onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <MicOff /> : <Mic />}</Button>
                                <Button variant={!isVideoOn ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12" onClick={() => setIsVideoOn(!isVideoOn)}>
                                    {isVideoOn ? <Video /> : <VideoOff />}</Button>
                                <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={() => { setShowVideoCall(false); handleJoinVoice('live-coding'); }}><PhoneOff /></Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Modal */}
            <AnimatePresence>
                {showProfile && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between mb-6"><h2 className="font-bold text-xl">Profil</h2>
                                <div className="flex gap-2">{!editingProfile && <Button variant="ghost" size="icon" onClick={() => setEditingProfile(true)}><Edit3 className="h-4 w-4" /></Button>}
                                    <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}><X className="h-5 w-5" /></Button></div></div>
                            <div className="text-center mb-6">
                                {/* Animated 3D Floating Avatar */}
                                <motion.div
                                    animate={{ y: [0, -10, 0], rotateY: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative inline-block"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 rounded-full blur-xl opacity-50 animate-pulse" />
                                    <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-primary relative z-10 shadow-2xl">
                                        <AvatarImage src={profileData.avatar} className="bg-card" />
                                    </Avatar>
                                </motion.div>
                                {editingProfile ? (
                                    <div className="space-y-4">
                                        <Input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} placeholder="Nama" />
                                        <Input value={profileData.bio} onChange={e => setProfileData(p => ({ ...p, bio: e.target.value }))} placeholder="Bio" />
                                        <p className="text-xs text-muted-foreground text-left">Pilih Avatar (25 pilihan):</p>
                                        <ScrollArea className="h-48">
                                            <div className="grid grid-cols-5 gap-2">
                                                {AVATARS.map((av, i) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`p-1 rounded-xl cursor-pointer transition-all ${profileData.avatar === av ? 'ring-2 ring-primary bg-primary/20' : 'hover:bg-muted'}`}
                                                        onClick={() => setProfileData(p => ({ ...p, avatar: av }))}
                                                    >
                                                        <img src={av} alt="" className="w-full aspect-square rounded-lg bg-muted" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                        <Button className="w-full" onClick={handleSaveProfile}><Save className="mr-2 h-4 w-4" />Simpan</Button>
                                    </div>
                                ) : (<>
                                    <h3 className="font-bold text-lg">{profileData.name}</h3>
                                    <p className="text-muted-foreground text-sm">{profileData.bio}</p>
                                    <Badge className="mt-2">{profileData.status === 'online' ? '🟢 Online' : '🟡 Idle'}</Badge>
                                </>)}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowInviteModal(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between mb-6"><h2 className="font-bold text-xl">Undang Teman</h2>
                                <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}><X className="h-5 w-5" /></Button></div>
                            <p className="text-muted-foreground text-sm mb-4">Bagikan link ini:</p>
                            <div className="flex gap-2 mb-6"><Input value="https://mavecode.id/club/invite/abc123" readOnly className="bg-muted/50" />
                                <Button onClick={handleCopyInvite}>{copied ? <Check /> : <Copy />}</Button></div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => window.open('https://wa.me/?text=Join%20Mavecode%20Club!', '_blank')}>WhatsApp</Button>
                                <Button variant="outline" className="flex-1" onClick={() => window.open('https://t.me/share/url?url=mavecode.id', '_blank')}>Telegram</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClubPage;
