import React from 'react';
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

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
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
        <PageWrapper key={location.pathname}>
          {children}
        </PageWrapper>
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
        <Route path="/live" element={<MainLayout><LiveClassPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

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

// Main App Component
function App() {
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <FirebaseProvider>
              <FocusModeProvider>
                <AppContent />
              </FocusModeProvider>
            </FirebaseProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;

