import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
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

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const categoryFilter = searchParams.get('category') || '';
  const levelFilter = searchParams.get('level') || '';
  const priceFilter = searchParams.get('price') || '';

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [categoryFilter]);

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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Kursus</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Pilih dari berbagai kursus berkualitas untuk meningkatkan skill codingmu
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari kursus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="course-search"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter || "all"} onValueChange={(v) => updateFilter('category', v === "all" ? "" : v)}>
              <SelectTrigger className="w-full lg:w-48" data-testid="filter-category">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={levelFilter || "all"} onValueChange={(v) => updateFilter('level', v === "all" ? "" : v)}>
              <SelectTrigger className="w-full lg:w-40" data-testid="filter-level">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                <SelectItem value="beginner">Pemula</SelectItem>
                <SelectItem value="intermediate">Menengah</SelectItem>
                <SelectItem value="advanced">Lanjutan</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter || "all"} onValueChange={(v) => updateFilter('price', v === "all" ? "" : v)}>
              <SelectTrigger className="w-full lg:w-40" data-testid="filter-price">
                <SelectValue placeholder="Harga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Harga</SelectItem>
                <SelectItem value="free">Gratis</SelectItem>
                <SelectItem value="paid">Berbayar</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} className="gap-2" data-testid="clear-filters">
                <X className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {categoryFilter && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find(c => c.id === categoryFilter)?.name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
                </Badge>
              )}
              {levelFilter && (
                <Badge variant="secondary" className="gap-1">
                  {levelFilter === 'beginner' ? 'Pemula' : levelFilter === 'intermediate' ? 'Menengah' : 'Lanjutan'}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('level', '')} />
                </Badge>
              )}
              {priceFilter && (
                <Badge variant="secondary" className="gap-1">
                  {priceFilter === 'free' ? 'Gratis' : 'Berbayar'}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('price', '')} />
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Results */}
        <div className="mb-6 text-muted-foreground">
          Menampilkan {filteredCourses.length} kursus
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">Tidak ada kursus ditemukan</h3>
            <p className="text-muted-foreground mb-4">Coba ubah filter atau kata kunci pencarian</p>
            <Button onClick={clearFilters}>Reset Filter</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
