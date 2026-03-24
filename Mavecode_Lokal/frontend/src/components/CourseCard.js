import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Play } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

export const CourseCard = memo(({ course, index = 0 }) => {
  const { t, useAutoTranslate } = useLanguage();
  
  const translatedTitle = useAutoTranslate(course.title);
  const translatedCategory = useAutoTranslate(course.category);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const isDiscounted = !course.is_free && (course.price > 100000); // More realistic discount logic
  const discountPrice = course.price * 1.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative bg-white dark:bg-card border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full"
      data-testid={`course-card-${course.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 ml-1 fill-current" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.is_free ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 shadow-lg shadow-emerald-900/20">{t('free')}</Badge>
          ) : (
            <Badge className="bg-primary hover:bg-primary/80 border-0 shadow-lg shadow-primary/20">Premium</Badge>
          )}
          {isDiscounted && (
            <Badge className="bg-rose-500 hover:bg-rose-600 border-0 shadow-lg shadow-rose-900/20 animate-pulse">Hot</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Level */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wide">
            {translatedCategory}
          </span>
          <span className="text-muted-foreground flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" /> {course.duration_hours} {t('hours')}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {translatedTitle}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{(4 + (course.id.length % 10) / 10).toFixed(1)}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            {course.is_free ? (
              <span className="text-emerald-600 font-bold text-lg">{t('free')}</span>
            ) : (
              <>
                {isDiscounted && <span className="text-xs text-muted-foreground line-through font-mono uppercase opacity-50">{formatPrice(discountPrice)}</span>}
                <span className="text-primary font-bold text-lg font-mono">{formatPrice(course.price)}</span>
              </>
            )}
          </div>
          <Button size="sm" className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-black transition-colors font-bold uppercase text-[10px] tracking-widest">
            {t('detail')}
          </Button>
        </div>
      </div>

      {/* Link Overlay */}
      <Link
        to={`/courses/${course.id}`}
        className="absolute inset-0 z-10"
        data-testid={`course-link-${course.id}`}
      />
    </motion.div>
  );
});

export default CourseCard;
