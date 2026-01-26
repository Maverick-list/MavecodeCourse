import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Lock, Play } from 'lucide-react';
import { Badge } from './ui/badge';

export const CourseCard = ({ course, index = 0 }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
      data-testid={`course-card-${course.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-3">
          {course.is_free ? (
            <Badge className="bg-green-500 hover:bg-green-600">Gratis</Badge>
          ) : (
            <Badge className="bg-accent hover:bg-accent/90">Premium</Badge>
          )}
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {course.level === 'beginner' ? 'Pemula' : course.level === 'intermediate' ? 'Menengah' : 'Lanjutan'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">
          {course.category}
        </p>

        {/* Title */}
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration_hours}j</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 500) + 100}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span>{(4 + Math.random()).toFixed(1)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <img
              src="https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG"
              alt={course.instructor}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{course.instructor}</span>
          </div>
          <div className="text-right">
            {course.is_free ? (
              <span className="text-green-500 font-semibold">Gratis</span>
            ) : (
              <span className="text-primary font-semibold">{formatPrice(course.price)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Link Overlay */}
      <Link 
        to={`/courses/${course.id}`} 
        className="absolute inset-0"
        data-testid={`course-link-${course.id}`}
      />
    </motion.div>
  );
};

export default CourseCard;
