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
import { useAuth, API } from '../context/AppContext';
import TechStack from '../components/TechStack';
import Roadmap from '../components/Roadmap';
import { useLanguage } from '../context/LanguageContext';

import webImg from '../assets/categories/web.png';
import mobileImg from '../assets/categories/mobile.png';
import backendImg from '../assets/categories/backend.png';
import frontendImg from '../assets/categories/frontend.png';
import dataImg from '../assets/categories/data.png';
import devopsImg from '../assets/categories/devops.png';

const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";

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
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const LandingPage = () => {
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
  const { user } = useAuth();
  const { t, useAutoTranslate } = useLanguage();

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

  // Dynamic Content with Auto-Translate
  const translatedHeroTitle = useAutoTranslate(hero?.title);
  const translatedHeroDesc = useAutoTranslate(hero?.subtitle);
  const translatedCta = useAutoTranslate(hero?.cta_text);
  const translatedBio = useAutoTranslate('Fullstack & AI Engineer dengan pengalaman jasa website builder selama 5 bulan. Passionate dalam berbagi ilmu dan membantu developer pemula mencapai potensi terbaik mereka.');
  
  const mentorRef = useRef(null);
  const isMentorInView = useInView(mentorRef, { once: true, margin: "-100px" });
  const splineRef = useRef(null);
  const isSplineInView = useInView(splineRef, { once: true, margin: "200px" });

  const [typewriterText, setTypewriterText] = useState("");
  const fullBio = 'Fullstack & AI Engineer dengan pengalaman jasa website builder selama 5 bulan. Passionate dalam berbagi ilmu dan membantu developer pemula mencapai potensi terbaik mereka.';

  useEffect(() => {
    if (isMentorInView) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < translatedBio.length) {
          setTypewriterText(translatedBio.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isMentorInView, translatedBio]);

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
      if (isFirebaseConnected && firebaseCourses.length > 0) {
        setHero(firebaseHero);
        setCourses(firebaseCourses.slice(0, 6));
        setArticles(firebaseArticles.slice(0, 3));
        setCategories(firebaseCategories.length > 0 ? firebaseCategories : categories);
        setStats(firebaseStats);
        if (firebaseMentors.length > 0) setMentor(firebaseMentors[0]);
      } else {
        fetchFromAPI();
      }
    }
  }, [isFirebaseConnected, firebaseLoading, firebaseHero, firebaseCourses, firebaseArticles, firebaseCategories, firebaseStats, firebaseMentors]);

  const leadMentor = mentor || {
    name: 'Firza Ilmi',
    title: 'Lead Mentor',
    bio: fullBio,
    profileImage: MENTOR_IMAGE,
    expertise: ['Senior Fullstack Developer & Junior AI Engineer', '30+ siswa telah dilatih', 'Expert di Javascript, React, Node.js, Tailwind, Python', 'Active open source contributor']
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-background font-mono relative overflow-hidden selection:bg-primary selection:text-black animate-slide-up transition-colors duration-500"
    >
      {/* Background Decorative */}
      <div className="absolute top-0 left-0 w-full h-[150vh] bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.05)_0%,transparent_50%)] -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden flex flex-col items-center justify-center text-center">
        <motion.div variants={fadeUp} className="max-w-7xl mx-auto px-4 z-10 flex flex-col items-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-4 py-2 text-xs tracking-[5px] uppercase">MAVE::CORE_v4.2</Badge>
          
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-2xl animate-gradient-text leading-tight text-foreground">
            {hero.title}
          </h1>

          <p className="max-w-2xl text-muted-foreground text-sm md:text-lg mb-10 leading-relaxed font-bold">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to={user ? "/courses" : "/register"}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,255,0.5)' }}
                className="px-8 py-5 bg-[#00FFFF] text-black font-black italic tracking-widest uppercase text-lg skew-x-[-10deg] flex items-center gap-4 group"
              >
                {t('accessAcademy')} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/courses">
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(var(--foreground), 0.05)' }}
                className="px-8 py-5 border border-border text-foreground font-black italic tracking-widest uppercase text-lg skew-x-[-10deg]"
              >
                {t('viewDatalogs')}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Clean */}
      <section className="py-12 border-y border-border bg-card/50 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: t('activeNodes'), value: stats.courses },
            { label: t('syncedUsers'), value: stats.students },
            { label: t('assetArticles'), value: stats.articles },
            { label: t('systemMentors'), value: stats.mentors },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <div className="text-4xl font-black text-[#39FF14] mb-1">{stat.value}+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[3px]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D Robot Content */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black italic text-foreground uppercase mb-4">{t('neuralAssistant').split(' ')[0]} <span className="text-primary">{t('neuralAssistant').split(' ').slice(1).join(' ')}</span></h2>
            <p className="text-muted-foreground text-xs tracking-widest uppercase opacity-70">{t('interactAI')}</p>
          </motion.div>

          <div ref={splineRef} className="relative mx-auto w-full max-w-4xl h-[500px] md:h-[600px] overflow-hidden rounded-[3rem] bg-gradient-to-b from-primary/10 to-transparent border border-border transition-colors">
            {isSplineInView && (
              <Suspense fallback={<div className="flex items-center justify-center h-full text-primary animate-pulse uppercase tracking-[10px]">{t('loadingAI')}</div>}>
                <Spline scene="https://prod.spline.design/gqqo80UMNmudDvXK/scene.splinecode" />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      {/* Tech Stack - Integrated below Robot */}
      <TechStack />

      {/* Mentor Section */}
      <section className="py-32 relative overflow-hidden" ref={mentorRef}>
        <div className="max-w-7xl mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={fadeUp} className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
              <img 
                src={leadMentor.profileImage} 
                alt="Lead" 
                className="relative rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-1000 border-2 border-border shadow-2xl" 
              />
              <div className="absolute top-8 left-8 bg-[#00FFFF] text-black px-4 py-2 skew-x-[-10deg] font-black text-xs uppercase tracking-widest shadow-xl">{t('chiefOperator')}</div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-start gap-8">
              <div>
                <Badge className="bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 mb-4 px-3 py-1 text-[10px] tracking-[4px] uppercase">MENTOR::LOG_01</Badge>
                <h2 className="text-5xl md:text-7xl font-black italic text-foreground uppercase mb-6 leading-none">
                  {leadMentor.name}
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl font-bold leading-relaxed max-w-xl">
                  {typewriterText}<span className="inline-block w-2 h-6 bg-accent animate-pulse ml-1" />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {leadMentor.expertise.map((exp, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-1 h-12 bg-[#39FF14]/30 group-hover:bg-[#39FF14] transition-colors" />
                    <span className="text-white/40 text-xs italic font-bold uppercase tracking-wide group-hover:text-white transition-colors">{exp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <Roadmap />

      {/* Premium CTA Section */}
      <section className="py-32 relative text-center overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent -z-10" />
        <motion.div variants={fadeUp} className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-7xl font-black italic text-white uppercase mb-8">{t('initiateAscension')} <span className="text-[#39FF14]">{t('ascension')}</span></h2>
          <p className="text-white/40 text-lg md:text-xl mb-12 font-bold leading-relaxed lowercase tracking-tight">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <button className="px-12 py-6 bg-[#39FF14] text-black font-black italic tracking-[5px] uppercase text-xl transition-all hover:scale-105 hover:shadow-[0_0_40px_#39FF14aa]">
              {t('joinSyndicate')}
            </button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
