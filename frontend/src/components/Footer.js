import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, Github, Instagram, Linkedin } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const socialLinks = [
  { icon: Mail, href: "mailto:firzailmidja@gmail.com", label: "Email", color: "hover:bg-red-500/20 hover:text-red-400" },
  { icon: Phone, href: "https://wa.me/6285191769521", label: "WhatsApp", color: "hover:bg-green-500/20 hover:text-green-400" },
  { icon: Github, href: "https://github.com/Maverick-list", label: "GitHub", color: "hover:bg-gray-500/20 hover:text-gray-300" },
  { icon: Instagram, href: "https://www.instagram.com/maverick_list/", label: "Instagram", color: "hover:bg-pink-500/20 hover:text-pink-400" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/firza-ilmi-8912b936b/", label: "LinkedIn", color: "hover:bg-blue-500/20 hover:text-blue-400" },
];

const footerLinks = {
  product: [
    { name: 'Kursus', href: '/courses' },
    { name: 'Live Class', href: '/live' },
    { name: 'Artikel', href: '/articles' },
    { name: 'Berlangganan', href: '/pricing' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontak', href: '/contact' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
    { name: 'Kebijakan Privasi', href: '/privacy' },
  ],
};

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-slate-900/50 dark:bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Mavecode" className="h-10 w-10 rounded-lg" />
              <span className="font-heading text-3xl font-black tracking-widest relative glitch-wrapper">
                <span className="relative z-10" data-text="MAVECODE">
                  <span className="text-[#00FFFF] neon-blue">MAVE</span>
                  <span className="text-[#39FF14] neon-green">CODE</span>
                </span>
                <span className="absolute inset-0 blur-lg opacity-50 animate-pulse-glow">
                  <span className="text-[#00FFFF]">MAVE</span>
                  <span className="text-[#39FF14]">CODE</span>
                </span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Platform belajar coding terbaik di Indonesia. Dari pemula hingga profesional.
            </p>

            {/* Lanyard Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-sky-500/20 to-orange-500/20 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <img src={LOGO_URL} alt="Badge" className="h-12 w-12 rounded-xl border-2 border-white/20" />
                <div>
                  <p className="text-xs text-muted-foreground">Platform by</p>
                  <p className="font-heading font-semibold text-white">Firza Ilmi</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Produk</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
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

          {/* Support Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Dukungan</h3>
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

          {/* Contact & Social */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Hubungi Kami</h3>
            <div className="space-y-3 mb-6">
              <a href="mailto:firzailmidja@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Mail className="w-4 h-4" />
                firzailmidja@gmail.com
              </a>
              <a href="https://wa.me/6285191769521" className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                +62 851 9176 9521
              </a>
            </div>

            {/* Circular Social Icons */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground transition-all ${social.color}`}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
              <motion.a
                href="https://www.tiktok.com/@mavericklist"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground transition-all hover:bg-black hover:text-white"
                data-testid="social-tiktok"
              >
                <TikTokIcon />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mavecode. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
