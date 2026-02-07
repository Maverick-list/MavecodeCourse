import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, Users, BookOpen, Award, Sparkles,
  Code, Globe, Smartphone, Server, BarChart3, Cloud,
  Terminal, Shield, Cpu
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import CourseCard from '../components/CourseCard';
import ArticleCard from '../components/ArticleCard';
import { useFirebaseData } from '../context/FirebaseContext';
import { API } from '../context/AppContext';
import webImg from '../assets/categories/web.png';
import mobileImg from '../assets/categories/mobile.png';
import backendImg from '../assets/categories/backend.png';
import frontendImg from '../assets/categories/frontend.png';
import dataImg from '../assets/categories/data.png';
import devopsImg from '../assets/categories/devops.png';

const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";
const HERO_BG = "https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?crop=entropy&cs=srgb&fm=jpg&q=85";

const categoryImages = {
  web: webImg,
  mobile: mobileImg,
  backend: backendImg,
  frontend: frontendImg,
  data: dataImg,
  devops: devopsImg,
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const LandingPage = () => {
  // Firebase real-time data
  const {
    hero: firebaseHero,
    courses: firebaseCourses,
    articles: firebaseArticles,
    categories: firebaseCategories,
    mentors: firebaseMentors,
    stats: firebaseStats,
    isFirebaseConnected,
    loading: firebaseLoading
  } = useFirebaseData();

  // Local state (fallback to API)
  const [stats, setStats] = useState({ courses: 50, students: 1000, articles: 10, mentors: 5 });
  const [courses, setCourses] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hero, setHero] = useState({
    title: 'Mulai Karir Codingmu Sekarang',
    subtitle: 'Belajar coding dari nol hingga mahir bersama mentor berpengalaman. Dapatkan skill yang dibutuhkan industri teknologi.',
    cta_text: 'Mulai Belajar Coding'
  });
  const [mentor, setMentor] = useState(null);

  // Scroll Reveal & Typewriter refs
  const mentorRef = useRef(null);
  const isMentorInView = useInView(mentorRef, { once: true, margin: "-100px" });
  const [typewriterText, setTypewriterText] = useState("");
  const fullBio = 'Fullstack & AI Engineer dengan pengalaman jasa website builder selama 5 bulan. Passionate dalam berbagi ilmu dan membantu developer pemula mencapai potensi terbaik mereka.';

  // Typewriter effect
  useEffect(() => {
    if (isMentorInView) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < fullBio.length) {
          setTypewriterText((prev) => prev + fullBio.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30); // Speed of typing
      return () => clearInterval(timer);
    }
  }, [isMentorInView]);

  // Use Firebase data when available, otherwise fetch from API
  useEffect(() => {
    const fetchFromAPI = async () => {
      try {
        const [statsRes, coursesRes, articlesRes, categoriesRes, heroRes] = await Promise.all([
          axios.get(`${API}/stats`).catch(() => ({ data: stats })),
          axios.get(`${API}/courses`).catch(() => ({ data: [] })),
          axios.get(`${API}/articles`).catch(() => ({ data: [] })),
          axios.get(`${API}/categories`).catch(() => ({ data: [] })),
          axios.get(`${API}/hero`).catch(() => ({ data: hero }))
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data.slice(0, 6));
        setArticles(articlesRes.data.slice(0, 3));
        setCategories(categoriesRes.data);
        setHero(heroRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (!firebaseLoading) {
      // Use Firebase data if connected AND has courses, otherwise fallback to API
      if (isFirebaseConnected && firebaseCourses.length > 0) {
        setHero(firebaseHero);
        setCourses(firebaseCourses.slice(0, 6));
        setArticles(firebaseArticles.slice(0, 3));
        setCategories(firebaseCategories.length > 0 ? firebaseCategories : categories);
        setStats(firebaseStats);
        if (firebaseMentors.length > 0) {
          setMentor(firebaseMentors[0]);
        }
      } else {
        // Fallback to backend API
        fetchFromAPI();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirebaseConnected, firebaseLoading, firebaseHero, firebaseCourses, firebaseArticles, firebaseCategories, firebaseStats, firebaseMentors]);

  // Get lead mentor data
  const leadMentor = mentor || {
    name: 'Firza Ilmi',
    title: 'Lead Mentor',
    bio: 'Fullstack & AI Engineer dengan pengalaman jasa website builder selama 5 bulan. Passionate dalam berbagi ilmu dan membantu developer pemula mencapai potensi terbaik mereka.',
    profileImage: MENTOR_IMAGE,
    expertise: ['Senior Fullstack Developer & Junior AI Engineer', '30+ siswa telah dilatih', 'Expert di Javascript, React, Node.js, Tailwind, Python', 'Active open source contributor']
  };

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden selection:bg-primary selection:text-black">
      {/* Scanlines Overlay */}
      <div className="scanlines"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-primary/50 bg-primary/10 text-primary text-sm font-mono tracking-wider uppercase backdrop-blur-sm">
                <Terminal className="w-4 h-4" />
                Coding Course Academic for Developer
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white mb-6 leading-tight tracking-wide uppercase"
              style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
            >
              {hero.title.split(' ').map((word, i) => (
                <span key={i} className={i === 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient' : ''}>{word} </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="font-mono text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed border-l-2 border-accent/50 pl-4 text-left md:text-center md:border-none md:pl-0"
            >
              {hero.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/80 text-white dark:text-black rounded-none px-8 py-6 text-lg font-heading font-bold tracking-wider uppercase border border-primary shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-300 relative overflow-hidden group"
                data-testid="hero-cta"
              >
                <Link to="/courses">
                  <span className="relative z-10 flex items-center gap-2">
                    {hero.cta_text} <ArrowRight className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none px-8 py-6 text-lg font-heading font-bold tracking-wider uppercase border border-white/20 text-white hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all duration-300"
                data-testid="hero-demo"
              >
                <Link to="/courses">
                  <Play className="mr-2 w-5 h-5" />
                  Lihat Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: "Kursus", value: `${stats.courses}+`, color: "text-primary dark:text-primary" },
              { icon: Users, label: "Siswa", value: `${stats.students}+`, color: "text-accent dark:text-accent" },
              { icon: Award, label: "Artikel", value: `${stats.articles}+`, color: "text-purple-400" },
              { icon: Sparkles, label: "Mentor", value: `${stats.mentors}+`, color: "text-pink-400" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
                <div className={`mb-4 p-3 rounded-none bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.color} group-hover:animate-pulse`} />
                </div>
                <h3 className="font-heading text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-1">{stat.value}</h3>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D AI Robot Section - Interactive with Mouse Tracking */}
      <section className="py-16 relative overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="font-mono text-primary text-sm tracking-[0.2em] uppercase mb-2">
              Mavecode AI Assistant
            </h3>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Meet Our AI Robot
            </h2>
            <p className="font-mono text-slate-600 dark:text-slate-400 mt-2">
              Gerakkan kursor untuk berinteraksi dengan robot AI kami
            </p>
          </motion.div>

          {/* Spline Container - Cropped to hide watermark */}
          <div
            className="relative mx-auto w-full max-w-2xl h-[400px] lg:h-[500px] overflow-hidden"
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-transparent">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <Cpu className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="font-mono text-sm text-muted-foreground mt-4 animate-pulse">Loading AI Robot...</p>
              </div>
            }>
              <div
                className="absolute inset-0"
                style={{
                  height: 'calc(100% + 60px)',
                  marginBottom: '-60px',
                  background: 'transparent'
                }}
              >
                <Spline
                  scene="https://prod.spline.design/gqqo80UMNmudDvXK/scene.splinecode"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent'
                  }}
                />
              </div>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-24 relative overflow-hidden" ref={mentorRef}>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Mentor Image with HUD Border - Clean, No Overlay */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative group"
            >
              <div className="relative z-10 hud-border p-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-xl dark:shadow-none border border-slate-200 dark:border-transparent">
                <div className="absolute top-4 right-4 text-[10px] font-mono text-primary/70 z-20">Target: ID_MENTOR_01</div>
                <img
                  src={leadMentor.profileImage || MENTOR_IMAGE}
                  alt={leadMentor.name}
                  className="w-full rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Decorative corner lines */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-60" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary opacity-60" />
              </div>

              {/* Background decorative square */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-dashed border-slate-300 dark:border-white/10 -z-10" />
            </motion.div>

            {/* Mentor Content */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h3 className="font-mono text-primary text-sm tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-primary"></span>
                  {leadMentor.title}
                </h3>
                <div className="glitch-wrapper mb-6">
                  <h2
                    className="font-heading text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white uppercase glitch hover-glow cursor-default"
                    data-text={leadMentor.name}
                  >
                    {leadMentor.name}
                  </h2>
                </div>

                {/* Typewriter Description */}
                <p className={`font-mono text-lg leading-relaxed transition-all duration-1000 ${isMentorInView ? 'opacity-100' : 'opacity-10'} text-slate-700 dark:text-slate-300`}>
                  <span className={`reveal-text ${isMentorInView ? 'active' : ''}`}>
                    {isMentorInView ? typewriterText : ""}
                  </span>
                  <span className="typewriter-cursor"></span>
                </p>
              </div>

              <div className={`space-y-4 font-mono transition-opacity duration-1000 delay-500 ${isMentorInView ? 'opacity-100' : 'opacity-0'}`}>
                {(leadMentor.expertise || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-2 h-2 bg-accent group-hover:scale-150 group-hover:shadow-[0_0_8px_#39FF14] transition-all duration-300" />
                    <span className="text-muted-foreground group-hover:text-accent transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  className="bg-primary hover:bg-primary/90 text-white dark:text-black font-heading font-bold uppercase tracking-wider rounded-none relative overflow-hidden group px-8"
                >
                  <Link to="/courses" className="flex items-center">
                    <span className="relative z-10">Lihat Kursus dari Mentor</span>
                    <ArrowRight className="ml-2 w-4 h-4 relative z-10" />
                  </Link>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section (Ruangguru style) */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="font-heading text-4xl font-bold mb-4 uppercase tracking-tight">Jalur Belajar Karir</h2>
              <p className="text-muted-foreground font-mono">Kurikulum terstruktur yang dirancang khusus untuk membantumu menguasai skill dari nol hingga siap kerja.</p>
            </div>
            <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/10 px-8 h-12">Lihat Semua Jalur</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Frontend Master Academy',
                desc: 'Kuasai pembuatan antarmuka modern dengan React, Next.js, dan TailwindCSS.',
                color: 'from-blue-600 to-indigo-600',
                icon: Code,
                courses: 12,
                students: '4.5k+',
                url: 'https://roadmap.sh/frontend'
              },
              {
                title: 'Backend Scalability Expert',
                desc: 'Belajar arsitektur microservices, Node.js, dan optimasi database.',
                color: 'from-emerald-600 to-teal-700',
                icon: Server,
                courses: 15,
                students: '2.8k+',
                url: 'https://roadmap.sh/backend'
              },
              {
                title: 'Data Science & AI Intelligence',
                desc: 'Gali insight dari data dan bangun model Machine Learning dengan Python.',
                color: 'from-purple-600 to-pink-600',
                icon: BarChart3,
                courses: 10,
                students: '3.1k+',
                url: 'https://roadmap.sh/ai-data-scientist'
              }
            ].map((path, i) => (
              <motion.a
                key={i}
                href={path.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative h-[380px] rounded-[2.5rem] overflow-hidden p-8 flex flex-col justify-end text-white shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} z-0 group-hover:scale-110 transition-transform duration-700`} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 z-0" />
                <div className="absolute top-8 left-8 p-4 bg-white/20 backdrop-blur-md rounded-3xl z-10">
                  <path.icon className="w-8 h-8" />
                </div>

                <div className="relative z-10">
                  <Badge className="bg-white/20 hover:bg-white/30 border-0 mb-4 px-3 py-1 text-[10px] tracking-widest uppercase font-bold">Recommended for Jobs</Badge>
                  <h3 className="text-2xl font-heading font-bold mb-3">{path.title}</h3>
                  <p className="text-white/80 text-sm mb-6 line-clamp-2 leading-relaxed">{path.desc}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter">
                      <span className="flex items-center gap-1.5"><BookOpen size={14} /> {path.courses} Kursus</span>
                      <span className="flex items-center gap-1.5"><Users size={14} /> {path.students} Siswa</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-lg">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Project Exhibition Section */}
      <section className="py-24 relative z-10 overflow-hidden bg-black/40 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-[2rem] overflow-hidden border border-primary/20 bg-background/50 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -z-10" />

            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl text-white mb-6 uppercase tracking-wider glow-primary">
                Pameran Karya Developer
              </h2>
              <p className="font-mono text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Saksikan karya-karya terbaik dari komunitas Mavecode. Temukan inspirasi, pelajari studi kasus nyata, dan dukung inovasi sesama developer.
              </p>
              <Button
                size="lg"
                onClick={() => alert("Website belum tersedia. Nantikan segera!")}
                className="bg-accent hover:bg-accent/90 text-white font-heading font-bold uppercase tracking-widest rounded-none px-12 py-8 text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:animate-spin-slow" />
                  Kunjungi Galeri Pameran
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4 uppercase tracking-wider">
              Pilih Jalur Belajarmu
            </h2>
            <p className="font-mono text-muted-foreground">
              Temukan jalur karir yang sesuai dengan minat dan tujuanmu
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const imgSrc = categoryImages[category.id];
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  className="group bg-card hover:bg-card/80 border border-white/5 hover:border-primary/50 p-6 flex flex-col items-center justify-center gap-4 text-center transition-all duration-300 cursor-pointer rounded-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="w-16 h-16 mb-2 overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition-colors p-1 border border-primary/20">
                    {imgSrc ? (
                      <img src={imgSrc} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Code className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <span className="font-heading font-semibold text-sm uppercase tracking-wide group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4 uppercase tracking-wider">
                Kursus Populer
              </h2>
              <p className="font-mono text-muted-foreground max-w-xl">
                Mulai perjalanan codingmu dengan kursus yang dirancang khusus untuk pemula hingga profesional
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex group font-mono text-primary hover:text-primary hover:bg-primary/10">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="ghost" className="w-full font-mono text-primary border border-primary/20">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 bg-white/5 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4 uppercase tracking-wider">
                Artikel Terbaru
              </h2>
              <p className="font-mono text-muted-foreground">
                Tips, tutorial, dan insight terbaru dari dunia teknologi
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex group font-mono text-primary hover:text-primary hover:bg-primary/10">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden border-t border-primary/20">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl sm:text-5xl text-white font-bold mb-6 uppercase tracking-wider glow-primary">
            Siap Memulai Perjalanan Codingmu?
          </h2>
          <p className="font-mono text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Bergabung dengan ribuan developer lainnya dan mulai belajar coding hari ini.
            Gratis untuk memulai!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-heading font-bold uppercase tracking-wider rounded-none px-10 py-6 min-w-[200px]">
              Daftar Gratis Sekarang <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="font-heading font-bold uppercase tracking-wider rounded-none px-10 py-6 min-w-[200px] border-primary/30 text-primary hover:bg-primary/10">
              Lihat Paket Premium
            </Button>
          </div>
        </div>
      </section>
    </div >
  );
};

export default LandingPage;
