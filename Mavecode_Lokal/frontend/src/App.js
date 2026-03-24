import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, ThemeProvider, useAuth } from './context/AppContext';
import { FirebaseProvider } from './context/FirebaseContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { FocusModeProvider } from './context/FocusModeContext';
import FocusModeWidget from './components/FocusModeWidget';
import CyberpunkLoader from './components/CyberpunkLoader';
import SurveyOverlay from './components/SurveyOverlay';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import LiveClassPage from './pages/LiveClassPage';
import ContactPage from './pages/ContactPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import DashboardPage from './pages/DashboardPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import ClubPage from './pages/ClubPage';
import BlockPage from './pages/BlockPage';
import { AdminLayout, AdminLoginPage, AdminDashboard, AdminCoursesPage, AdminArticlesPage, AdminLiveClassPage, AdminFAQPage, AdminCertificatesPage, AdminSettingsPage } from './pages/AdminPages';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import CertificatePage from './pages/CertificatePage';
import TranslationPage from './pages/TranslationPage';
import MentorDashboard from './pages/MentorDashboard';

import MentorAppPage from './pages/MentorAppPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Main Layout with Navbar and Footer
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Enhanced page transition with slide-up animation
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      y: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }}
    className="h-full"
  >
    {children}
  </motion.div>
);

const MainLayout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageWrapper key={location.pathname}>
            {children}
          </PageWrapper>
        </AnimatePresence>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

// App Content with Routes
const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/courses" element={<MainLayout><CoursesPage /></MainLayout>} />
        <Route path="/courses/:id" element={<MainLayout><CourseDetailPage /></MainLayout>} />
        <Route path="/articles" element={<MainLayout><ArticlesPage /></MainLayout>} />
        <Route path="/articles/:slug" element={<MainLayout><ArticleDetailPage /></MainLayout>} />
        <Route path="/pricing" element={<MainLayout><PricingPage /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><FAQPage /></MainLayout>} />
        <Route path="/translate" element={<MainLayout><TranslationPage /></MainLayout>} />
        <Route path="/live" element={<MainLayout><LiveClassPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/mentor" element={<MainLayout><MentorDashboard /></MainLayout>} />
        
        {/* Distraction-Free Desktop IDE Layout for MaveMentor */}
        <Route path="/mentor-app" element={<MentorAppPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/courses" element={
          <ProtectedRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/courses/:id/learn" element={
          <ProtectedRoute>
            <CoursePlayerPage />
          </ProtectedRoute>
        } />
        <Route path="/club" element={
          <ProtectedRoute>
            <MainLayout><ClubPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/block" element={
          <ProtectedRoute>
            <MainLayout><BlockPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><ProfilePage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/certificates/:courseId" element={
          <ProtectedRoute>
            <CertificatePage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="live" element={<AdminLiveClassPage />} />
          <Route path="faq" element={<AdminFAQPage />} />
          <Route path="certificates" element={<AdminCertificatesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Static Pages */}
        <Route path="/terms" element={<MainLayout><StaticPage title="Syarat & Ketentuan" /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><StaticPage title="Kebijakan Privasi" /></MainLayout>} />

        {/* 404 */}
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
      <Toaster position="top-center" richColors />
      <FocusModeWidget />
    </BrowserRouter>
  );
};

// Static Page Component
const StaticPage = ({ title }) => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-heading font-bold text-4xl mb-8">{title}</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Halaman ini sedang dalam pengembangan. Silakan hubungi kami jika Anda memiliki pertanyaan.
        </p>
      </div>
    </div>
  </div>
);


// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Ups, terjadi kesalahan sistem</h1>
            <p className="text-muted-foreground mb-6">
              Aplikasi mengalami masalah teknis. Kami telah mencatat error ini dan akan segera memperbaikinya.
            </p>
            <div className="bg-muted p-4 rounded-xl mb-6 text-left overflow-auto max-h-40">
              <code className="text-xs text-red-500">{this.state.error?.toString()}</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground rounded-full py-3 font-bold hover:bg-primary/90 transition-all font-heading"
            >
              REFRESH HALAMAN
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component with Loading + Survey Flow
function App() {
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Phase: 'loading' -> 'survey' -> 'app'
  const [appPhase, setAppPhase] = useState('loading');

  // Check if user has already completed the survey (per session)
  useEffect(() => {
    const surveyCompleted = sessionStorage.getItem('mavecode_session_loaded');
    if (surveyCompleted) {
      setAppPhase('app');
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    // Check if survey was ever completed (localStorage persists)
    const surveyDone = localStorage.getItem('mavecode_survey_completed');
    if (surveyDone) {
      // Skip survey, go directly to app
      sessionStorage.setItem('mavecode_session_loaded', 'true');
      setAppPhase('app');
    } else {
      setAppPhase('survey');
    }
  }, []);

  const handleSurveyComplete = useCallback((data) => {
    sessionStorage.setItem('mavecode_session_loaded', 'true');
    setAppPhase('app');
  }, []);

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ThemeProvider>
          <LanguageProvider>
          <AuthProvider>
            <FirebaseProvider>
              <FocusModeProvider>
                <AnimatePresence mode="wait">
                  {appPhase === 'loading' && (
                    <CyberpunkLoader
                      key="loader"
                      onComplete={handleLoadingComplete}
                    />
                  )}
                  {appPhase === 'survey' && (
                    <SurveyOverlay
                      key="survey"
                      onComplete={handleSurveyComplete}
                    />
                  )}
                  {appPhase === 'app' && (
                    <motion.div
                      key="app"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <AppContent />
                    </motion.div>
                  )}
                </AnimatePresence>
              </FocusModeProvider>
            </FirebaseProvider>
          </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
