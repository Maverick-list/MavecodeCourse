import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLanguage } from '../context/LanguageContext';

export const ArticleCard = memo(({ article, index = 0, variant = 'default' }) => {
  const { t, useAutoTranslate } = useLanguage();
  
  const translatedTitle = useAutoTranslate(article.title);
  const translatedCategory = useAutoTranslate(article.category);
  const translatedExcerpt = useAutoTranslate(article.excerpt);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group relative bg-card border border-border rounded-2xl overflow-hidden lg:grid lg:grid-cols-2 shadow-sm hover:shadow-xl transition-all duration-300"
        data-testid={`article-featured-${article.id}`}
      >
        <div className="aspect-video lg:aspect-auto lg:h-full overflow-hidden bg-slate-900">
          <img
            src={article.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600'}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <Badge className="w-fit mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-primary/50 uppercase tracking-widest">{translatedCategory}</Badge>
          <h2 className="font-heading font-bold text-2xl lg:text-3xl mb-4 group-hover:text-primary transition-colors leading-tight">
            {translatedTitle}
          </h2>
          <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed font-mono text-sm">{translatedExcerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase font-mono">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.views} {t('views')}</span>
              </div>
            </div>
            <Link
              to={`/articles/${article.slug}`}
              className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all"
            >
              {t('read')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Link to={`/articles/${article.slug}`} className="absolute inset-0" />
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
      data-testid={`article-card-${article.id}`}
    >
      <div className="aspect-video overflow-hidden bg-slate-900">
        <img
          src={article.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400'}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary border-primary/20">{translatedCategory}</Badge>
        </div>
        <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {translatedTitle}
        </h3>
        <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed font-mono opacity-80">{translatedExcerpt}</p>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              <span>{article.views}</span>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/articles/${article.slug}`} className="absolute inset-0 z-10" />
    </motion.article>
  );
});

export default ArticleCard;
