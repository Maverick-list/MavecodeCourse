import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, BookOpen, User, LogOut, LayoutDashboard, Star, Globe, ChevronDown, Check, Layout, Video, FileText, Users, Box, Tag, HelpCircle, Sparkles } from 'lucide-react';
import { useAuth, useTheme } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const navLinks = [
  { name: 'Kursus', href: '/courses', icon: Layout },
  { name: 'Live Class', href: '/live', icon: Video },
  { name: 'Artikel', href: '/articles', icon: FileText },
  { name: 'Club', href: '/club', isNew: true, icon: Users },
  { name: 'Block', href: '/block', isNew: true, icon: Box },
  { name: 'Harga', href: '/pricing', icon: Tag },
  { name: 'Translate', href: '/translate', icon: Globe },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'MaveMentor', href: '/mentor', icon: Sparkles, isNew: true },
];

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full group">
          <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border backdrop-blur-xl">
        <div className="px-2 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-1">
          {t('selectLanguage')}
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${currentLanguage === lang.code ? 'bg-primary/10 text-primary' : ''}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-xs font-semibold">{lang.name}</span>
              {currentLanguage === lang.code && <Check className="ml-auto w-4 h-4" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src={LOGO_URL} alt="Mavecode" className="h-10 w-10 rounded-xl transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse -z-10 group-hover:scale-125 transition-transform" />
              </div>
              <span className="font-heading text-2xl font-black tracking-widest flex items-center">
                <span className="text-primary">MAVE</span>
                <span style={{ color: '#f97316' }}>CODE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${location.pathname === link.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                >
                  {t(link.name)}
                  {link.isNew && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-black uppercase leading-none">{t('new')}</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 pr-3 border-r border-border">
              <LanguageSelector />
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-full">
                {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
              </Button>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/10">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-bold">{user.displayName || t('myProfile')}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-sm font-bold truncate">{user.displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer py-2.5">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer py-2.5">
                    <User className="w-4 h-4 mr-2" /> {t('myProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-courses')} className="cursor-pointer py-2.5">
                    <BookOpen className="w-4 h-4 mr-2" /> {t('myCourses')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                    <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" asChild className="font-bold">
                  <Link to="/login">{t('login')}</Link>
                </Button>
                <Button className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl px-6" asChild>
                  <Link to="/register">{t('registerFree')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="flex items-center justify-between px-2 mb-6">
                 <div className="flex items-center gap-3">
                   <LanguageSelector />
                   <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10 rounded-xl bg-white/5">
                     {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
                   </Button>
                 </div>
                 {!user && (
                   <Button className="font-black" size="sm" asChild>
                     <Link to="/register">{t('registerFree')}</Link>
                   </Button>
                 )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${location.pathname === link.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'}`}
                  >
                    <div className={`p-2 rounded-lg ${location.pathname === link.href ? 'bg-primary/20 text-primary' : 'bg-muted border border-border'}`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">{t(link.name)}</span>
                    {link.isNew && <span className="ml-auto text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">{t('new')}</span>}
                  </Link>
                ))}
              </div>

              {user && (
                <div className="pt-6 border-t border-border mt-6">
                  <div className="flex items-center gap-4 px-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link to="/dashboard"><LayoutDashboard className="w-4 h-4 mr-2" /> {t('dashboard')}</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link to="/profile"><User className="w-4 h-4 mr-2" /> {t('myProfile')}</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl col-span-2" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>
                      <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
