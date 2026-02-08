import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FileText, Video, Users,
  Settings, LogOut, Plus, Pencil, Trash2, Eye, Menu, X, Sun, Moon
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { useAuth, useTheme, API } from '../context/AppContext';
import { toast } from 'sonner';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Kursus', href: '/admin/courses', icon: BookOpen },
  { name: 'Artikel', href: '/admin/articles', icon: FileText },
  { name: 'Live Class', href: '/admin/live', icon: Video },
  { name: 'FAQ', href: '/admin/faq', icon: Users },
  { name: 'Sertifikat', href: '/admin/certificates', icon: Award },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const { logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Mavecode" className="h-8 w-8 rounded-lg" />
          <span className="font-heading font-bold">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} title={isDark ? 'Mode Siang' : 'Mode Malam'}>
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-3 mb-8">
            <img src={LOGO_URL} alt="Mavecode" className="h-10 w-10 rounded-xl" />
            <div>
              <span className="font-heading text-xl relative block" style={{ fontWeight: 900 }}>
                <span className="absolute inset-0 blur-md opacity-50 animate-pulse"><span style={{ color: '#1e3a5f' }}>MAVE</span><span style={{ color: '#f97316' }}>CODE</span></span>
                <span className="relative"><span style={{ color: '#1e3a5f' }}>MAVE</span><span style={{ color: '#f97316' }}>CODE</span></span>
              </span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === link.href
                  ? 'bg-primary text-white'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground w-full transition-colors mb-2"
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5 text-amber-500" />
                Mode Siang
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-slate-600" />
                Mode Malam
              </>
            )}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <Eye className="w-5 h-5" />
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(username, password);
      toast.success('Login berhasil!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Mavecode" className="h-16 w-16 rounded-2xl mx-auto mb-4" />
            <h1 className="font-heading font-bold text-2xl mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Masuk untuk mengelola platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                data-testid="admin-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                data-testid="admin-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 rounded-full py-6"
              data-testid="admin-submit"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="text-primary hover:underline">
              Kembali ke Website
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ courses: 0, articles: 0, users: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/stats`);
        setStats(res.data);
      } catch (err) { }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-heading font-bold text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Kursus', value: stats.courses, color: 'bg-primary/20 text-primary' },
          { label: 'Total Artikel', value: stats.articles, color: 'bg-green-500/20 text-green-500' },
          { label: 'Total Siswa', value: stats.students, color: 'bg-yellow-500/20 text-yellow-500' },
          { label: 'Sertifikat', value: stats.certificates, color: 'bg-accent/20 text-accent' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-6">
            <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
            <p className="font-heading font-bold text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link to="/admin/courses">
                <BookOpen className="w-6 h-6 mb-2" />
                <span>Kelola Kursus</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link to="/admin/articles">
                <FileText className="w-6 h-6 mb-2" />
                <span>Kelola Artikel</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link to="/admin/live">
                <Video className="w-6 h-6 mb-2" />
                <span>Live Class</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link to="/admin/certificates">
                <Award className="w-6 h-6 mb-2" />
                <span>Sertifikat</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link to="/admin/settings">
                <Settings className="w-6 h-6 mb-2" />
                <span>Pengaturan</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">📦 Template Data</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Isi website dengan konten template profesional. Data ini akan menggantikan konten yang ada.
          </p>
          <div className="text-sm text-muted-foreground mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span><strong>6 Kursus:</strong> JavaScript, React.js, Python, Node.js, HTML/CSS, Flutter</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-500" />
              <span><strong>5 Artikel:</strong> AI, Prompt Engineering, Tips Coding, Trend 2025, Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-500" />
              <span><strong>5 FAQ:</strong> Pemula, Premium, Sertifikat, Akses, Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-500" />
              <span><strong>2 Live Class:</strong> React Todo App, Q&A Karir Developer</span>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Masukkan Template Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Masukkan Template Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ini akan mengganti semua kursus, artikel, FAQ, dan live class yang ada dengan data template baru. Aksi ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await axios.post(`${API}/seed`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      toast.success('Template data berhasil dimasukkan! Refresh halaman untuk melihat perubahan.');
                      window.location.reload();
                    } catch (err) {
                      toast.error('Gagal memasukkan template data');
                    }
                  }}
                  className="bg-primary"
                >
                  Ya, Masukkan Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export const AdminCoursesPage = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', thumbnail: '', price: 0,
    is_free: true, category: 'web', level: 'beginner',
    duration_hours: 0, instructor: 'Firza Ilmi'
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data);
    } catch (err) { }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`${API}/courses/${editingCourse.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kursus berhasil diupdate!');
      } else {
        await axios.post(`${API}/courses`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kursus berhasil dibuat!');
      }
      setIsDialogOpen(false);
      setEditingCourse(null);
      setFormData({ title: '', description: '', thumbnail: '', price: 0, is_free: true, category: 'web', level: 'beginner', duration_hours: 0, instructor: 'Firza Ilmi' });
      fetchCourses();
    } catch (err) {
      toast.error('Gagal menyimpan kursus');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kursus berhasil dihapus!');
      fetchCourses();
    } catch (err) {
      toast.error('Gagal menghapus kursus');
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail || '',
      price: course.price,
      is_free: course.is_free,
      category: course.category,
      level: course.level,
      duration_hours: course.duration_hours,
      instructor: course.instructor
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-3xl">Kelola Kursus</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingCourse(null); setFormData({ title: '', description: '', thumbnail: '', price: 0, is_free: true, category: 'web', level: 'beginner', duration_hours: 0, instructor: 'Firza Ilmi' }); }}>
              <Plus className="w-4 h-4" />
              Tambah Kursus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Kursus' : 'Tambah Kursus Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="mobile">Mobile Development</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Pemula</SelectItem>
                      <SelectItem value="intermediate">Menengah</SelectItem>
                      <SelectItem value="advanced">Lanjutan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durasi (jam)</Label>
                  <Input type="number" value={formData.duration_hours} onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Harga (Rp)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} disabled={formData.is_free} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_free} onCheckedChange={(v) => setFormData({ ...formData, is_free: v })} />
                <Label>Gratis</Label>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://..." />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">{editingCourse ? 'Update' : 'Simpan'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <img src={course.thumbnail || 'https://via.placeholder.com/80'} alt="" className="w-20 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{course.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant={course.is_free ? 'default' : 'secondary'} className={course.is_free ? 'bg-green-500' : ''}>
                    {course.is_free ? 'Gratis' : `Rp${course.price.toLocaleString()}`}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(course)}><Pencil className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Kursus?</AlertDialogTitle>
                      <AlertDialogDescription>Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(course.id)} className="bg-destructive">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada kursus</p>
        </div>
      )}
    </div>
  );
};

