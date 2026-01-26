import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

export const ArticleCard = ({ article, index = 0, variant = 'default' }) => {
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
        className="group relative bg-card border border-border rounded-2xl overflow-hidden lg:grid lg:grid-cols-2"
        data-testid={`article-featured-${article.id}`}
      >
        <div className="aspect-video lg:aspect-auto lg:h-full overflow-hidden">
          <img
            src={article.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <Badge className="w-fit mb-4 bg-primary/20 text-primary hover:bg-primary/30">{article.category}</Badge>
          <h2 className="font-heading font-bold text-2xl lg:text-3xl mb-4 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-muted-foreground mb-6 line-clamp-3">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views}</span>
              </div>
            </div>
            <Link 
              to={`/articles/${article.slug}`}
              className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Baca <ArrowRight className="w-4 h-4" />
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
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
      data-testid={`article-card-${article.id}`}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={article.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">{article.category}</Badge>
          {article.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views}</span>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/articles/${article.slug}`} className="absolute inset-0" />
    </motion.article>
  );
};

export default ArticleCard;
