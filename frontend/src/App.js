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
import { AdminLayout, AdminLoginPage, AdminDashboard, AdminCoursesPage } from './pages/AdminPages';
import NotFoundPage from './pages/NotFoundPage';

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

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="articles" element={<AdminDashboard />} />
          <Route path="live" element={<AdminDashboard />} />
          <Route path="faq" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminDashboard />} />
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


// Main App Component
function App() {
  const CLIENT_ID = "762388730678-5jvefesa8u27mqo9nhnmmq3ujq5h88re.apps.googleusercontent.com";

  return (
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
  );
}

export default App;
