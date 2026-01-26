import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, Clock, Users, Star, Lock, CheckCircle, 
  ChevronDown, ChevronUp, BookOpen, Award
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../context/AppContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

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
        
        if (token) {
          try {
            const progressRes = await axios.get(`${API}/progress/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(progressRes.data);
          } catch (err) {}
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const completedVideos = progress.filter(p => p.completed).length;
  const overallProgress = videos.length > 0 ? (completedVideos / videos.length) * 100 : 0;

  const canAccess = course?.is_free || user?.is_premium;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4" />
            <div className="h-12 bg-muted rounded w-3/4 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-muted rounded-2xl" />
              <div className="h-96 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl mb-4">Kursus tidak ditemukan</h2>
          <Button asChild>
            <Link to="/courses">Kembali ke Kursus</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <Link to="/courses" className="hover:text-primary">Kursus</Link>
                <span>/</span>
                <span className="text-white">{course.category}</span>
              </div>

              {/* Title */}
              <h1 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-4">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-lg mb-6">{course.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className={course.is_free ? 'bg-green-500' : 'bg-accent'}>
                  {course.is_free ? 'Gratis' : 'Premium'}
                </Badge>
                <Badge variant="secondary">
                  {course.level === 'beginner' ? 'Pemula' : course.level === 'intermediate' ? 'Menengah' : 'Lanjutan'}
                </Badge>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration_hours} jam</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 500) + 100} siswa</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{(4 + Math.random()).toFixed(1)}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <img 
                  src={MENTOR_IMAGE} 
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-slate-400">Instruktur</p>
                  <p className="font-medium text-white">{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                {course.is_free ? (
                  <span className="text-3xl font-bold text-green-500">Gratis</span>
                ) : (
                  <span className="text-3xl font-bold text-primary">{formatPrice(course.price)}</span>
                )}
              </div>

              {/* Progress (if enrolled) */}
              {user && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              )}

              {/* CTA */}
              {canAccess ? (
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 rounded-full py-6"
                  data-testid="start-course-btn"
                >
                  {overallProgress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 rounded-full py-6"
                    data-testid="buy-course-btn"
                  >
                    Beli Kursus Ini
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    atau <Link to="/pricing" className="text-primary hover:underline">berlangganan Pro</Link> untuk akses semua kursus
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                {[
                  { icon: BookOpen, text: `${videos.length} video materi` },
                  { icon: Clock, text: 'Akses selamanya' },
                  { icon: Award, text: 'Sertifikat kelulusan' },
                  { icon: Users, text: 'Forum diskusi' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-heading font-bold text-2xl mb-6">Kurikulum</h2>
              
              {videos.length > 0 ? (
                <div className="space-y-3">
                  {videos.map((video, i) => {
                    const isCompleted = progress.find(p => p.video_id === video.id)?.completed;
                    const isLocked = !video.is_preview && !canAccess;
                    
                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                          isLocked 
                            ? 'bg-muted/50 border-border' 
                            : 'bg-card border-border hover:border-primary/50 cursor-pointer'
                        }`}
                        data-testid={`video-${video.id}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? 'bg-green-500/20 text-green-500' : 
                          isLocked ? 'bg-muted text-muted-foreground' : 
                          'bg-primary/20 text-primary'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${isLocked ? 'text-muted-foreground' : ''}`}>
                            {video.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{video.duration_minutes} menit</p>
                        </div>
                        {video.is_preview && !user && (
                          <Badge variant="outline" className="text-xs">Preview</Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-2xl">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Materi akan segera tersedia</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
