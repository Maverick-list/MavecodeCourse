import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Share2, Bookmark, Clock } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/articles/${slug}`);
        setArticle(res.data);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const readingTime = article ? Math.ceil(article.content.split(' ').length / 200) : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4" />
            <div className="h-12 bg-muted rounded w-3/4 mb-8" />
            <div className="h-96 bg-muted rounded-2xl mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl mb-4">Artikel tidak ditemukan</h2>
          <Button asChild>
            <Link to="/articles">Kembali ke Artikel</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/articles">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Artikel
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 capitalize">
              {article.category}
            </Badge>
            {article.tags?.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-heading font-bold text-3xl lg:text-5xl mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <img 
                src={MENTOR_IMAGE}
                alt={article.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-foreground">{article.author}</p>
                <p className="text-sm">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views} views</span>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-8"
        >
          <img 
            src={article.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8 pb-8 border-b border-border"
        >
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="w-4 h-4" />
            Simpan
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {article.excerpt}
          </p>
          <div className="whitespace-pre-wrap">
            {article.content}
          </div>
        </motion.div>

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-card border border-border rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <img 
              src={MENTOR_IMAGE}
              alt={article.author}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-heading font-semibold text-lg mb-1">{article.author}</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Full-Stack Developer & Educator. Passionate dalam berbagi ilmu coding dan membantu developer pemula.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to="/courses">Lihat Kursus</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