// Admin Articles Page
export const AdminArticlesPage = () => {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '', content: '', excerpt: '', thumbnail: '',
    category: 'programming', tags: [], author: 'Firza Ilmi'
  });
  const [tagInput, setTagInput] = useState('');

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API}/articles`);
      setArticles(res.data);
    } catch (err) { }
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await axios.put(`${API}/articles/${editingArticle.slug}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Artikel berhasil diupdate!');
      } else {
        await axios.post(`${API}/articles`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Artikel berhasil dibuat!');
      }
      setIsDialogOpen(false);
      setEditingArticle(null);
      setFormData({ title: '', content: '', excerpt: '', thumbnail: '', category: 'programming', tags: [], author: 'Firza Ilmi' });
      fetchArticles();
    } catch (err) {
      toast.error('Gagal menyimpan artikel');
    }
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API}/articles/${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Artikel berhasil dihapus!');
      fetchArticles();
    } catch (err) {
      toast.error('Gagal menghapus artikel');
    }
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      thumbnail: article.thumbnail || '',
      category: article.category,
      tags: article.tags || [],
      author: article.author
    });
    setIsDialogOpen(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-3xl">Kelola Artikel</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingArticle(null); setFormData({ title: '', content: '', excerpt: '', thumbnail: '', category: 'programming', tags: [], author: 'Firza Ilmi' }); }}>
              <Plus className="w-4 h-4" />
              Tambah Artikel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Excerpt (Ringkasan)</Label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Konten</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="career">Karir</SelectItem>
                      <SelectItem value="tips">Tips & Tricks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Ketik tag lalu Enter" />
                  <Button type="button" variant="outline" onClick={addTag}>Tambah</Button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://..." />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">{editingArticle ? 'Update' : 'Simpan'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <img src={article.thumbnail || 'https://via.placeholder.com/80'} alt="" className="w-20 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{article.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{article.category}</Badge>
                  <span>{article.views || 0} views</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(article)}><Pencil className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
                      <AlertDialogDescription>Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(article.slug)} className="bg-destructive">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada artikel</p>
        </div>
      )}
    </div>
  );
};

