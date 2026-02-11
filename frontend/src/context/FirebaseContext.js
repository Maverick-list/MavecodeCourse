import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const FirebaseContext = createContext(null);

export const useFirebaseData = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebaseData must be used within FirebaseProvider');
    }
    return context;
};

// Collection names - must match Website_Editor
const COLLECTIONS = {
    HERO: 'hero_content',
    COURSES: 'courses',
    ARTICLES: 'articles',
    MENTORS: 'mentors',
    LIVE_SESSIONS: 'live_sessions',
    CATEGORIES: 'categories',
    FAQS: 'faqs',
    STATS: 'stats'
};

// Default hero content
const DEFAULT_HERO = {
    title: 'Mulai Karir Codingmu Sekarang',
    subtitle: 'Belajar coding dari nol hingga mahir bersama mentor berpengalaman. Dapatkan skill yang dibutuhkan industri teknologi.',
    cta_text: 'Mulai Belajar Coding',
    badge_text: 'Coding Course Academic for Developer',
    background_image: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?crop=entropy&cs=srgb&fm=jpg&q=85'
};

// Default categories
const DEFAULT_CATEGORIES = [
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'backend', name: 'Backend' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'data', name: 'Data Science' },
    { id: 'devops', name: 'DevOps' }
];

export const FirebaseProvider = ({ children }) => {
    // Real-time data states
    const [hero, setHero] = useState(DEFAULT_HERO);
    const [courses, setCourses] = useState([]);
    const [articles, setArticles] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [faqs, setFaqs] = useState([]);
    const [stats, setStats] = useState({ courses: 50, students: 1000, articles: 100, mentors: 5 });

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

    useEffect(() => {
        const unsubscribers = [];
        let mounted = true;

        const setupListeners = async () => {
            if (!db) {
                console.warn('Firebase DB is not initialized. Using default data.');
                setLoading(false);
                return;
            }

            try {
                // Hero Content listener (single document)
                const heroRef = doc(db, COLLECTIONS.HERO, 'main');
                const unsubHero = onSnapshot(heroRef, (docSnap) => {
                    if (mounted) {
                        if (docSnap.exists()) {
                            setHero({ ...DEFAULT_HERO, ...docSnap.data() });
                            setIsFirebaseConnected(true);
                        }
                    }
                }, (err) => {
                    console.warn('Hero listener error (using defaults):', err.message);
                });
                unsubscribers.push(unsubHero);

                // Courses listener - only published
                const coursesCollection = collection(db, COLLECTIONS.COURSES);
                const coursesQuery = query(
                    coursesCollection,
                    where('status', '==', 'published'),
                    orderBy('createdAt', 'desc')
                );
                const unsubCourses = onSnapshot(coursesQuery, (snapshot) => {
                    if (mounted) {
                        const data = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            // Convert Firestore timestamps
                            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
                        }));
                        setCourses(data);
                        setIsFirebaseConnected(true);
                    }
                }, (err) => {
                    console.warn('Courses listener error:', err.message);
                    // Try without the where clause for development
                    try {
                        const fallbackQuery = query(coursesCollection, orderBy('createdAt', 'desc'));
                        onSnapshot(fallbackQuery, (snapshot) => {
                            if (mounted) {
                                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                                setCourses(data);
                            }
                        });
                    } catch (fallbackErr) {
                        console.error('Fallback courses listener failed:', fallbackErr);
                    }
                });
                unsubscribers.push(unsubCourses);

                // Articles listener - only published
                const articlesCollection = collection(db, COLLECTIONS.ARTICLES);
                const articlesQuery = query(
                    articlesCollection,
                    where('status', '==', 'published'),
                    orderBy('createdAt', 'desc')
                );
                const unsubArticles = onSnapshot(articlesQuery, (snapshot) => {
                    if (mounted) {
                        const data = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
                        }));
                        setArticles(data);
                    }
                }, (err) => {
                    console.warn('Articles listener error:', err.message);
                    // Fallback without filter
                    try {
                        const fallbackQuery = query(articlesCollection, orderBy('createdAt', 'desc'));
                        onSnapshot(fallbackQuery, (snapshot) => {
                            if (mounted) {
                                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                                setArticles(data);
                            }
                        });
                    } catch (fallbackErr) {
                        console.error('Fallback articles listener failed:', fallbackErr);
                    }
                });
                unsubscribers.push(unsubArticles);

                // Mentors listener - active only
                const mentorsQuery = query(
                    collection(db, COLLECTIONS.MENTORS),
                    where('isActive', '==', true)
                );
                const unsubMentors = onSnapshot(mentorsQuery, (snapshot) => {
                    if (mounted) {
                        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setMentors(data);
                    }
                }, (err) => {
                    console.warn('Mentors listener error:', err.message);
                    // Fallback
                    try {
                        onSnapshot(collection(db, COLLECTIONS.MENTORS), (snapshot) => {
                            if (mounted) {
                                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                                setMentors(data);
                            }
                        });
                    } catch (fallbackErr) {
                        console.error('Fallback mentors listener failed:', fallbackErr);
                    }
                });
                unsubscribers.push(unsubMentors);

                // Live Sessions listener - upcoming/active
                const sessionsQuery = query(
                    collection(db, COLLECTIONS.LIVE_SESSIONS),
                    orderBy('scheduledAt', 'asc')
                );
                const unsubSessions = onSnapshot(sessionsQuery, (snapshot) => {
                    if (mounted) {
                        const data = snapshot.docs
                            .map(doc => ({
                                id: doc.id,
                                ...doc.data(),
                                scheduledAt: doc.data().scheduledAt?.toDate?.() || doc.data().scheduledAt
                            }))
                            .filter(session =>
                                session.status === 'scheduled' ||
                                session.status === 'live'
                            );
                        setLiveSessions(data);
                    }
                }, (err) => {
                    console.warn('Live sessions listener error:', err.message);
                });
                unsubscribers.push(unsubSessions);

                // Categories listener
                const unsubCategories = onSnapshot(collection(db, COLLECTIONS.CATEGORIES), (snapshot) => {
                    if (mounted && snapshot.docs.length > 0) {
                        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setCategories(data);
                    }
                }, (err) => {
                    console.warn('Categories listener error (using defaults):', err.message);
                });
                unsubscribers.push(unsubCategories);

                // FAQs listener
                const faqsQuery = query(collection(db, COLLECTIONS.FAQS), orderBy('order', 'asc'));
                const unsubFaqs = onSnapshot(faqsQuery, (snapshot) => {
                    if (mounted) {
                        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setFaqs(data);
                    }
                }, (err) => {
                    console.warn('FAQs listener error:', err.message);
                });
                unsubscribers.push(unsubFaqs);

                if (mounted) {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error setting up Firebase listeners:', err);
                if (mounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };


        setupListeners();

        return () => {
            mounted = false;
            unsubscribers.forEach(unsub => {
                try {
                    unsub();
                } catch (e) {
                    // Ignore cleanup errors
                }
            });
        };
    }, []);

    // Update stats when data changes
    useEffect(() => {
        setStats({
            courses: courses.length > 0 ? courses.length : 50,
            students: 1000, // This would come from a users collection or analytics
            articles: articles.length > 0 ? articles.length : 100,
            mentors: mentors.length > 0 ? mentors.length : 5
        });
    }, [courses.length, articles.length, mentors.length]);

    // Helper functions for data access
    const getCourseById = (id) => courses.find(c => c.id === id);
    const getArticleBySlug = (slug) => articles.find(a => a.slug === slug);
    const getArticleById = (id) => articles.find(a => a.id === id);
    const getMentorById = (id) => mentors.find(m => m.id === id);
    const getCoursesByCategory = (categoryId) => courses.filter(c => c.category === categoryId);
    const getUpcomingSessions = () => liveSessions.filter(s => s.status === 'scheduled');
    const getActiveSessions = () => liveSessions.filter(s => s.status === 'live');

    return (
        <FirebaseContext.Provider value={{
            // Connection status
            loading,
            error,
            isFirebaseConnected,

            // Hero content
            hero,

            // Collections
            courses,
            articles,
            mentors,
            liveSessions,
            categories,
            faqs,
            stats,

            // Helper functions
            getCourseById,
            getArticleBySlug,
            getArticleById,
            getMentorById,
            getCoursesByCategory,
            getUpcomingSessions,
            getActiveSessions
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseProvider;
