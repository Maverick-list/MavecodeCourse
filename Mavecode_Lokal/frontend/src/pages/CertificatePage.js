import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth, API } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const CertificatePage = () => {
    const { courseId } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const certRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState(null);
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCertData = async () => {
            try {
                // 1. Fetch course details
                const courseRes = await axios.get(`${API}/courses/${courseId}`);
                setCourse(courseRes.data);

                // 2. Check eligibility & Fetch/Create Certificate
                const certRes = await axios.get(`${API}/certificates/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCertificate(certRes.data);
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.detail || 'Gagal memuat sertifikat');
                // If not eligible, redirect back
                if (err.response?.status === 403) {
                    navigate(`/dashboard`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (token && courseId) {
            fetchCertData();
        }
    }, [courseId, token, navigate]);

    const handleDownload = async () => {
        if (!certRef.current) return;
        setLoading(true);
        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Sertifikat_${course?.title}_${user?.name}.pdf`);
            toast.success('Sertifikat berhasil diunduh!');
        } catch (err) {
            toast.error('Gagal mengunduh sertifikat');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !certificate) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!certificate || !course) return null;

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                    <div className="flex gap-3">
                        <Button onClick={() => window.print()} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90 text-black font-bold">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                    </div>
                </div>

                {/* Certificate Container */}
                <div className="relative overflow-x-auto pb-8">
                    <motion.div
                        ref={certRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="certificate-paper mx-auto relative bg-white text-slate-900 p-12 md:p-20 shadow-2xl overflow-hidden"
                        style={{
                            width: '1050px',
                            minHeight: '742px',
                            border: '20px solid #1a1a2e',
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-paper.png")'
                        }}
                    >
                        {/* Decorative Borders */}
                        <div className="absolute inset-4 border-2 border-slate-200 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-br-full -ml-16 -mt-16" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-tl-full -mr-16 -mb-16" />

                        {/* Content */}
                        <div className="relative z-10 text-center flex flex-col h-full items-center justify-center">
                            <img src={LOGO_URL} alt="Mavecode" className="h-20 w-20 rounded-2xl mb-6 mx-auto shadow-lg" />

                            <h4 className="font-heading text-primary font-bold tracking-[0.3em] uppercase mb-4">Sertifikat Kelulusan</h4>

                            <div className="w-24 h-1 bg-slate-200 mx-auto mb-8" />

                            <p className="text-slate-500 font-serif italic mb-2">Diberikan kepada:</p>
                            <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 mb-8 uppercase tracking-wide">
                                {certificate.user_name}
                            </h1>

                            <p className="max-w-2xl mx-auto text-slate-600 leading-relaxed mb-10 text-lg">
                                Telah berhasil menyelesaikan pelatihan intensif dan memenuhi semua standar kelulusan untuk kursus:
                                <br />
                                <span className="font-bold text-slate-900 text-2xl block mt-2">"{certificate.course_title}"</span>
                            </p>

                            <div className="grid grid-cols-3 w-full gap-8 mt-12 items-end">
                                {/* Date */}
                                <div className="text-center py-4 border-t border-slate-200">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Tanggal Terbit</p>
                                    <p className="font-bold">{new Date(certificate.issued_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>

                                {/* Seal/Award */}
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
                                        <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                            <Award className="w-12 h-12 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                        Terverifikasi Secara Digital
                                    </div>
                                </div>

                                {/* Signature */}
                                <div className="text-center">
                                    <div className="h-20 flex items-center justify-center overflow-hidden">
                                        {certificate.is_signed && certificate.signature_url ? (
                                            <img src={certificate.signature_url} alt="Signature" className="max-h-full" />
                                        ) : (
                                            <div className="text-slate-200 font-serif italic text-sm">Menunggu Tanda Tangan</div>
                                        )}
                                    </div>
                                    <div className="pt-2 border-t border-slate-200">
                                        <p className="font-bold text-slate-900 underline">Firza Ilmi</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Founder Mavecode</p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification ID */}
                            <div className="absolute bottom-0 right-0 p-4 opacity-50">
                                <p className="text-[10px] font-mono">Verify ID: {certificate.id}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center text-slate-500 max-w-2xl mx-auto">
                    <p className="text-sm">
                        Sertifikat ini adalah bukti keahlian Anda. Anda dapat membagikannya di media sosial profesional seperti LinkedIn
                        untuk meningkatkan visibilitas profil Anda bagi calon perusahaan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;
