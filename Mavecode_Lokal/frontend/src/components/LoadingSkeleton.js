import React from 'react';
import { motion } from 'framer-motion';

// Base Skeleton Component
export const Skeleton = ({ className = '', ...props }) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-muted/50 via-muted to-muted/50 bg-[length:200%_100%] rounded ${className}`}
        {...props}
    />
);

// Course Card Skeleton
export const CourseCardSkeleton = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
            </div>
        </div>
    </div>
);

// Article Card Skeleton
export const ArticleCardSkeleton = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2 pt-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    </div>
);

// Dashboard Stats Skeleton
export const StatsSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
    <div className="flex items-center gap-4 p-4 border-b border-border">
        {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
        ))}
    </div>
);

// Chat Message Skeleton
export const ChatMessageSkeleton = () => (
    <div className="flex gap-3 p-4">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    </div>
);

// Video Player Skeleton
export const VideoPlayerSkeleton = () => (
    <div className="relative aspect-video w-full bg-slate-900 rounded-xl overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
            >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
            </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
            <Skeleton className="h-1 w-full rounded-full mb-2" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-2 w-32" />
            </div>
        </div>
    </div>
);

// Sidebar Menu Skeleton
export const SidebarSkeleton = () => (
    <div className="space-y-2 p-4">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 flex-1" />
            </div>
        ))}
    </div>
);

// Full Page Loading
export const PageLoadingSkeleton = () => (
    <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Grid of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <CourseCardSkeleton key={i} />
                ))}
            </div>
        </div>
    </div>
);

// Animated Loading Dots
export const LoadingDots = () => (
    <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
        ))}
    </div>
);

// Spinner Loading
export const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

// Terminal Loading
export const TerminalLoading = ({ text = 'Loading...' }) => (
    <div className="bg-slate-900 border border-primary/30 rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2">
            <span className="text-primary">❯</span>
            <span className="text-muted-foreground">{text}</span>
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-primary"
            >
                _
            </motion.span>
        </div>
    </div>
);

export default {
    Skeleton,
    CourseCardSkeleton,
    ArticleCardSkeleton,
    StatsSkeleton,
    TableRowSkeleton,
    ChatMessageSkeleton,
    VideoPlayerSkeleton,
    SidebarSkeleton,
    PageLoadingSkeleton,
    LoadingDots,
    Spinner,
    TerminalLoading,
};
