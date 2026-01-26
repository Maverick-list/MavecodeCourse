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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl mb-2">
              Halo, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Siap untuk belajar hari ini?
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={() => setShowPomodoro(true)}
              className="gap-2"
              data-testid="pomodoro-btn"
            >
              <Timer className="w-4 h-4" />
              Study Mode
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/courses">
                Jelajahi Kursus
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Kursus Diikuti', value: stats.courses_enrolled || courses.length, icon: BookOpen, color: 'text-primary' },
            { label: 'Jam Belajar', value: stats.hours_learned || 12, icon: Clock, color: 'text-green-500' },
            { label: 'Sertifikat', value: stats.certificates || 2, icon: Award, color: 'text-yellow-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="font-heading font-bold text-3xl">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
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
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl">Lanjutkan Belajar</h2>
            <Link to="/dashboard/courses" className="text-primary text-sm hover:underline">
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />
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
                  className="bg-card border border-border rounded-2xl p-5 flex gap-5 hover:border-primary/50 transition-colors"
                >
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200'}
                    alt={course.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mb-2 text-xs">{course.category}</Badge>
                    <h3 className="font-medium mb-2 truncate">{course.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_hours}j</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{Math.floor(Math.random() * 60) + 20}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 60) + 20} className="h-1.5" />
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}`} className="absolute inset-0" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-2xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Belum ada kursus yang diikuti</p>
              <Button asChild>
                <Link to="/courses">Jelajahi Kursus</Link>
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
            <h2 className="font-heading font-bold text-xl">Rekomendasi Untukmu</h2>
            <Link to="/courses" className="text-primary text-sm hover:underline">
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
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {course.is_free && (
                    <Badge className="absolute top-2 left-2 bg-green-500">Gratis</Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration_hours}j</span>
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
