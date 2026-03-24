import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AppContext';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('loginSuccess'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    console.log('Google Login Success - credential received:', credentialResponse.credential ? 'YES' : 'NO');
    if (!credentialResponse.credential) {
      toast.error(t('googleLoginFailed') + ': ' + 'Tidak ada credential diterima');
      return;
    }
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      toast.success(t('googleLoginSuccess'));
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Login Error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Terjadi kesalahan';
      toast.error(`${t('loginFailed')}: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Mavecode" className="h-12 w-12 rounded-xl" />
              <span className="font-heading text-3xl relative" style={{ fontWeight: 900 }}>
                <span className="absolute inset-0 blur-md opacity-50 animate-pulse"><span style={{ color: '#1e3a5f' }}>MAVE</span><span style={{ color: '#f97316' }}>CODE</span></span>
                <span className="relative"><span style={{ color: '#1e3a5f' }}>MAVE</span><span style={{ color: '#f97316' }}>CODE</span></span>
              </span>
            </Link>
            <div className="text-xs text-green-500 font-mono mb-2 animate-pulse text-center">Build: v2.8-PRODUCTION-FIX</div>
            <h1 className="font-heading font-bold text-2xl mb-2">{t('welcome')}</h1>
            <p className="text-muted-foreground">{t('loginToContinue')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pl-10"
                  required
                  data-testid="login-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                {t('forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 rounded-full py-6"
              data-testid="login-submit"
            >
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t('or')}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                console.error('GoogleLogin component error');
                toast.error(t('googleLoginFailed'));
              }}
              useOneTap
              theme="filled_blue"
              shape="pill"
              size="large"
              width="384"
            />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              {t('registerFreeLink')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name, phone || null);
      toast.success(t('registerSuccess'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || t('registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Mavecode" className="h-12 w-12 rounded-xl" />
              <span className="font-heading text-3xl relative" style={{ fontWeight: 900 }}>
                <span className="absolute inset-0 blur-md opacity-50 animate-pulse"><span style={{ color: '#1e3a5f' }}>MAVE</span><span style={{ color: '#f97316' }}>CODE</span></span>
                <span className="relative"><span style={{ color: '#1e3a5f' }}>MAVE</span><span style={{ color: '#f97316' }}>CODE</span></span>
              </span>
            </Link>
            <h1 className="font-heading font-bold text-2xl mb-2">{t('createAccount')}</h1>
            <p className="text-muted-foreground">{t('startCodingJourney')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('fullName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10"
                  required
                  data-testid="register-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pl-10"
                  required
                  data-testid="register-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="pl-10"
                  data-testid="register-phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('minChars')}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 rounded-full py-6"
              data-testid="register-submit"
            >
              {loading ? t('registering') : t('registerNow')}
            </Button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            {t('agreeTerms')}{' '}
            <Link to="/terms" className="text-primary hover:underline">{t('termsLink')}</Link>
            {' '}{t('and')}{' '}
            <Link to="/privacy" className="text-primary hover:underline">{t('privacyLink')}</Link>
          </p>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('haveAccount')}{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t('loginLink')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
