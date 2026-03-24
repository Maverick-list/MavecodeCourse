import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, QrCode, ArrowRight, Loader2, CheckCircle, Copy, ShieldCheck, Globe, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth, API } from '../context/AppContext';

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
            { id: 'bca', name: 'BCA Virtual Account', icon: 'BCA' },
            { id: 'mandiri', name: 'Mandiri Virtual Account', icon: 'MDR' },
            { id: 'bni', name: 'BNI Virtual Account', icon: 'BNI' },
            { id: 'bri', name: 'BRI Virtual Account', icon: 'BRI' }
        ]
    },
    {
        id: 'ewallet',
        name: 'E-Wallet & QRIS',
        icon: Wallet,
        options: [
            { id: 'qris', name: 'QRIS (All Payment)', icon: 'QRS' },
            { id: 'gopay', name: 'GoPay', icon: 'GPY' },
            { id: 'ovo', name: 'OVO', icon: 'OVO' },
            { id: 'dana', name: 'DANA', icon: 'DNA' }
        ]
    },
    {
        id: 'cc',
        name: 'Kartu Kredit / Debit',
        icon: Lock,
        options: [
            { id: 'visa', name: 'Visa', icon: 'VIS' },
            { id: 'mastercard', name: 'Mastercard', icon: 'MSC' }
        ]
    },
    {
        id: 'intl',
        name: 'Pembayaran Internasional',
        icon: Globe,
        options: [
            { id: 'paypal', name: 'PayPal', icon: 'PPL' }
        ]
    }
];

