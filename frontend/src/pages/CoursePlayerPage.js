import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Play, CheckCircle, ChevronLeft, List, MessageSquare,
    FileText, Star, Settings, Maximize, Volume2,
    ChevronRight, Award, Lock
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth, API } from '../context/AppContext';
import { toast } from 'sonner';
import QuizComponent from '../components/QuizComponent';
import ContentPlaceholder from '../components/ContentPlaceholder';


const CoursePlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('syllabus'); // syllabus, discussion, resources

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [courseRes, videosRes] = await Promise.all([
                    axios.get(`${API}/courses/${id}`),
                    axios.get(`${API}/courses/${id}/videos`)
                ]);
                setCourse(courseRes.data);
                setVideos(videosRes.data);

                if (videosRes.data.length > 0) {
                    setCurrentVideo(videosRes.data[0]);
                }

                if (token) {
                    const progressRes = await axios.get(`${API}/progress/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProgress(progressRes.data);
                }
            } catch (err) {
                console.error('Error fetching course player data:', err);
                toast.error('Gagal memuat materi belajar');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    const toggleVideoStatus = async (videoId) => {
        if (!token) return;
        try {
            const currentStatus = progress.find(p => p.video_id === videoId)?.completed || false;
            await axios.post(`${API}/progress`, {
                course_id: id,
                video_id: videoId,
                completed: !currentStatus,
                progress_percent: !currentStatus ? 100 : 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setProgress(prev => {
                const index = prev.findIndex(p => p.video_id === videoId);
                if (index > -1) {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], completed: !currentStatus };
                    return updated;
                }
                return [...prev, { video_id: videoId, completed: !currentStatus }];
            });

            if (!currentStatus) {
                toast.success('Hore! Satu materi lagi selesai! 🎯');
            }
        } catch (err) {
            toast.error('Gagal memperbarui progres');
        }
    };

    const completedCount = progress.filter(p => p.completed).length;
    const overallProgress = videos.length > 0 ? (completedCount / videos.length) * 100 : 0;

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="hidden md:block">
                        <h1 className="font-heading font-bold text-lg line-clamp-1">{course?.title}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Progress value={overallProgress} className="h-1 w-24 bg-white/10" />
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                {completedCount} / {videos.length} SELESAI ({Math.round(overallProgress)}%)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full">
                        < Award size={14} className="fill-current" />
                        <span className="text-xs font-bold uppercase tracking-tight">Kumpulkan Sertifikat</span>
                    </div>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <Button variant="ghost" className="rounded-full gap-2 text-white hover:bg-white/10">
                        <MessageSquare size={18} />
                        <span className="hidden sm:inline">Bantuan</span>
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Player Area */}
                <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'mr-0' : 'mr-0'}`}>
                    <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden">
                        {currentVideo ? (
                            currentVideo.type === 'quiz' ? (
                                <QuizComponent onComplete={() => toggleVideoStatus(currentVideo.id)} />
                            ) : (
                                <div className="w-full h-full">
                                    {/* Immersive Video Overlay Shadow */}
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

                                    <iframe
                                        className="w-full h-full relative z-0"
                                        src={currentVideo.video_url.includes('youtube')
                                            ? currentVideo.video_url.replace('watch?v=', 'embed/') + '?autoplay=1&modestbranding=1&rel=0'
                                            : currentVideo.video_url
                                        }
                                        title={currentVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )
                        ) : (
                            <ContentPlaceholder title={`Selamat Datang di ${course?.title}`} />
                        )}
                    </div>

                    {/* Video Footer Info */}
                    <div className="p-6 bg-slate-900 overflow-y-auto max-h-[300px]">
                        <div className="max-w-4xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold font-heading">{currentVideo?.title}</h2>
                                <Button
                                    onClick={() => toggleVideoStatus(currentVideo?.id)}
                                    className={`rounded-full gap-2 transition-all ${progress.find(p => p.video_id === currentVideo?.id)?.completed
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-primary hover:bg-primary/90'
                                        }`}
                                >
                                    <CheckCircle size={18} />
                                    {progress.find(p => p.video_id === currentVideo?.id)?.completed ? 'Sudah Selesai' : 'Tandai Selesai'}
                                </Button>
                            </div>
                            <div className="flex gap-4 mb-6">
                                <Badge variant="outline" className="text-slate-400 border-white/10">
                                    {currentVideo?.duration_minutes} Menit
                                </Badge>
                                <Badge variant="outline" className="text-slate-400 border-white/10">
                                    ID: {currentVideo?.id.slice(0, 8)}
                                </Badge>
                            </div>
                            <p className="text-slate-300 leading-relaxed italic border-l-4 border-primary/30 pl-4">
                                {currentVideo?.description || 'Tidak ada deskripsi untuk materi ini. Fokus belajar dan kuasai materi hari ini! 🚀'}
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <FileText className="text-primary" size={18} />
                                            Bahan Bacaan
                                        </h4>
                                        <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <p className="text-xs text-slate-400">Download PDF dan materi pelengkap untuk video ini.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <MessageSquare className="text-accent" size={18} />
                                            Tanya Mentor
                                        </h4>
                                        <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <p className="text-xs text-slate-400">Stuck? Chat langsung ke mentor atau komunitas.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Dynamic Sidebar like Ruangguru */}
                <aside className={`w-[400px] border-l border-white/5 bg-slate-900 transition-all duration-300 flex flex-col relative ${sidebarOpen ? 'mr-0' : '-mr-[400px]'}`}>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`absolute left-0 top-1/2 -translate-x-full w-10 h-16 bg-slate-900 border border-white/5 border-r-0 rounded-l-2xl flex items-center justify-center transition-all hover:bg-slate-800 z-50`}
                    >
                        <div className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}>
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </button>

                    {/* Tabs Sidebar */}
                    <div className="flex border-b border-white/5">
                        {[
                            { id: 'syllabus', icon: List, label: 'Materi' },
                            { id: 'discussion', icon: MessageSquare, label: 'Diskusi' },
                            { id: 'resources', icon: FileText, label: 'Catatan' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-[3px] bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'syllabus' && (
                                <motion.div
                                    key="syllabus"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-4 space-y-2"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Syllabus Kursus</h3>
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {completedCount}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-400">Pencapaian Kamu</p>
                                                <p className="text-sm font-bold">{completedCount} dari {videos.length} Materi</p>
                                            </div>
                                        </div>
                                    </div>

                                    {videos.map((video, i) => {
                                        const isCurrent = currentVideo?.id === video.id;
                                        const isCompleted = progress.find(p => p.video_id === video.id)?.completed;

                                        return (
                                            <button
                                                key={video.id}
                                                onClick={() => setCurrentVideo(video)}
                                                className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all ${isCurrent
                                                    ? 'bg-primary/20 border border-primary/30 ring-1 ring-primary/20'
                                                    : 'hover:bg-white/5 border border-transparent'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                    ? 'bg-green-500 text-white'
                                                    : isCurrent ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle size={14} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold line-clamp-2 ${isCurrent ? 'text-primary' : 'text-slate-200'}`}>
                                                        {video.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 uppercase tracking-wide">
                                                        {video.type === 'quiz' ? <Award size={10} className="text-yellow-500" /> : <Play size={10} />}
                                                        <span>{video.duration_minutes} Menit</span>
                                                        {video.is_preview && <span className="px-1.5 py-0.5 bg-yellow-400/20 text-yellow-400 rounded">FREE</span>}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {activeTab === 'discussion' && (
                                <motion.div
                                    key="discussion"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="text-accent" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Tanya & Jawab</h3>
                                    <p className="text-slate-400 text-sm mb-6">Punya pertanyaan tentang materi ini? Tanyakan di sini dan mentor kami akan membantu.</p>
                                    <Button className="w-full bg-accent hover:bg-accent/90 rounded-xl">Buat Pertanyaan Baru</Button>
                                </motion.div>
                            )}

                            {activeTab === 'resources' && (
                                <motion.div
                                    key="resources"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-4 pt-12 text-center"
                                >
                                    <Lock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Akses Terbatas</h4>
                                    <p className="text-slate-500 text-xs mt-2">Fitur Catatan Personal sedang dalam pengembangan untuk Member Pro.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CoursePlayerPage;
