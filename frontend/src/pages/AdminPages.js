import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, FileText, Video, Users, 
  Settings, LogOut, Plus, Pencil, Trash2, Eye, Menu, X
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
import { useAuth } from '../context/AppContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Kursus', href: '/admin/courses', icon: BookOpen },
  { name: 'Artikel', href: '/admin/articles', icon: FileText },
  { name: 'Live Class', href: '/admin/live', icon: Video },
  { name: 'FAQ', href: '/admin/faq', icon: Users },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const { logout, isAdmin } = useAuth();
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
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-3 mb-8">
            <img src={LOGO_URL} alt="Mavecode" className="h-10 w-10 rounded-xl" />
            <div>
              <span className="font-heading font-bold block">Mavecode</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === link.href 
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
      } catch (err) {}
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
          { label: 'Mentor', value: stats.mentors, color: 'bg-purple-500/20 text-purple-500' },
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
              <Link to="/admin/settings">
                <Settings className="w-6 h-6 mb-2" />
                <span>Pengaturan</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Seed Data</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Generate sample data untuk testing
          </p>
          <Button 
            onClick={async () => {
              try {
                await axios.post(`${API}/seed`);
                toast.success('Seed data berhasil!');
              } catch (err) {
                toast.error('Gagal generate seed data');
              }
            }}
            variant="outline"
          >
            Generate Seed Data
          </Button>
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
    } catch (err) {}
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
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
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
                  <Select value={formData.level} onValueChange={(v) => setFormData({...formData, level: v})}>
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
                  <Input type="number" value={formData.duration_hours} onChange={(e) => setFormData({...formData, duration_hours: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Harga (Rp)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} disabled={formData.is_free} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_free} onCheckedChange={(v) => setFormData({...formData, is_free: v})} />
                <Label>Gratis</Label>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input value={formData.thumbnail} onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} placeholder="https://..." />
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

export default AdminLayout;