// Admin Live Class Page
export const AdminLiveClassPage = () => {
  const { token } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', instructor: 'Firza Ilmi',
    scheduled_at: '', duration_minutes: 60, meeting_url: '', max_participants: 100
  });

  const fetchLiveClasses = async () => {
    try {
      const res = await axios.get(`${API}/live-classes`);
      setLiveClasses(res.data);
    } catch (err) { }
    setLoading(false);
  };

  useEffect(() => { fetchLiveClasses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await axios.put(`${API}/live-classes/${editingClass.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Live Class berhasil diupdate!');
      } else {
        await axios.post(`${API}/live-classes`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Live Class berhasil dibuat!');
      }
      setIsDialogOpen(false);
      setEditingClass(null);
      setFormData({ title: '', description: '', instructor: 'Firza Ilmi', scheduled_at: '', duration_minutes: 60, meeting_url: '', max_participants: 100 });
      fetchLiveClasses();
    } catch (err) {
      toast.error('Gagal menyimpan Live Class');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/live-classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Live Class berhasil dihapus!');
      fetchLiveClasses();
    } catch (err) {
      toast.error('Gagal menghapus Live Class');
    }
  };

  const openEdit = (liveClass) => {
    setEditingClass(liveClass);
    setFormData({
      title: liveClass.title,
      description: liveClass.description || '',
      instructor: liveClass.instructor,
      scheduled_at: liveClass.scheduled_at?.slice(0, 16) || '',
      duration_minutes: liveClass.duration_minutes,
      meeting_url: liveClass.meeting_url || '',
      max_participants: liveClass.max_participants
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-3xl">Kelola Live Class</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingClass(null); setFormData({ title: '', description: '', instructor: 'Firza Ilmi', scheduled_at: '', duration_minutes: 60, meeting_url: '', max_participants: 100 }); }}>
              <Plus className="w-4 h-4" />
              Jadwalkan Live Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingClass ? 'Edit Live Class' : 'Jadwalkan Live Class Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Input value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Durasi (menit)</Label>
                  <Input type="number" value={formData.duration_minutes} onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jadwal</Label>
                  <Input type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Max Peserta</Label>
                  <Input type="number" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 100 })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meeting URL (Zoom/Google Meet)</Label>
                <Input value={formData.meeting_url} onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })} placeholder="https://..." />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">{editingClass ? 'Update' : 'Jadwalkan'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : liveClasses.length > 0 ? (
        <div className="space-y-4">
          {liveClasses.map((liveClass) => (
            <div key={liveClass.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{liveClass.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{new Date(liveClass.scheduled_at).toLocaleString('id-ID')}</span>
                  <Badge variant="secondary">{liveClass.duration_minutes} menit</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(liveClass)}><Pencil className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Live Class?</AlertDialogTitle>
                      <AlertDialogDescription>Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(liveClass.id)} className="bg-destructive">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada Live Class terjadwal</p>
        </div>
      )}
    </div>
  );
};

// Admin FAQ Page
export const AdminFAQPage = () => {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '', answer: '', category: 'general', order: 0
  });

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API}/faqs`);
      setFaqs(res.data);
    } catch (err) { }
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await axios.put(`${API}/faqs/${editingFaq.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('FAQ berhasil diupdate!');
      } else {
        await axios.post(`${API}/faqs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('FAQ berhasil dibuat!');
      }
      setIsDialogOpen(false);
      setEditingFaq(null);
      setFormData({ question: '', answer: '', category: 'general', order: 0 });
      fetchFaqs();
    } catch (err) {
      toast.error('Gagal menyimpan FAQ');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/faqs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('FAQ berhasil dihapus!');
      fetchFaqs();
    } catch (err) {
      toast.error('Gagal menghapus FAQ');
    }
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'general',
      order: faq.order || 0
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-3xl">Kelola FAQ</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingFaq(null); setFormData({ question: '', answer: '', category: 'general', order: 0 }); }}>
              <Plus className="w-4 h-4" />
              Tambah FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Pertanyaan</Label>
                <Textarea value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} rows={2} required />
              </div>
              <div className="space-y-2">
                <Label>Jawaban</Label>
                <Textarea value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={5} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Umum</SelectItem>
                      <SelectItem value="payment">Pembayaran</SelectItem>
                      <SelectItem value="course">Kursus</SelectItem>
                      <SelectItem value="technical">Teknis</SelectItem>
                      <SelectItem value="account">Akun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Urutan</Label>
                  <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">{editingFaq ? 'Update' : 'Simpan'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                  <Badge variant="secondary" className="mt-2">{faq.category}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}><Pencil className="w-4 h-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(faq.id)} className="bg-destructive">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada FAQ</p>
        </div>
      )}
    </div>
  );
};

