import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash,
    MessageSquare,
    Video,
    Code,
    Share2,
    Users,
    Search,
    Plus,
    Settings,
    Mic,
    MicOff,
    Headphones,
    Send,
    MoreVertical,
    Github,
    Trophy,
    Zap,
    X,
    Phone,
    PhoneOff,
    VideoOff,
    Copy,
    Check,
    UserPlus,
    Volume2,
    VolumeX
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { useAuth } from '../context/AppContext';
import { toast } from 'sonner';

const ClubPage = () => {
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState('umum');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            user: 'Firza Ilmi',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            time: '14:20',
            text: 'Halo semuanya! Selamat datang di Mavecode Club. Di sini kalian bisa bebas diskusi apa saja seputar teknologi.',
            tag: 'Mentor',
            channel: 'umum'
        },
        {
            id: 2,
            user: 'Budi Raharjo',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
            time: '14:22',
            text: 'Keren banget fiturnya! Izin bertanya min, untuk modul React Hooks apakah ada grup diskusinya?',
            channel: 'umum'
        },
        {
            id: 3,
            user: 'Siti Aminah',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            time: '14:25',
            text: 'Saya baru saja sharing proyek Landing Page saya di channel #sharing-proyek. Mohon review-nya ya teman-teman! 🚀',
            channel: 'umum'
        },
        {
            id: 4,
            user: 'Firza Ilmi',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            time: '15:00',
            text: 'Channel ini khusus untuk sharing proyek kalian. Silakan upload link GitHub atau demo project!',
            tag: 'Mentor',
            channel: 'proyek'
        },
        {
            id: 5,
            user: 'Andi Wijaya',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
            time: '15:10',
            text: 'Ini project portfolio saya: https://github.com/andi/portfolio - mohon feedbacknya!',
            channel: 'proyek'
        },
    ]);

    // Voice/Video Call State
    const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [showVideoCall, setShowVideoCall] = useState(false);

    // Invite Modal
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteLink, setInviteLink] = useState('https://mavecode.id/club/invite/abc123xyz');
    const [copied, setCopied] = useState(false);

    const messagesEndRef = useRef(null);

    const channels = [
        { id: 'umum', name: 'umum', icon: Hash, type: 'text' },
        { id: 'proyek', name: 'sharing-proyek', icon: Code, type: 'text' },
        { id: 'tanya-jawab', name: 'tanya-jawab', icon: MessageSquare, type: 'text' },
        { id: 'mabar', name: 'mabar-coding', icon: Zap, type: 'text' },
    ];

    const voiceChannels = [
        { id: 'lounge', name: 'Lounge', icon: Mic, users: [] },
        { id: 'live-coding', name: 'Live Coding Room', icon: Video, users: ['Firza Ilmi'] },
        { id: 'study-room', name: 'Study Group #1', icon: Mic, users: ['Budi Raharjo', 'Siti Aminah'] },
    ];

    const onlineUsers = [
        { id: 1, name: 'Firza Ilmi', role: 'Mentor', status: 'online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
        { id: 2, name: 'Budi Raharjo', role: 'Student', status: 'online', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
        { id: 3, name: 'Siti Aminah', role: 'Student', status: 'online', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 4, name: 'Andi Wijaya', role: 'Student', status: 'idle', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100' },
    ];

    const filteredMessages = messages.filter(msg => msg.channel === activeChannel);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChannel]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user?.name || 'User Mavecode',
            avatar: 'https://github.com/shadcn.png',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            text: message,
            channel: activeChannel
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        toast.success('Pesan terkirim!');
    };

    const handleJoinVoiceChannel = (channelId) => {
        if (activeVoiceChannel === channelId) {
            // Leave channel
            setActiveVoiceChannel(null);
            setShowVideoCall(false);
            toast.info('Keluar dari voice channel');
        } else {
            // Join channel
            setActiveVoiceChannel(channelId);
            if (channelId === 'live-coding') {
                setShowVideoCall(true);
                setIsVideoOn(true);
            }
            toast.success(`Bergabung ke ${voiceChannels.find(c => c.id === channelId)?.name}`);
        }
    };

    const handleCopyInvite = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success('Link undangan disalin!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background mt-20">
            {/* Sidebar Channels */}
            <div className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <Button
                        variant="outline"
                        className="w-full justify-between font-bold text-lg"
                        onClick={() => setShowInviteModal(true)}
                    >
                        Mavecode Club
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-2 py-4">
                    <div className="space-y-4">
                        <div>
                            <p className="px-2 mb-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Text Channels
                            </p>
                            {channels.map((channel) => (
                                <button
                                    key={channel.id}
                                    onClick={() => setActiveChannel(channel.id)}
                                    className={`w-full flex items-center px-2 py-1.5 rounded-md transition-colors mb-0.5 ${activeChannel === channel.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    <channel.icon className="w-4 h-4 mr-2" />
                                    <span className="font-medium">{channel.name}</span>
                                    {messages.filter(m => m.channel === channel.id).length > 0 && (
                                        <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 rounded-full">
                                            {messages.filter(m => m.channel === channel.id).length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div>
                            <p className="px-2 mb-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Voice Channels
                            </p>
                            {voiceChannels.map((channel) => (
                                <div key={channel.id}>
                                    <button
                                        onClick={() => handleJoinVoiceChannel(channel.id)}
                                        className={`w-full flex items-center px-2 py-1.5 rounded-md transition-colors mb-0.5 ${activeVoiceChannel === channel.id
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                    >
                                        <channel.icon className="w-4 h-4 mr-2" />
                                        <span className="font-medium">{channel.name}</span>
                                        {channel.users.length > 0 && (
                                            <span className="ml-auto text-[10px] text-green-400">
                                                {channel.users.length} 👤
                                            </span>
                                        )}
                                    </button>
                                    {channel.users.length > 0 && (
                                        <div className="pl-6 space-y-1 mb-2">
                                            {channel.users.map((userName, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    {userName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                {/* User Control Bar */}
                <div className="p-3 bg-muted/30 border-t border-border">
                    {activeVoiceChannel && (
                        <div className="mb-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-green-400 font-bold">Voice Connected</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-400 hover:text-red-500"
                                    onClick={() => handleJoinVoiceChannel(activeVoiceChannel)}
                                >
                                    <PhoneOff className="h-3 w-3" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                {voiceChannels.find(c => c.id === activeVoiceChannel)?.name}
                            </p>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Avatar className="h-8 w-8 border-2 border-primary">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>UN</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold truncate">{user?.name || 'User Mavecode'}</p>
                                <p className="text-[10px] text-muted-foreground truncate">#4412 • Online</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-7 w-7 ${isMuted ? 'text-red-400' : ''}`}
                                            onClick={() => {
                                                setIsMuted(!isMuted);
                                                toast.info(isMuted ? 'Mic aktif' : 'Mic dimatikan');
                                            }}
                                        >
                                            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{isMuted ? 'Unmute' : 'Mute'}</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-7 w-7 ${isDeafened ? 'text-red-400' : ''}`}
                                            onClick={() => {
                                                setIsDeafened(!isDeafened);
                                                toast.info(isDeafened ? 'Audio aktif' : 'Audio dimatikan');
                                            }}
                                        >
                                            {isDeafened ? <VolumeX className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{isDeafened ? 'Undeafen' : 'Deafen'}</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Settings</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                {/* Chat Header */}
                <div className="h-14 px-4 flex items-center justify-between border-b border-border shadow-sm z-10 bg-background/80 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-muted-foreground" />
                        <h2 className="font-bold">{channels.find(c => c.id === activeChannel)?.name}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                                placeholder="Search"
                                className="h-7 w-48 pl-8 text-xs bg-muted/50 border-none"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setShowVideoCall(true);
                                    handleJoinVoiceChannel('live-coding');
                                }}
                            >
                                <Video className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setShowInviteModal(true)}
                            >
                                <UserPlus className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6 max-w-4xl">
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-bold text-lg mb-2">Belum ada pesan</h3>
                                <p className="text-muted-foreground text-sm">Jadilah yang pertama mengirim pesan di channel ini!</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div key={msg.id} className="group flex gap-3 hover:bg-muted/30 -mx-4 px-4 py-2 transition-colors">
                                    <Avatar className="h-10 w-10 mt-0.5 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                        <AvatarImage src={msg.avatar} />
                                        <AvatarFallback>{msg.user[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-bold text-primary cursor-pointer hover:underline underline-offset-4">
                                                {msg.user}
                                            </span>
                                            {msg.tag && (
                                                <Badge variant="secondary" className="h-4 text-[10px] bg-primary/20 text-primary border-none">
                                                    {msg.tag}
                                                </Badge>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/90">{msg.text}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 bg-background">
                    <div className="relative flex items-center bg-muted/50 rounded-lg p-2 focus-within:ring-2 ring-primary/30 transition-all">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Input
                            placeholder={`Kirim pesan ke #${channels.find(c => c.id === activeChannel)?.name}`}
                            className="border-none bg-transparent focus-visible:ring-0 text-sm h-10"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && message.trim()) {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <div className="flex items-center gap-1 pr-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 ${isMuted ? 'text-red-400' : 'text-muted-foreground hover:text-primary'}`}
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 px-2 overflow-x-auto pb-1 no-scrollbar">
                        <Badge
                            variant="outline"
                            className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                            onClick={() => {
                                handleJoinVoiceChannel('live-coding');
                                toast.success('Bergabung ke Live Coding Room!');
                            }}
                        >
                            <Code className="h-3 w-3" /> Coding bersama
                        </Badge>
                        <Badge
                            variant="outline"
                            className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                            onClick={() => {
                                setActiveChannel('proyek');
                                toast.info('Pindah ke channel sharing-proyek');
                            }}
                        >
                            <Share2 className="h-3 w-3" /> Share Project
                        </Badge>
                        <Badge
                            variant="outline"
                            className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                            onClick={() => {
                                window.open('https://github.com', '_blank');
                            }}
                        >
                            <Github className="h-3 w-3" /> Integrasi GitHub
                        </Badge>
                        <Badge
                            variant="outline"
                            className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                            onClick={() => toast.info('Challenge Mingguan akan segera hadir!')}
                        >
                            <Trophy className="h-3 w-3" /> Challenge Mingguan
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Members Online */}
            <div className="w-64 bg-card border-l border-border hidden xl:flex flex-col">
                <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-sm">Members Online — {onlineUsers.length}</h3>
                </div>
                <ScrollArea className="flex-1 p-2">
                    {onlineUsers.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
                            <div className="relative">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={`text-sm font-bold truncate ${member.role === 'Mentor' ? 'text-primary' : ''}`}>
                                    {member.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>

                {/* Pro Club Ad */}
                <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10">
                    <h4 className="text-xs font-bold mb-2 flex items-center gap-2">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        Join Pro Club
                    </h4>
                    <p className="text-[10px] text-muted-foreground mb-3">
                        Dapatkan fitur Premium: Ganti background, emoji kustom, dan prioritas live coding.
                    </p>
                    <Button size="sm" className="w-full text-[10px] h-7">Upgrade Now</Button>
                </div>
            </div>

            {/* Video Call Modal */}
            <AnimatePresence>
                {showVideoCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card rounded-2xl w-full max-w-4xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-lg">Live Coding Room</h2>
                                    <p className="text-sm text-muted-foreground">3 peserta aktif</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setShowVideoCall(false);
                                        setActiveVoiceChannel(null);
                                    }}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Main User */}
                                <div className="col-span-2 md:col-span-2 aspect-video bg-slate-900 rounded-xl relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {isVideoOn ? (
                                            <img
                                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
                                                alt="Firza Ilmi"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Avatar className="h-24 w-24">
                                                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" />
                                                <AvatarFallback>FI</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 rounded text-xs font-bold">
                                        Firza Ilmi (Mentor)
                                    </div>
                                </div>

                                {/* Other participants */}
                                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100" />
                                            <AvatarFallback>BR</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-[10px] font-bold">
                                        Budi Raharjo
                                    </div>
                                </div>

                                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden border-2 border-primary">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>ME</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-[10px] font-bold">
                                        Anda
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        {isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Call Controls */}
                            <div className="p-4 border-t border-border flex items-center justify-center gap-4">
                                <Button
                                    variant={isMuted ? "destructive" : "outline"}
                                    size="icon"
                                    className="rounded-full h-12 w-12"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </Button>
                                <Button
                                    variant={!isVideoOn ? "destructive" : "outline"}
                                    size="icon"
                                    className="rounded-full h-12 w-12"
                                    onClick={() => setIsVideoOn(!isVideoOn)}
                                >
                                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full h-12 w-12"
                                    onClick={() => {
                                        setShowVideoCall(false);
                                        setActiveVoiceChannel(null);
                                        toast.info('Keluar dari video call');
                                    }}
                                >
                                    <PhoneOff className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-12 w-12"
                                    onClick={() => setShowInviteModal(true)}
                                >
                                    <UserPlus className="h-5 w-5" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                        onClick={() => setShowInviteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card rounded-2xl w-full max-w-md p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-xl">Undang Teman</h2>
                                <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4">
                                Bagikan link ini untuk mengundang teman ke Mavecode Club:
                            </p>

                            <div className="flex gap-2 mb-6">
                                <Input
                                    value={inviteLink}
                                    readOnly
                                    className="bg-muted/50"
                                />
                                <Button onClick={handleCopyInvite} className="shrink-0">
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase text-muted-foreground">Atau kirim undangan via:</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={() => {
                                        window.open(`https://wa.me/?text=${encodeURIComponent(`Ayo bergabung di Mavecode Club! ${inviteLink}`)}`, '_blank');
                                    }}>
                                        WhatsApp
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => {
                                        window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('Ayo bergabung di Mavecode Club!')}`, '_blank');
                                    }}>
                                        Telegram
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => {
                                        window.open(`mailto:?subject=Undangan Mavecode Club&body=${encodeURIComponent(`Ayo bergabung di Mavecode Club! ${inviteLink}`)}`, '_blank');
                                    }}>
                                        Email
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClubPage;
