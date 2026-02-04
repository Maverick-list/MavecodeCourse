import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, Play, Award, TrendingUp, Calendar,
  ChevronRight, Timer
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AppContext';
import PomodoroTimer from '../components/PomodoroTimer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const DashboardPage = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ courses_enrolled: 0, hours_learned: 0, certificates: 0 });
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get(`${API}/courses`);
        setCourses(coursesRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10"
        >
          <div>
            <h1 className="font-heading font-bold text-3xl lg:text-5xl mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Halo, {user?.name || 'User'}! <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                className="inline-block origin-bottom-right"
              >👋</motion.span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Siap untuk upgrade skill coding hari ini? 🚀
            </p>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowPomodoro(true)}
              className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              data-testid="pomodoro-btn"
            >
              <Timer className="w-4 h-4" />
              Focus Mode
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105">
              <Link to="/courses">
                Jelajahi Kursus
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Kursus Diikuti', value: stats.courses_enrolled || courses.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Jam Belajar', value: stats.hours_learned || 12, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Sertifikat', value: stats.certificates || 2, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide uppercase">{stat.label}</p>
                  <p className="font-heading font-bold text-4xl">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Learning */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl flex items-center gap-2">
              <Play className="w-5 h-5 text-primary fill-primary" />
              Lanjutkan Belajar
            </h2>
            <Link to="/dashboard/courses" className="text-muted-foreground text-sm hover:text-white transition-colors">
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-48 bg-muted/20 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.slice(0, 2).map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex gap-5 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200'}
                      alt={course.title}
                      className="w-28 h-28 rounded-2xl object-cover shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <Badge variant="secondary" className="mb-2 text-xs w-fit bg-primary/10 text-primary border-primary/20">{course.category}</Badge>
                    <h3 className="font-bold text-lg mb-2 truncate group-hover:text-primary transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{course.duration_hours}j</span>
                      </div>
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <span>{Math.floor(Math.random() * 60) + 20}% Selesai</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}`} className="absolute inset-0" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-card/50 to-transparent border border-white/5 rounded-3xl backdrop-blur-md">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Belum ada kursus aktif</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Mulai perjalanan codingmu sekarang dengan memilih kursus pertamamu.</p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Link to="/courses">Jelajahi Katalog</Link>
              </Button>
            </div>
          )}
        </motion.section>

        {/* Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Rekomendasi Untukmu
            </h2>
            <Link to="/courses" className="text-muted-foreground text-sm hover:text-white transition-colors">
              Lihat Semua
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-card/30 backdrop-blur-lg border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-primary/10"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {course.is_free && (
                    <Badge className="absolute top-3 left-3 bg-emerald-500/90 hover:bg-emerald-500 z-20 backdrop-blur-md border-0">Gratis</Badge>
                  )}
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{course.duration_hours}j</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Badge variant="outline" className="text-[10px] h-5 border-white/10 text-muted-foreground">
                      {course.category}
                    </Badge>
                  </div>
                </div>
                <Link to={`/courses/${course.id}`} className="absolute inset-0" />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Pomodoro Modal */}
      {showPomodoro && <PomodoroTimer onClose={() => setShowPomodoro(false)} />}
    </div>
  );
};

export default DashboardPage;