// Admin Settings Page
export const AdminSettingsPage = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    site_title: 'Mavecode',
    site_description: 'Platform belajar coding terbaik di Indonesia',
    hero_title: 'Belajar Coding Jadi Mudah',
    hero_subtitle: 'Platform belajar coding terbaik dengan mentor berpengalaman',
    cta_text: 'Mulai Belajar',
    contact_email: 'support@mavecode.id',
    contact_phone: '+62 812-3456-7890',
    instagram: '@mavecode.id',
    youtube: 'MavecodeCoding',
    analytics_enabled: true
  });
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);
      if (res.data) setSettings(res.data);
    } catch (err) { }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pengaturan berhasil disimpan!');
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan');
    }
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-heading font-bold text-3xl mb-8">Pengaturan</h1>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg">Pengaturan Website</h2>

          <div className="space-y-2">
            <Label>Judul Website</Label>
            <Input value={settings.site_title} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Website</Label>
            <Textarea value={settings.site_description} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} rows={2} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg">Hero Section</h2>

          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Hero Subtitle</Label>
            <Textarea value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} rows={2} />
          </div>

          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Input value={settings.cta_text} onChange={(e) => setSettings({ ...settings, cta_text: e.target.value })} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg">Kontak & Social Media</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Telepon</Label>
              <Input value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input value={settings.youtube} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg">Lainnya</h2>

          <div className="flex items-center gap-2">
            <Switch checked={settings.analytics_enabled} onCheckedChange={(v) => setSettings({ ...settings, analytics_enabled: v })} />
            <Label>Enable Analytics</Label>
          </div>
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </form>
    </div>
  );
};

// Admin Certificates Page
export const AdminCertificatesPage = () => {
  const { token } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${API}/admin/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(res.data);
    } catch (err) { }
    setLoading(false);
  };

  useEffect(() => { fetchCertificates(); }, []);

  const handleSign = async (certId) => {
    try {
      await axios.post(`${API}/admin/certificates/${certId}/sign`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Sertifikat berhasil ditandatangani! ✍️');
      fetchCertificates();
    } catch (err) {
      toast.error('Gagal menandatangani sertifikat');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-3xl">Kelola Sertifikat</h1>
        <Badge variant="outline" className="px-4 py-1">Total: {certificates.length}</Badge>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : certificates.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Kursus</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{cert.user_name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{cert.id}</div>
                  </td>
                  <td className="px-6 py-4">{cert.course_title}</td>
                  <td className="px-6 py-4 text-sm">{new Date(cert.issued_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    {cert.is_signed ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Terdaftar</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/50">Menunggu TTD</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!cert.is_signed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSign(cert.id)}
                          className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-2"
                        >
                          <Award className="w-4 h-4 mr-1" /> TTD
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-8 px-2"
                      >
                        <Link to={`/dashboard/certificates/${cert.course_id}`} target="_blank">
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
          <Award className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-1">Belum ada klaim sertifikat</h2>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">Siswa yang menyelesaikan kursus 100% akan muncul di sini untuk ditandatangani.</p>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
