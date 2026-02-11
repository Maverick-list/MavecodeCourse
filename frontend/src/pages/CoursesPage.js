import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Sparkles, Code, Globe, Smartphone, Server, Database, Cloud } from 'lucide-react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import CourseCard from '../components/CourseCard';
import { useFirebaseData } from '../context/FirebaseContext';
import { API } from '../context/AppContext';


const CATEGORY_ICONS = {
  web: Globe,
  mobile: Smartphone,
  backend: Server,
  frontend: Code,
  data: Database,
  devops: Cloud,
  default: Sparkles
};

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Firebase real-time data
  const {
    courses: firebaseCourses,
    categories: firebaseCategories,
    isFirebaseConnected,
    loading: firebaseLoading
  } = useFirebaseData();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const categoryFilter = searchParams.get('category') || '';
  const levelFilter = searchParams.get('level') || '';
  const priceFilter = searchParams.get('price') || '';

  useEffect(() => {
    const fetchFromAPI = async () => {
      setLoading(true);
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          axios.get(`${API}/courses`, { params: { category: categoryFilter || undefined } }),
          axios.get(`${API}/categories`)
        ]);
        setCourses(coursesRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!firebaseLoading) {
      if (isFirebaseConnected && firebaseCourses.length > 0) {
        setCourses(firebaseCourses);
        setCategories(prev => firebaseCategories.length > 0 ? firebaseCategories : prev);
        setLoading(false);
      } else {
        fetchFromAPI();
      }
    }
  }, [isFirebaseConnected, firebaseLoading, firebaseCourses, firebaseCategories, categoryFilter]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !search ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = !levelFilter || course.level === levelFilter;
    const matchesPrice = !priceFilter ||
      (priceFilter === 'free' && course.is_free) ||
      (priceFilter === 'paid' && !course.is_free);
    return matchesSearch && matchesLevel && matchesPrice;
  });

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  const hasFilters = categoryFilter || levelFilter || priceFilter || search;

  return (
    <div className="min-h-screen bg-background">
      {/* Colorful Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-b-[3rem] shadow-xl mb-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        {/* Animated Background Icons */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-20 text-white/10">
          <Code size={120} />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 left-10 text-white/10">
          <Database size={100} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-4xl lg:text-6xl mb-6 shadow-text"
          >
            Jelajahi Dunia Coding
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium"
          >
            Temukan ribuan materi belajar interaktif dan mentor terbaik untuk karir impianmu.
          </motion.p>

          {/* Main Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-lg p-2 pr-2">
              <Search className="ml-4 w-6 h-6 text-indigo-500" />
              <Input
                placeholder="Mau belajar apa hari ini? (Contoh: React, Python, Data Science)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 text-slate-800 placeholder:text-slate-400 h-12 text-lg"
                data-testid="course-search"
              />
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 h-12 font-bold transition-all hover:scale-105">
                Cari
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category Pills */}
        <div className="mb-10 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 min-w-max px-2">
            <Button
              variant={!categoryFilter ? "default" : "outline"}
              onClick={() => updateFilter('category', '')}
              className={`rounded-full h-12 px-6 gap-2 ${!categoryFilter ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-slate-200 hover:border-indigo-500 text-slate-600'}`}
            >
              <Sparkles className="w-5 h-5" />
              Semua Topik
            </Button>
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] || CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS.default;
              const isActive = categoryFilter === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => updateFilter('category', cat.id)}
                  className={`rounded-full h-12 px-6 gap-2 transition-all ${isActive
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    : 'border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-600 bg-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
          <span className="text-sm font-semibold text-muted-foreground mr-2 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter:
          </span>
          <Select value={levelFilter || "all"} onValueChange={(v) => updateFilter('level', v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-900">
              <SelectValue placeholder="Semua Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Level</SelectItem>
              <SelectItem value="beginner">Pemula</SelectItem>
              <SelectItem value="intermediate">Menengah</SelectItem>
              <SelectItem value="advanced">Lanjutan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceFilter || "all"} onValueChange={(v) => updateFilter('price', v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white dark:bg-slate-900">
              <SelectValue placeholder="Semua Harga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Harga</SelectItem>
              <SelectItem value="free">Gratis</SelectItem>
              <SelectItem value="paid">Berbayar</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50">
              <X className="w-4 h-4 mr-2" /> Reset Filter
            </Button>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
            Daftar Kursus
          </h2>
          <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0">
            {filteredCourses.length} Kursus Tersedia
          </Badge>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-3xl h-[340px] animate-pulse shadow-sm" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-3 text-slate-900 dark:text-white">Ups, Kursus Tidak Ditemukan</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Kami tidak dapat menemukan kursus yang cocok dengan pencarianmu. Coba gunakan kata kunci lain atau reset filter.
            </p>
            <Button onClick={clearFilters} size="lg" className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8">
              Lihat Semua Kursus
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
