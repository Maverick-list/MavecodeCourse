import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Eye, ArrowLeft, Share2, Bookmark, Clock, X, Copy, Check,
  MessageCircle, Send, Facebook, Twitter, Mail, Link2, QrCode, BookmarkCheck
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MENTOR_IMAGE = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/0hxoi5k4_53B2736F-666E-4CE5-8AB8-72D901786EB2.JPG";

// Social share icons
const WhatsAppIcon = () => (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>);
const TelegramIcon = () => (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>);
const InstagramIcon = () => (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>);
const TikTokIcon = () => (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>);

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/articles/${slug}`);
        setArticle(res.data);
        // Check if article is saved
        const saved = JSON.parse(localStorage.getItem('mavecode_saved_articles') || '[]');
        setIsSaved(saved.includes(slug));
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const readingTime = article ? Math.ceil(article.content.split(' ').length / 200) : 0;
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = article ? `${article.title} - Baca artikel menarik ini di Mavecode!` : '';

  // Share handlers
  const shareOptions = [
    { name: 'WhatsApp', icon: WhatsAppIcon, color: 'bg-green-500', url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + articleUrl)}` },
    { name: 'Telegram', icon: TelegramIcon, color: 'bg-blue-500', url: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: 'Instagram', icon: InstagramIcon, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500', action: () => { navigator.clipboard.writeText(articleUrl); toast.success('Link disalin! Paste di DM Instagram'); } },
    { name: 'TikTok', icon: TikTokIcon, color: 'bg-black', action: () => { navigator.clipboard.writeText(articleUrl); toast.success('Link disalin! Paste di DM TikTok'); } },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}` },
    { name: 'Email', icon: Mail, color: 'bg-red-500', url: `mailto:?subject=${encodeURIComponent(article?.title || '')}&body=${encodeURIComponent(shareText + '\n\n' + articleUrl)}` },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    toast.success('Link berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('mavecode_saved_articles') || '[]');
    if (isSaved) {
      const updated = saved.filter(s => s !== slug);
      localStorage.setItem('mavecode_saved_articles', JSON.stringify(updated));
      setIsSaved(false);
      toast.info('Artikel dihapus dari bookmark');
    } else {
      saved.push(slug);
      localStorage.setItem('mavecode_saved_articles', JSON.stringify(saved));
      setIsSaved(true);
      toast.success('Artikel disimpan ke bookmark! 🔖');
    }
  };

  const handleShare = (option) => {
    if (option.url) {
      window.open(option.url, '_blank', 'width=600,height=400');
    } else if (option.action) {
      option.action();
    }
    setShowShareModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4" />
            <div className="h-12 bg-muted rounded w-3/4 mb-8" />
            <div className="h-96 bg-muted rounded-2xl mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (<div key={i} className="h-4 bg-muted rounded" />))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl mb-4">Artikel tidak ditemukan</h2>
          <Button asChild><Link to="/articles">Kembali ke Artikel</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/articles"><ArrowLeft className="w-4 h-4" />Kembali ke Artikel</Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 capitalize">{article.category}</Badge>
            {article.tags?.map(tag => (<Badge key={tag} variant="outline">{tag}</Badge>))}
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl mb-6 leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <img src={MENTOR_IMAGE} alt={article.author} className="w-10 h-10 rounded-full object-cover" />
              <div><p className="font-medium text-foreground">{article.author}</p><p className="text-sm">Author</p></div>
            </div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{formatDate(article.created_at)}</span></div>
            <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{readingTime} min read</span></div>
            <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{article.views} views</span></div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative aspect-video rounded-2xl overflow-hidden mb-8">
          <img src={article.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800'} alt={article.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-4 h-4" />Share
          </Button>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            className={`gap-2 ${isSaved ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={handleSave}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? 'Tersimpan' : 'Simpan'}
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">{article.excerpt}</p>
          <div className="whitespace-pre-wrap">{article.content}</div>
        </motion.div>

        {/* Author Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12 p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-start gap-4">
            <img src={MENTOR_IMAGE} alt={article.author} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="font-heading font-semibold text-lg mb-1">{article.author}</h3>
              <p className="text-muted-foreground text-sm mb-3">Full-Stack Developer & Educator. Passionate dalam berbagi ilmu coding dan membantu developer pemula.</p>
              <Button asChild size="sm" variant="outline"><Link to="/courses">Lihat Kursus</Link></Button>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">Bagikan Artikel</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}><X className="h-5 w-5" /></Button>
              </div>

              {/* Share Options Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(option)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white`}>
                      <option.icon />
                    </div>
                    <span className="text-xs text-muted-foreground">{option.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Copy Link */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Atau salin link:</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm truncate">{articleUrl}</div>
                  <Button onClick={handleCopyLink} variant="default" size="sm">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* QR Code hint */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                <QrCode className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Scan QR Code</p>
                  <p className="text-xs text-muted-foreground">Screenshot halaman ini untuk berbagi via QR</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleDetailPage;

