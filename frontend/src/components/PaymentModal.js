import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, QrCode, ArrowRight, Loader2, CheckCircle, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../context/AppContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
};

const PAYMENT_METHODS = [
    {
        id: 'va',
        name: 'Virtual Account Bank',
        icon: CreditCard,
        options: [
            { id: 'bca', name: 'BCA Virtual Account', icon: 'https://cdn.antigrav.ai/assets/banks/bca.png' },
            { id: 'mandiri', name: 'Mandiri Virtual Account', icon: 'https://cdn.antigrav.ai/assets/banks/mandiri.png' },
            { id: 'bni', name: 'BNI Virtual Account', icon: 'https://cdn.antigrav.ai/assets/banks/bni.png' },
            { id: 'bri', name: 'BRI Virtual Account', icon: 'https://cdn.antigrav.ai/assets/banks/bri.png' }
        ]
    },
    {
        id: 'ewallet',
        name: 'E-Wallet / QRIS',
        icon: Wallet,
        options: [
            { id: 'gopay', name: 'GoPay', icon: 'https://cdn.antigrav.ai/assets/wallets/gopay.png' },
            { id: 'ovo', name: 'OVO', icon: 'https://cdn.antigrav.ai/assets/wallets/ovo.png' },
            { id: 'dana', name: 'DANA', icon: 'https://cdn.antigrav.ai/assets/wallets/dana.png' },
            { id: 'shopeepay', name: 'ShopeePay', icon: 'https://cdn.antigrav.ai/assets/wallets/shopeepay.png' }
        ]
    }
];

export const PaymentModal = ({ isOpen, onClose, course, onSuccess }) => {
    const { token } = useAuth();
    const [step, setStep] = useState(1); // 1: Select Method, 2: Payment Pending, 3: Success
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const handleCreateOrder = async () => {
        if (!selectedMethod) {
            toast.error('Pilih metode pembayaran terlebih dahulu');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${API}/orders`, {
                course_id: course.id,
                payment_method: selectedMethod.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrderData(res.data);
            setStep(2);
        } catch (err) {
            toast.error('Gagal membuat pesanan');
        } finally {
            setLoading(false);
        }
    };

    const handleSimulatePayment = async () => {
        setLoading(true);
        try {
            // Simulate waiting for payment gateway callback
            await new Promise(resolve => setTimeout(resolve, 2000));

            await axios.post(`${API}/orders/${orderData.id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStep(3);
            toast.success('Pembayaran Berhasil! Selamat Belajar 🚀');
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error('Gagal memproses pembayaran');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold font-heading">
                            {step === 1 && 'Pilih Pembayaran'}
                            {step === 2 && 'Selesaikan Pembayaran'}
                            {step === 3 && 'Pembayaran Berhasil'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                                    <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="font-bold text-sm text-primary">{course.title}</h3>
                                        <p className="font-black text-lg">{course.price === 0 ? 'GRATIS' : formatPrice(course.price)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {PAYMENT_METHODS.map((category) => (
                                        <div key={category.id}>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <category.icon size={14} />
                                                {category.name}
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {category.options.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setSelectedMethod(option)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedMethod?.id === option.id
                                                                ? 'bg-primary/20 border-primary ring-1 ring-primary'
                                                                : 'bg-white/5 border-transparent hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {/* Placeholder Icon */}
                                                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-xs font-bold text-black">
                                                            {option.id.toUpperCase().slice(0, 3)}
                                                        </div>
                                                        <span className="font-medium">{option.name}</span>
                                                        {selectedMethod?.id === option.id && <CheckCircle size={18} className="ml-auto text-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleCreateOrder}
                                    disabled={!selectedMethod || loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Bayar Sekarang'}
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Menunggu Pembayaran</h3>
                                    <p className="text-slate-400">Selesaikan pembayaran sebelum waktu habis.</p>
                                </div>

                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Total Pembayaran</span>
                                        <span className="font-bold text-lg">{formatPrice(orderData.amount)}</span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">Metode Pembayaran</p>
                                        <div className="flex items-center justify-center gap-2 font-bold">
                                            {orderData.payment_method.toUpperCase()}
                                            {orderData.va_number && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded">Virtual Account</span>
                                            )}
                                        </div>
                                    </div>

                                    {orderData.va_number && (
                                        <div className="bg-white text-black p-4 rounded-xl flex items-center justify-between">
                                            <div className="text-left">
                                                <p className="text-xs text-slate-500">Nomor Virtual Account</p>
                                                <p className="font-mono font-bold text-xl">{orderData.va_number}</p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="hover:bg-slate-200" onClick={() => {
                                                navigator.clipboard.writeText(orderData.va_number);
                                                toast.success('Nomor VA disalin');
                                            }}>
                                                <Copy size={18} />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleSimulatePayment}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl"
                                >
                                    {loading ? 'Memproses...' : 'Simulasi: Saya Sudah Bayar'}
                                </Button>
                                <p className="text-xs text-slate-500">*Ini adalah simulasi. Tombol di atas akan otomatis memverifikasi pembayaran.</p>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Pembayaran Berhasil!</h3>
                                    <p className="text-slate-400">Terima kasih telah membeli kursus ini.</p>
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl"
                                >
                                    Mulai Belajar Sekarang
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
