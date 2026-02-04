import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Lock, Play } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const CourseCard = ({ course, index = 0 }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const isDiscounted = !course.is_free && Math.random() > 0.5;
  const discountPrice = course.price * 1.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white dark:bg-card border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
      data-testid={`course-card-${course.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
            <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 ml-1 fill-current" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.is_free ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 shadow-lg shadow-emerald-900/20">Gratis</Badge>
          ) : (
            <Badge className="bg-indigo-500 hover:bg-indigo-600 border-0 shadow-lg shadow-indigo-900/20">Premium</Badge>
          )}
          {isDiscounted && (
            <Badge className="bg-rose-500 hover:bg-rose-600 border-0 shadow-lg shadow-rose-900/20 animate-pulse">Diskon 50%</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Level */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md uppercase tracking-wide">
            {course.category}
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {course.duration_hours} Jam
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {course.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{(4 + Math.random()).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 500) + 50} ulasan)</span>
        </div>

        {/* Description (Hidden on small cards, visible if space allows, but usually title is enough) */}
        {/* <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {course.description}
        </p> */}

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            {course.is_free ? (
              <span className="text-emerald-600 font-bold text-lg">Gratis</span>
            ) : (
              <>
                {isDiscounted && <span className="text-xs text-muted-foreground line-through">{formatPrice(discountPrice)}</span>}
                <span className="text-indigo-600 font-bold text-lg">{formatPrice(course.price)}</span>
              </>
            )}
          </div>
          <Button size="sm" className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white transition-colors">
            Detail
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
};

export default CourseCard;
