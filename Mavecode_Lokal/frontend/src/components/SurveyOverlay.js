import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, BookOpen, Code, Target, Sparkles, Zap, Crown, Check, ChevronRight, Terminal, Cpu, Database, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_f18ca982-69d5-4169-9c73-02205ce66a01/artifacts/59psddfu_IMG_7510.JPG";

const SurveyOverlay = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [nameInput, setNameInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const surveySteps = [
    {
      id: 'welcome',
      title: t('identityVerification'),
      subtitle: t('identitySubtitle'),
      type: 'welcome'
    },
    {
      id: 'name',
      title: t('designation'),
      subtitle: t('designationSubtitle'),
      type: 'input',
      placeholder: t('operatorName'),
      icon: User
    },
    {
      id: 'experience',
      title: t('skillLevel'),
      subtitle: t('skillSubtitle'),
      type: 'select',
      options: [
        { value: 'newbie', label: 'CYBER-PUPIL', desc: 'No prior coding experience. Level 0.', emoji: '💾' },
        { value: 'script-kiddie', label: 'SCRIPT KIDDIE', desc: 'Basic knowledge, copying snippets.', emoji: '📟' },
        { value: 'net-runner', label: 'NET-RUNNER', desc: 'Can build functional projects. Level 50.', emoji: '👓' },
        { value: 'architect', label: 'SYSTEM ARCHITECT', desc: 'Professional developer. Level 99.', emoji: '🌌' }
      ]
    },
    {
      id: 'interest',
      title: t('primaryInterest'),
      subtitle: t('interestSubtitle'),
      type: 'multi-select',
      options: [
        { value: 'frontend', label: 'NEURAL INTERFACE', desc: 'Frontend, React, UI/UX', icon: Globe, color: 'from-cyan-500 to-blue-500' },
        { value: 'backend', label: 'CORE ENGINE', desc: 'Backend, Node.js, Database', icon: Database, color: 'from-red-500 to-orange-500' },
        { value: 'ai', label: 'ARTIFICIAL INTELLIGENCE', desc: 'ML, Python, Neural Nets', icon: Cpu, color: 'from-purple-500 to-pink-500' },
        { value: 'fullstack', label: 'FULLSTACK OVERRIDE', desc: 'Frontend + Backend Master', icon: Terminal, color: 'from-[#39FF14] to-emerald-500' }
      ]
    },
    {
      id: 'goal',
      title: t('missionObjective'),
      subtitle: t('objectiveSubtitle'),
      type: 'select',
      options: [
        { value: 'career', label: 'MEGACORP ROLE', desc: 'Get hired by top companies.', emoji: '🏢' },
        { value: 'freelance', label: 'ROGUE AGENT', desc: 'Freelancing and side gigs.', emoji: '📡' },
        { value: 'startup', label: 'FOUNDER PROTOCOL', desc: 'Build your own digital empire.', emoji: '🚀' },
        { value: 'hobby', label: 'CORE UPGRADE', desc: 'For personal improvement.', emoji: '🧠' }
      ]
    },
    {
      id: 'pricing',
      title: t('selectAccessLevel'),
      subtitle: t('accessLevelSubtitle'),
      type: 'pricing'
    }
  ];

  const pricingPlans = [
    {
      id: 'basic',
      name: t('guestAccess'),
      price: '0 CREDITS',
      priceNum: 0,
      desc: t('basicEntryDesc'),
      icon: Sparkles,
      color: 'from-slate-700 to-slate-800',
      borderColor: 'border-slate-600',
      features: [
        t('publicLabAccess'),
        t('basicCertification'),
        t('communityComms'),
        t('supportUplink')
      ],
      cta: t('initializeAsGuest')
    },
    {
      id: 'pro',
      name: t('eliteRunner'),
      price: '199K CREDITS',
      priceNum: 199000,
      desc: t('unrestrictedAccessDesc'),
      icon: Zap,
      color: 'from-[#00FFFF] to-[#0080FF]',
      borderColor: 'border-[#00FFFF]',
      popular: true,
      features: [
        t('allPremiumModules'),
        t('weeklyLiveUplinks'),
        t('oneOnOneCalibration'),
        t('projectOverrides'),
        t('priorityComms')
      ],
      cta: t('upgradeToElite')
    },
    {
      id: 'enterprise',
      name: t('syndicate'),
      price: '499K CREDITS',
      priceNum: 499000,
      desc: t('squadOrgDesc'),
      icon: Crown,
      color: 'from-[#39FF14] to-[#00CC00]',
      borderColor: 'border-[#39FF14]',
      features: [
        t('unlimitedSquadSize'),
        t('customTrainingPaths'),
        t('prioritySupport247'),
        t('apiCoreAccess'),
        t('dedicatedHandler')
      ],
      cta: t('contactSyndicate')
    }
  ];

  const step = surveySteps[currentStep];
  const isLastStep = currentStep === surveySteps.length - 1;
  const totalSteps = surveySteps.length;

  const handleNext = () => {
    if (step.id === 'name') {
      setAnswers(prev => ({ ...prev, [step.id]: nameInput }));
    }
    if (step.id === 'interest') {
      setAnswers(prev => ({ ...prev, [step.id]: selectedInterests }));
    }

    if (isLastStep) {
      const surveyData = { ...answers, plan: selectedPlan };
      localStorage.setItem('mavecode_survey_completed', 'true');
      onComplete(surveyData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 400);
  };

  const toggleInterest = (value) => {
    setSelectedInterests(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const canProceed = () => {
    if (step.type === 'welcome') return true;
    if (step.id === 'name') return nameInput.trim().length > 0;
    if (step.type === 'select') return answers[step.id];
    if (step.id === 'interest') return selectedInterests.length > 0;
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[9998] bg-[#050510] flex items-center justify-center overflow-y-auto font-mono text-white"
    >
      {/* Cyberpunk BG elements */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent animate-pulse" />
      
      {/* HUD decorations */}
      <div className="absolute top-6 left-6 text-[10px] text-[#00FFFF]/50 tracking-[5px] uppercase">MAVE::SURVEY_v2</div>
      <div className="absolute top-6 right-6 text-[10px] text-white/30">{t('step').toUpperCase()}: {currentStep + 1}/{totalSteps}</div>

      <div className="relative z-20 w-full max-w-4xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#00FFFF] mb-2 uppercase">
                {step.title}
              </h2>
              <p className="text-xs text-[#39FF14] tracking-widest opacity-70">{step.subtitle}</p>
            </div>

            {/* Content areas based on step type */}
            {step.type === 'welcome' && (
              <div className="flex flex-col items-center gap-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#00FFFF] border-t-transparent rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  <img src={LOGO_URL} alt="Mave" className="w-24 h-24 rounded-full border-2 border-[#00FFFF]" />
                </div>
                <button
                  onClick={handleNext}
                  className="px-12 py-4 border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-all font-bold tracking-widest skew-x-[-10deg]"
                >
                  {t('initializeSystem')}
                </button>
              </div>
            )}

            {step.type === 'input' && (
              <div className="w-full max-w-md flex flex-col items-center gap-8">
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#00FFFF] outline-none text-3xl text-center py-4 transition-all"
                  placeholder={step.placeholder}
                />
                <button
                  disabled={!canProceed()}
                  onClick={handleNext}
                  className={`px-10 py-3 border tracking-[5px] transition-all font-bold ${canProceed() ? 'border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10' : 'border-white/10 text-white/10'}`}
                >
                  {t('nextParam')}
                </button>
              </div>
            )}

            {(step.type === 'select' || step.type === 'multi-select') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {step.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => step.type === 'select' ? handleSelect(opt.value) : toggleInterest(opt.value)}
                    className={`p-6 text-left border flex items-center gap-4 transition-all group ${
                      (answers[step.id] === opt.value || (Array.isArray(selectedInterests) && selectedInterests.includes(opt.value)))
                      ? 'border-[#00FFFF] bg-[#00FFFF]/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                      : 'border-white/10 bg-white/5 hover:border-[#00FFFF]/50'
                    }`}
                  >
                    {opt.icon ? <opt.icon className="w-8 h-8 text-[#00FFFF]" /> : <span className="text-3xl">{opt.emoji}</span>}
                    <div>
                      <div className="font-bold text-lg group-hover:text-[#00FFFF] transition-colors">{opt.label}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">{opt.desc}</div>
                    </div>
                  </motion.button>
                ))}
                {step.type === 'multi-select' && (
                  <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
                    <button
                      disabled={!canProceed()}
                      onClick={handleNext}
                      className="px-12 py-4 border border-[#39FF14] text-[#39FF14] font-bold hover:bg-[#39FF14]/10 transition-all tracking-[10px]"
                    >
                      {t('confirmInterests')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {step.type === 'pricing' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {pricingPlans.map((plan, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className={`relative p-8 border flex flex-col gap-6 transition-all ${
                      selectedPlan === plan.id ? `border-[#00FFFF] bg-white/5 shadow-2xl` : 'border-white/10 bg-white/5 opacity-80'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#39FF14] text-black text-[10px] px-3 font-bold py-1">{t('recommended').toUpperCase()}</div>
                    )}
                    <h3 className="text-2xl font-black italic border-b border-white/10 pb-4">{plan.name}</h3>
                    <div className="text-3xl font-bold text-[#00FFFF]">{plan.price}</div>
                    <ul className="flex-1 space-y-3">
                      {plan.features.map((f, j) => (
                        <li key={j} className="text-[10px] flex items-center gap-2 text-white/60">
                          <Check className="w-3 h-3 text-[#39FF14]" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className={`py-3 font-bold transition-all border ${
                        selectedPlan === plan.id ? 'bg-[#00FFFF] text-black' : 'border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-12">
        {currentStep > 0 && (
          <button onClick={handleBack} className="flex items-center gap-2 text-white/30 hover:text-white transition-all text-xs">
            <ArrowLeft className="w-4 h-4" /> {t('rewind').toUpperCase()}
          </button>
        )}
        <div className="flex gap-2">
          {surveySteps.map((_, i) => (
            <div key={i} className={`h-[2px] w-8 transition-all ${i === currentStep ? 'bg-[#00FFFF]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SurveyOverlay;
