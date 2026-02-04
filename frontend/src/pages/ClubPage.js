import React, { useState } from 'react';
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
    Headphones,
    Send,
    MoreVertical,
    Github,
    Trophy,
    Zap
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

const ClubPage = () => {
    const [activeChannel, setActiveChannel] = useState('umum');
    const [message, setMessage] = useState('');

    const channels = [
        { id: 'umum', name: 'umum', icon: Hash, type: 'text' },
        { id: 'proyek', name: 'sharing-proyek', icon: Code, type: 'text' },
        { id: 'tanya-jawab', name: 'tanya-jawab', icon: MessageSquare, type: 'text' },
        { id: 'mabar', name: 'mabar-coding', icon: Zap, type: 'text' },
    ];

    const voiceChannels = [
        { id: 'lounge', name: 'Lounge', icon: Mic },
        { id: 'live-coding', name: 'Live Coding Room', icon: Video },
        { id: 'study-room', name: 'Study Group #1', icon: Mic },
    ];

    const onlineUsers = [
        { id: 1, name: 'Firza Ilmi', role: 'Mentor', status: 'online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
        { id: 2, name: 'Budi Raharjo', role: 'Student', status: 'online', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
        { id: 3, name: 'Siti Aminah', role: 'Student', status: 'online', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 4, name: 'Andi Wijaya', role: 'Student', status: 'idle', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100' },
    ];

    const messages = [
        {
            id: 1,
            user: 'Firza Ilmi',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            time: '14:20',
            text: 'Halo semuanya! Selamat datang di Mavecode Club. Di sini kalian bisa bebas diskusi apa saja seputar teknologi.',
            tag: 'Mentor'
        },
        {
            id: 2,
            user: 'Budi Raharjo',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
            time: '14:22',
            text: 'Keren banget fiturnya! Izin bertanya min, untuk modul React Hooks apakah ada grup diskusinya?',
        },
        {
            id: 3,
            user: 'Siti Aminah',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            time: '14:25',
            text: 'Saya baru saja sharing proyek Landing Page saya di channel #sharing-proyek. Mohon review-nya ya teman-teman! 🚀',
        },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
            {/* Sidebar Channels */}
            <div className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <Button variant="outline" className="w-full justify-between font-bold text-lg">
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
                                </button>
                            ))}
                        </div>

                        <div>
                            <p className="px-2 mb-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                Voice Channels
                            </p>
                            {voiceChannels.map((channel) => (
                                <button
                                    key={channel.id}
                                    className="w-full flex items-center px-2 py-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-0.5"
                                >
                                    <channel.icon className="w-4 h-4 mr-2" />
                                    <span className="font-medium">{channel.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                {/* User Control Bar */}
                <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Avatar className="h-8 w-8 border-2 border-primary">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">User Mavecode</p>
                            <p className="text-[10px] text-muted-foreground truncate">#4412 • Online</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mute</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Headphones className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Deafen</TooltipContent>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Video className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Users className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6 max-w-4xl">
                        {messages.map((msg) => (
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
                        ))}
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
                                    // Push locally for demo
                                    setMessage('');
                                }
                            }}
                        />
                        <div className="flex items-center gap-1 pr-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Mic className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 px-2 overflow-x-auto pb-1 no-scrollbar">
                        <Badge variant="outline" className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap">
                            <Code className="h-3 w-3" /> Coding bersama
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap">
                            <Share2 className="h-3 w-3" /> Share Project
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap">
                            <Github className="h-3 w-3" /> Integrasi GitHub
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center cursor-pointer hover:bg-accent transition-colors whitespace-nowrap">
                            <Trophy className="h-3 w-3" /> Challenge Mingguan
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Social Stats */}
            <div className="w-64 bg-card border-l border-border hidden xl:flex flex-col">
                <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-sm">Members Online</h3>
                </div>
                <ScrollArea className="flex-1 p-2">
                    {onlineUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
                            <div className="relative">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={`text-sm font-bold truncate ${user.role === 'Mentor' ? 'text-primary' : ''}`}>
                                    {user.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>

                {/* Stats Ad Area */}
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
        </div>
    );
};

export default ClubPage;
