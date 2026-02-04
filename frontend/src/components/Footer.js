import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, Github, Instagram, Linkedin, Send,
  ArrowRight, Sparkles, Terminal, Heart, Star, Quote
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import Lanyard3D from './Lanyard3D';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const socialLinks = [
  { icon: Mail, href: "mailto:firzailmidja@gmail.com", label: "Email", color: "hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50" },
  { icon: Phone, href: "https://wa.me/6285191769521", label: "WhatsApp", color: "hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50" },
  { icon: Github, href: "https://github.com/Maverick-list", label: "GitHub", color: "hover:bg-gray-500/20 hover:text-gray-300 hover:border-gray-500/50" },
  { icon: Instagram, href: "https://www.instagram.com/maverick_list/", label: "Instagram", color: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/50" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/firza-ilmi-8912b936b/", label: "LinkedIn", color: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50" },
];

const footerLinks = {
  product: [
    { name: 'Kursus', href: '/courses' },
    { name: 'Live Class', href: '/live' },
    { name: 'Artikel', href: '/articles' },
    { name: 'Harga', href: '/pricing' },
  ],
  features: [
    { name: 'Club', href: '/club', badge: 'New' },
    { name: 'Block IDE', href: '/block', badge: 'New' },
    { name: 'Focus Mode', href: '/dashboard' },
    { name: 'AI Assistant', href: '/dashboard' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontak', href: '/contact' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
    { name: 'Kebijakan Privasi', href: '/privacy' },
  ],
};

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Junior Developer",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
    text: "Mavecode mengubah karir saya! Dari nol coding sampai dapat kerja dalam 6 bulan.",
    rating: 5
  },
  {
    name: "Dian Permata",
    role: "Frontend Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    text: "Materi lengkap dan mentor sangat membantu. Highly recommended!",
    rating: 5
  },
  {
    name: "Ahmad Rizki",
    role: "Fullstack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    text: "Fitur Block IDE dan Club sangat membantu untuk kolaborasi dengan teman belajar.",
    rating: 5
  }
];

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Berhasil berlangganan newsletter! 🎉');
    setEmail('');
    setIsSubscribing(false);
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-b from-background to-slate-900/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-mono mb-6"
            >
              <Star className="w-4 h-4" fill="currentColor" />
              Testimoni Siswa
            </motion.div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Bergabung dengan ribuan developer yang sudah merasakan manfaat belajar di Mavecode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-mono mb-6">
                <Mail className="w-4 h-4" />
                Newsletter
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                Dapatkan Tips Coding & Update Terbaru
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Bergabung dengan 1000+ developer yang sudah berlangganan newsletter kami. Gratis!
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Masukkan email kamu..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-primary hover:bg-primary/90 text-black font-bold h-12 px-6"
                >
                  {isSubscribing ? (
                    <span className="animate-pulse">Mendaftar...</span>
                  ) : (
                    <>
                      Subscribe <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <img src={LOGO_URL} alt="Mavecode" className="h-12 w-12 rounded-xl border border-primary/30" />
                <span className="font-heading text-3xl font-black tracking-widest">
                  <span className="text-primary">MAVE</span>
                  <span className="text-accent">CODE</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
                Platform belajar coding #1 di Indonesia. Kurikulum terstruktur, mentor berpengalaman, dan komunitas yang solid.
              </p>

              {/* Social Icons */}
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
                <motion.a
                  href="https://www.tiktok.com/@mavericklist"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:bg-black hover:text-white hover:border-white/30"
                >
                  <TikTokIcon />
                </motion.a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Produk</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Links */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Fitur</h3>
              <ul className="space-y-3">
                {footerLinks.features.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                    >
                      {link.name}
                      {link.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent/20 text-accent rounded">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Dukungan</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3D Lanyard */}
            <div className="hidden lg:block">
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider text-center">Your Card</h3>
              <div className="relative -mt-4">
                <Lanyard3D />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span>© {new Date().getFullYear()} Mavecode. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                <span>by</span>
                <a href="https://instagram.com/maverick_list" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                  Maverick
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
};

export default Footer;
