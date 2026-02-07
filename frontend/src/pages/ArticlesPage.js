import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Tag } from 'lucide-react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import ArticleCard from '../components/ArticleCard';
import { useFirebaseData } from '../context/FirebaseContext';
import { API } from '../context/AppContext';


export const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Firebase real-time data
  const {
    articles: firebaseArticles,
    isFirebaseConnected,
    loading: firebaseLoading
  } = useFirebaseData();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const categoryFilter = searchParams.get('category') || '';

  const categories = ['tips', 'teknologi', 'karir', 'tutorial'];

  useEffect(() => {
    if (isFirebaseConnected) {
      // Use Firebase real-time data
      setArticles(firebaseArticles);
      setLoading(false);
    } else if (!firebaseLoading) {
      // Fallback to API
      const fetchArticles = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API}/articles`, {
            params: { category: categoryFilter || undefined }
          });
          setArticles(res.data);
        } catch (err) {
          console.error('Error fetching articles:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    }
  }, [isFirebaseConnected, firebaseLoading, firebaseArticles, categoryFilter]);

  const filteredArticles = articles.filter(article => {
    return !search ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(search.toLowerCase());
  });

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Artikel</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Tips, tutorial, dan insight terbaru dari dunia teknologi dan pengembangan software
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="article-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!categoryFilter ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSearchParams({})}
            >
              Semua
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setSearchParams({ category: cat })}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Featured Article */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <ArticleCard article={featuredArticle} variant="featured" />
          </motion.div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : otherArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah kata kunci pencarian</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ArticlesPage;
