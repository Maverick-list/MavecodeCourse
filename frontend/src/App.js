import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, ThemeProvider, useAuth } from './context/AppContext';
import { FirebaseProvider } from './context/FirebaseContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

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
import { AdminLayout, AdminLoginPage, AdminDashboard, AdminCoursesPage } from './pages/AdminPages';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Main Layout with Navbar and Footer
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
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

        {/* Protected User Dashboard */}
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

// 404 Page
const NotFoundPage = () => (
  <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-heading font-bold text-6xl text-primary mb-4">404</h1>
      <h2 className="font-heading font-bold text-2xl mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-8">
        Maaf, halaman yang Anda cari tidak tersedia.
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
      >
        Kembali ke Beranda
      </a>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FirebaseProvider>
          <AppContent />
        </FirebaseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
