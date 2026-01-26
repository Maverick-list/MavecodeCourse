import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Untuk yang baru mulai belajar',
    price_monthly: 99000,
    price_yearly: 999000,
    icon: Sparkles,
    features: [
      'Akses semua kursus gratis',
      'Sertifikat digital',
      'Forum komunitas',
      'Dukungan email',
    ],
    not_included: [
      'Kursus premium',
      'Live class',
      'Mentoring 1-on-1',
    ],
    is_popular: false,
    cta: 'Mulai Gratis'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Untuk yang serius berkarir',
    price_monthly: 199000,
    price_yearly: 1999000,
    icon: Zap,
    features: [
      'Semua fitur Basic',
      'Akses semua kursus premium',
      'Live class mingguan',
      'Mentoring 1-on-1 (2x/bulan)',
      'Project review',
      'Priority support',
    ],
    not_included: [],
    is_popular: true,
    cta: 'Berlangganan Pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Untuk tim & perusahaan',
    price_monthly: 499000,
    price_yearly: 4999000,
    icon: Crown,
    features: [
      'Semua fitur Pro',
      'Tim unlimited',
      'Custom learning path',
      'Priority support 24/7',
      'API access',
      'White-label option',
      'Dedicated account manager',
    ],
    not_included: [],
    is_popular: false,
    cta: 'Hubungi Sales'
  }
];

export const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscount = (monthly, yearly) => {
    const monthlyTotal = monthly * 12;
    const savings = ((monthlyTotal - yearly) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/20 text-primary">Harga Transparan</Badge>
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">
            Pilih Paket yang Tepat Untukmu
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Investasi terbaik untuk karirmu. Mulai gratis, upgrade kapan saja.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Bulanan
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              data-testid="billing-toggle"
            />
            <span className={isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Tahunan
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                Hemat hingga 20%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-card border rounded-3xl p-8 ${
                plan.is_popular 
                  ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                  : 'border-border'
              }`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    Paling Populer
                  </Badge>
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                plan.is_popular ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
              }`}>
                <plan.icon className="w-6 h-6" />
              </div>

              {/* Name & Description */}
              <h3 className="font-heading font-bold text-2xl mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-4xl">
                    {formatPrice(isYearly ? plan.price_yearly / 12 : plan.price_monthly)}
                  </span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPrice(plan.price_yearly)}/tahun
                    <span className="text-green-500 ml-2">
                      (hemat {getDiscount(plan.price_monthly, plan.price_yearly)}%)
                    </span>
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button 
                className={`w-full rounded-full py-6 mb-8 ${
                  plan.is_popular 
                    ? 'bg-primary hover:bg-primary/90 glow-primary' 
                    : ''
                }`}
                variant={plan.is_popular ? 'default' : 'outline'}
                onClick={() => navigate('/register')}
                data-testid={`cta-${plan.id}`}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.not_included?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 opacity-50">
                    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">✕</span>
                    <span className="text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground">
            Punya pertanyaan?{' '}
            <Link to="/faq" className="text-primary hover:underline">
              Lihat FAQ
            </Link>
            {' '}atau{' '}
            <Link to="/contact" className="text-primary hover:underline">
              hubungi kami
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
