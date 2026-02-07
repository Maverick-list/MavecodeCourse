import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Video, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth, API } from '../context/AppContext';
import { useFirebaseData } from '../context/FirebaseContext';

const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";

export const LiveClassPage = () => {
  const { user, token } = useAuth();

  // Firebase real-time data
  const {
    liveSessions: firebaseSessions,
    mentors: firebaseMentors,
    isFirebaseConnected,
    loading: firebaseLoading
  } = useFirebaseData();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConnected) {
      // Transform Firebase sessions to match expected format
      const transformedSessions = firebaseSessions.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        scheduled_at: session.scheduledAt instanceof Date
          ? session.scheduledAt.toISOString()
          : session.scheduledAt?.seconds
            ? new Date(session.scheduledAt.seconds * 1000).toISOString()
            : session.scheduledAt,
        duration_minutes: session.durationMinutes || 60,
        max_participants: session.maxParticipants || 100,
        participants_count: session.participantsCount || 0,
        meeting_url: session.meetingUrl,
        instructor: firebaseMentors.find(m => m.id === session.mentorId)?.name || 'Firza Ilmi',
        status: session.status
      }));
      setClasses(transformedSessions);
      setLoading(false);
    } else if (!firebaseLoading) {
      // Fallback to API
      const fetchClasses = async () => {
        try {
          const res = await axios.get(`${API}/live-classes`);
          setClasses(res.data);
        } catch (err) {
          console.error('Error fetching live classes:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchClasses();
    }
  }, [isFirebaseConnected, firebaseLoading, firebaseSessions, firebaseMentors]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const joinClass = async (classItem) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // If we have a meeting URL from Firebase, open it directly
    if (classItem.meeting_url) {
      window.open(classItem.meeting_url, '_blank');
      return;
    }

    // Otherwise try API
    try {
      const res = await axios.post(`${API}/live-classes/${classItem.id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.meeting_url) {
        window.open(res.data.meeting_url, '_blank');
      }
    } catch (err) {
      console.error('Error joining class:', err);
    }
  };

  const upcomingClasses = classes.filter(c => {
    const scheduledDate = new Date(c.scheduled_at);
    return scheduledDate > new Date() && (c.status === 'scheduled' || c.status === 'live');
  });

  const pastClasses = classes.filter(c => {
    const scheduledDate = new Date(c.scheduled_at);
    return scheduledDate <= new Date() || c.status === 'completed';
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Live Class</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Belajar langsung bersama mentor secara real-time. Tanya jawab dan diskusi interaktif.
          </p>
        </motion.div>

        {/* Upcoming Classes */}
        <section className="mb-16">
          <h2 className="font-heading font-bold text-2xl mb-6">Jadwal Mendatang</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : upcomingClasses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingClasses.map((liveClass, i) => (
                <motion.div
                  key={liveClass.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
                  data-testid={`live-class-${liveClass.id}`}
                >
                  <div className="p-6">
                    {/* Status Badge */}
                    <Badge className="mb-4 bg-green-500/20 text-green-500">
                      Akan Datang
                    </Badge>

                    {/* Title */}
                    <h3 className="font-heading font-semibold text-xl mb-3">
                      {liveClass.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {liveClass.description}
                    </p>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(liveClass.scheduled_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(liveClass.scheduled_at)} WIB</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Video className="w-4 h-4" />
                        <span>{liveClass.duration_minutes} menit</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{liveClass.participants_count}/{liveClass.max_participants}</span>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <img
                          src={MENTOR_IMAGE}
                          alt={liveClass.instructor}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{liveClass.instructor}</p>
                          <p className="text-xs text-muted-foreground">Instructor</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => joinClass(liveClass)}
                        className="bg-primary hover:bg-primary/90 rounded-full"
                        data-testid={`join-class-${liveClass.id}`}
                      >
                        {liveClass.status === 'live' ? 'Gabung Sekarang' : 'Daftar'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-2xl">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada jadwal live class mendatang</p>
            </div>
          )}
        </section>

        {/* Past Classes (Recordings) */}
        {pastClasses.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl mb-6">Rekaman Sebelumnya</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pastClasses.map((liveClass, i) => (
                <motion.div
                  key={liveClass.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors"
                >
                  <Badge variant="secondary" className="mb-3">Rekaman</Badge>
                  <h3 className="font-medium mb-2">{liveClass.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {formatDate(liveClass.scheduled_at)}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Tonton Rekaman
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl"
        >
          <h3 className="font-heading font-bold text-2xl mb-4">
            Ingin akses ke semua live class?
          </h3>
          <p className="text-muted-foreground mb-6">
            Upgrade ke Pro untuk mendapatkan akses unlimited ke semua live class dan rekaman
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-8">
            <Link to="/pricing">
              Lihat Paket Pro
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveClassPage;
