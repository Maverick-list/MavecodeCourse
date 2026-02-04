import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, Github, Linkedin, Globe, Building2, MapPin,
    Camera, Save, ArrowLeft, Sparkles, Award, BookOpen, Code
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AppContext';
import { toast } from 'sonner';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        bio: '',
        organization: '',
        position: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        skills: '',
        photoUrl: user?.picture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=User',
    });

    useEffect(() => {
        // Load saved profile from localStorage
        const saved = localStorage.getItem('mavecode_profile');
        if (saved) {
            setProfile(prev => ({ ...prev, ...JSON.parse(saved) }));
        } else if (user?.name) {
            const names = user.name.split(' ');
            setProfile(prev => ({
                ...prev,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: user.email || '',
                photoUrl: user.picture || prev.photoUrl
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran foto maksimal 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, photoUrl: reader.result }));
                toast.success('Foto berhasil diupload!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save to localStorage
            localStorage.setItem('mavecode_profile', JSON.stringify(profile));

            // Update user context
            if (setUser) {
                setUser(prev => ({
                    ...prev,
                    name: `${profile.firstName} ${profile.lastName}`.trim(),
                    picture: profile.photoUrl
                }));
            }

            toast.success('Profil berhasil disimpan! 🎉');
        } catch (err) {
            toast.error('Gagal menyimpan profil');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Edit Profil</h1>
                        <p className="text-muted-foreground">Lengkapi data dirimu untuk pengalaman belajar yang lebih baik</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Photo Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-2xl p-6 text-center sticky top-24"
                        >
                            <div className="relative inline-block mb-4">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <img
                                        src={profile.photoUrl}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-xl"
                                    />
                                </motion.div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-black rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </div>
                            <h3 className="font-bold text-lg">
                                {profile.firstName || 'Nama'} {profile.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{profile.position || 'Pelajar Mavecode'}</p>
                            {profile.organization && (
                                <Badge variant="secondary" className="mt-2">
                                    <Building2 className="h-3 w-3 mr-1" />
                                    {profile.organization}
                                </Badge>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border">
                                <div className="text-center">
                                    <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
                                    <p className="text-lg font-bold">0</p>
                                    <p className="text-[10px] text-muted-foreground">Kursus</p>
                                </div>
                                <div className="text-center">
                                    <Award className="h-5 w-5 text-accent mx-auto mb-1" />
                                    <p className="text-lg font-bold">0</p>
                                    <p className="text-[10px] text-muted-foreground">Sertifikat</p>
                                </div>
                                <div className="text-center">
                                    <Sparkles className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold">0</p>
                                    <p className="text-[10px] text-muted-foreground">XP</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border rounded-2xl p-6"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Informasi Dasar
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Nama Depan *</label>
                                    <Input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Nama depan" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Nama Belakang</label>
                                    <Input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Nama belakang" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                                    <Input name="email" type="email" value={profile.email} onChange={handleChange} placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">No. Telepon</label>
                                    <Input name="phone" value={profile.phone} onChange={handleChange} placeholder="+62 812 xxxx xxxx" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-muted-foreground mb-1 block">Bio</label>
                                    <Input name="bio" value={profile.bio} onChange={handleChange} placeholder="Ceritakan sedikit tentang dirimu..." />
                                </div>
                            </div>
                        </motion.div>

                        {/* Work Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-card border border-border rounded-2xl p-6"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Pekerjaan & Organisasi
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Organisasi / Perusahaan</label>
                                    <Input name="organization" value={profile.organization} onChange={handleChange} placeholder="Nama organisasi" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Posisi / Jabatan</label>
                                    <Input name="position" value={profile.position} onChange={handleChange} placeholder="Contoh: Full-Stack Developer" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Lokasi</label>
                                    <Input name="location" value={profile.location} onChange={handleChange} placeholder="Kota, Negara" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Skills (pisahkan dengan koma)</label>
                                    <Input name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, Python" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card border border-border rounded-2xl p-6"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Link & Sosial Media
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                                        <Github className="h-4 w-4" /> GitHub
                                    </label>
                                    <Input name="github" value={profile.github} onChange={handleChange} placeholder="username" />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                                        <Linkedin className="h-4 w-4" /> LinkedIn
                                    </label>
                                    <Input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="username" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                                        <Globe className="h-4 w-4" /> Website
                                    </label>
                                    <Input name="website" value={profile.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Save Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-6"
                            >
                                {loading ? 'Menyimpan...' : <><Save className="mr-2 h-5 w-5" /> Simpan Profil</>}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