export const PaymentModal = ({ isOpen, onClose, product, onSuccess }) => {
    // product can be a course or a subscription plan
    // expected product schema: { id, title, price, thumbnail (optional), type: 'course' | 'plan' }
    const { token } = useAuth();
    const [step, setStep] = useState(1); // 1: Select Method, 2: Payment Pending, 3: Success
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const handleCreateOrder = async () => {
        if (!selectedMethod) {
            toast.error('Gagal: Pilih metode pembayaran terlebih dahulu!');
            return;
        }
        setLoading(true);
        try {
            // For simulation, we'll hit the normal order endpoint but just construct a fake order object locally if it's a plan,
            // or we'll assume the backend handles it. Since we are doing a client-centric simulation for the UI:

            // Simulating API request to create order
            await new Promise(res => setTimeout(res, 800));

            const generatedVa = `${Math.floor(Math.random() * 100000) + 80000}${Math.floor(Math.random() * 10000000)}`;

            setOrderData({
                id: `ORD-${Math.floor(Math.random() * 1000000)}`,
                amount: product.price,
                payment_method: selectedMethod.name,
                va_number: selectedMethod.id !== 'paypal' && selectedMethod.id !== 'qris' && !['visa', 'mastercard'].includes(selectedMethod.id) ? generatedVa : null,
                is_qris: selectedMethod.id === 'qris',
                is_cc: ['visa', 'mastercard'].includes(selectedMethod.id),
                is_paypal: selectedMethod.id === 'paypal'
            });
            setStep(2);
            toast.success('Secure Checkout Berhasil Dibuat');
        } catch (err) {
            toast.error('Gagal membuat transaksi aman');
        } finally {
            setLoading(false);
        }
    };

    const handleSimulatePayment = async () => {
        setLoading(true);
        try {
            // Simulate waiting for payment gateway callback
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStep(3);
            toast.success('✅ Pembayaran Berhasil Terverifikasi Sistem!');
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error('Gagal memproses pembayaran');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-2xl bg-white dark:bg-[#0a0e17] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,255,255,0.1)] relative"
                >
                    {/* Top Security Banner */}
                    <div className="w-full bg-green-500/10 border-b border-green-500/20 py-2 px-6 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold font-mono">
                            End-to-End Encrypted Secure Checkout 256-bit
                        </span>
                    </div>

                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h2 className="text-2xl font-bold font-heading uppercase tracking-wider text-slate-900 dark:text-white glow-primary">
                            {step === 1 && 'Pilih Metode Pembayaran'}
                            {step === 2 && 'Selesaikan Transaksi'}
                            {step === 3 && 'Transaksi Berhasil'}
                        </h2>
                        <button onClick={onClose} className="p-2 bg-slate-200 dark:bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-600 dark:text-slate-400 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {step === 1 && (
                            <div className="space-y-8">
                                {/* Product Summary */}
                                <div className="flex items-center gap-6 p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {product.thumbnail ? (
                                        <img src={product.thumbnail} alt={product.title} className="w-20 h-20 rounded-xl object-cover shadow-lg border border-white/10 relative z-10" />
                                    ) : (
                                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg relative z-10">
                                            <Globe className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1 font-bold">Ringkasan Pembelian</div>
                                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{product.title}</h3>
                                        <p className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                            {product.price === 0 ? 'GRATIS' : formatPrice(product.price)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {PAYMENT_METHODS.map((category) => (
                                        <div key={category.id} className="animate-fade-in">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <category.icon size={16} className="text-primary" />
                                                {category.name}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {category.options.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setSelectedMethod(option)}
                                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${selectedMethod?.id === option.id
                                                            ? 'bg-primary/10 border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(0,255,255,0.2)] scale-[1.02]'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-8 rounded bg-gradient-to-br ${selectedMethod?.id === option.id ? 'from-primary to-accent' : 'from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800'} flex items-center justify-center text-xs font-black text-slate-800 dark:text-white shadow-inner`}>
                                                                {option.icon}
                                                            </div>
                                                            <span className="font-semibold text-sm text-left text-slate-800 dark:text-slate-200">{option.name}</span>
                                                        </div>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod?.id === option.id ? 'border-primary' : 'border-slate-600'}`}>
                                                            {selectedMethod?.id === option.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleCreateOrder}
                                    disabled={!selectedMethod || loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-black font-heading font-black tracking-widest uppercase py-8 rounded-2xl text-lg relative overflow-hidden group shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:shadow-[0_0_60px_rgba(0,255,255,0.5)] transition-all"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                                            <>
                                                <ShieldCheck className="w-6 h-6" />
                                                Bayar Aman Sekarang
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="text-center space-y-8 animate-fade-in py-4">
                                <div className="w-24 h-24 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex flex-col items-center justify-center mx-auto relative group">
                                    <div className="absolute inset-0 rounded-full border-t-2 border-yellow-500 animate-spin" />
                                    <Loader2 className="w-8 h-8 text-yellow-500 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-heading font-bold mb-2 uppercase tracking-wide">Menunggu Pembayaran</h3>
                                    <p className="text-slate-400 font-mono text-sm max-w-md mx-auto">Selesaikan pembayaran ini dalam kurun waktu 1x24 Jam agar pesanan Anda dapat segera kami proses.</p>
                                </div>

                                <div className="p-8 bg-black/40 rounded-3xl border border-white/10 space-y-6 max-w-md mx-auto relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />

                                    <div className="flex flex-col items-center gap-2 mb-6">
                                        <span className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest">Total Tagihan</span>
                                        <span className="font-black text-4xl text-slate-900 dark:text-white">{formatPrice(orderData.amount)}</span>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Metode Pilihan</span>
                                            <span className="font-bold text-primary">{orderData.payment_method}</span>
                                        </div>

                                        {orderData.va_number && (
                                            <div className="mt-6">
                                                <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest text-left">Virtual Account Number</p>
                                                <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors">
                                                    <p className="font-mono font-bold text-2xl tracking-[0.2em]">{orderData.va_number}</p>
                                                    <Button size="icon" variant="ghost" className="hover:bg-primary/20 hover:text-primary transition-colors" onClick={() => {
                                                        navigator.clipboard.writeText(orderData.va_number);
                                                        toast.success('Nomor Rekening Disalin!');
                                                    }}>
                                                        <Copy size={20} />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {orderData.is_qris && (
                                            <div className="mt-6 bg-white p-6 rounded-2xl mx-auto w-fit flex flex-col items-center justify-center">
                                                <QrCode className="w-48 h-48 text-black" />
                                                <p className="text-black font-bold mt-4 uppercase text-sm">Scan with any E-Wallet Apps</p>
                                            </div>
                                        )}

                                        {(orderData.is_cc || orderData.is_paypal) && (
                                            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl flex flex-col items-center justify-center text-blue-400">
                                                <Globe className="w-12 h-12 mb-4 animate-bounce" />
                                                <p className="font-bold text-center">Redirecting to Secure Gateway...</p>
                                                <p className="text-xs opacity-70 mt-2 text-center">You will be securely redirected to {orderData.payment_method}'s portal.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSimulatePayment}
                                    className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-2 border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Simulasi: Saya Sudah Membayar <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-12 space-y-8 animate-fade-in">
                                <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto relative">
                                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-heading font-black mb-4 text-slate-900 dark:text-white glow-primary uppercase">Payment Successful!</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg">Your transaction for <span className="text-slate-900 dark:text-white font-bold">{product.title}</span> was securely processed.</p>
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="w-full max-w-md mx-auto bg-primary hover:bg-primary/90 text-black font-heading font-black py-8 rounded-2xl text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:scale-105 transition-all"
                                >
                                    GAS BELAJAR SEKARANG 🚀
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
