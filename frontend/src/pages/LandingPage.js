import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Play, Users, BookOpen, Award, Sparkles,
  Code, Globe, Smartphone, Server, BarChart3, Cloud
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import CourseCard from '../components/CourseCard';
import ArticleCard from '../components/ArticleCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";
const HERO_BG = "https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?crop=entropy&cs=srgb&fm=jpg&q=85";

const categoryIcons = {
  web: Globe,
  mobile: Smartphone,
  backend: Server,
  frontend: Code,
  data: BarChart3,
  devops: Cloud,
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
  const [stats, setStats] = useState({ courses: 50, students: 1000, articles: 100, mentors: 5 });
  const [courses, setCourses] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hero, setHero] = useState({
    title: 'Mulai Karir Codingmu Sekarang',
    subtitle: 'Belajar coding dari nol hingga mahir bersama mentor berpengalaman. Dapatkan skill yang dibutuhkan industri teknologi.',
    cta_text: 'Mulai Belajar Coding'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes, articlesRes, categoriesRes, heroRes] = await Promise.all([
          axios.get(`${API}/stats`),
          axios.get(`${API}/courses`),
          axios.get(`${API}/articles`),
          axios.get(`${API}/categories`),
          axios.get(`${API}/hero`)
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
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${hero.background_image || HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95" />
          <div className="hero-glow absolute inset-0" />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl"
        />

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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Platform Belajar Coding #1 Indonesia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeUp}
              className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            >
              {hero.title.split(' ').map((word, i) => (
                <span key={i} className={i === 2 ? 'text-primary' : ''}>{word} </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeUp}
              className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
            >
              {hero.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg glow-primary"
                data-testid="hero-cta"
              >
                <Link to="/courses">
                  {hero.cta_text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10"
                data-testid="hero-demo"
              >
                <Link to="/courses">
                  <Play className="mr-2 w-5 h-5" />
                  Lihat Demo
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10"
            >
              {[
                { value: `${stats.courses}+`, label: 'Kursus', icon: BookOpen },
                { value: `${stats.students}+`, label: 'Siswa', icon: Users },
                { value: `${stats.articles}+`, label: 'Artikel', icon: Award },
                { value: `${stats.mentors}+`, label: 'Mentor', icon: Sparkles },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-heading font-bold text-3xl text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Mentor Section */}
      <section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mentor Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <motion.div
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="relative z-10 rounded-3xl overflow-hidden"
                >
                  <img 
                    src={MENTOR_IMAGE} 
                    alt="Firza Ilmi - Mentor"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary/20 rounded-3xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/30 rounded-full blur-2xl" />
              </div>
            </motion.div>

            {/* Mentor Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Lead Mentor</span>
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white mt-2 mb-6">
                Firza Ilmi
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Full-Stack Developer dengan pengalaman lebih dari 5 tahun di industri teknologi. 
                Passionate dalam berbagi ilmu dan membantu developer pemula mencapai potensi terbaik mereka.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Senior Software Engineer',
                  '500+ siswa telah dilatih',
                  'Expert di React, Node.js, Python',
                  'Active open source contributor'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-primary hover:bg-primary/90 rounded-full">
                <Link to="/courses">
                  Lihat Kursus dari Mentor
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-4">Pilih Jalur Belajarmu</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan jalur karir yang sesuai dengan minat dan tujuanmu
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat.id] || Code;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/courses?category=${cat.id}`}
                    className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all text-center group"
                    data-testid={`category-${cat.id}`}
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">{cat.name}</h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-4">Kursus Populer</h2>
              <p className="text-muted-foreground max-w-2xl">
                Mulai perjalanan codingmu dengan kursus yang dirancang khusus untuk pemula hingga profesional
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/courses">
                Lihat Semua
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-4">Artikel Terbaru</h2>
              <p className="text-muted-foreground max-w-2xl">
                Tips, tutorial, dan insight terbaru dari dunia teknologi
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/articles">
                Lihat Semua
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-3xl lg:text-5xl mb-6">
              Siap Memulai Perjalanan Codingmu?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Bergabung dengan ribuan developer lainnya dan mulai belajar coding hari ini. 
              Gratis untuk memulai!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 glow-primary"
              >
                <Link to="/register">
                  Daftar Gratis Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="rounded-full px-8"
              >
                <Link to="/pricing">
                  Lihat Paket Premium
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
