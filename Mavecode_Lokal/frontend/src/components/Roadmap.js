import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Code, Terminal, Server, Cpu, Globe, Target, Terminal as TerminalIcon, Shield, Layers, Workflow, Smartphone, Layout, Zap, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Roadmap = () => {
  const { t, useAutoTranslate } = useLanguage();
  const [activeRoadmap, setActiveRoadmap] = useState('frontend');
  const containerRef = useRef(null);

  // Original labels to be translated
  const frontendTitle = useAutoTranslate('FRONTEND ARCHITECT');
  const backendTitle = useAutoTranslate('BACKEND CORE ENGINE');
  const devopsTitle = useAutoTranslate('DEVOPS OPS-COMMAND');

  const roadmaps = {
    frontend: {
      title: frontendTitle,
      icon: Layout,
      color: '#00FFFF',
      steps: [
        { id: 1, title: useAutoTranslate('CORE PROTOCOLS'), desc: useAutoTranslate('HTML5, Semantic UI, SEO Fundamentals') },
        { id: 2, title: useAutoTranslate('VISUAL CALIBRATION'), desc: useAutoTranslate('CSS3, Flexbox, Grid, Responsive Design') },
        { id: 4, title: useAutoTranslate('LOGIC ENGINES'), desc: useAutoTranslate('JavaScript ES6+, DOM Manipulation, APIs') },
        { id: 5, title: useAutoTranslate('NEURAL FRAMEWORKS'), desc: useAutoTranslate('React, Hooks, State Management (Redux/Zustand)') },
        { id: 6, title: useAutoTranslate('META-ASSETS'), desc: useAutoTranslate('Next.js, Server Component, Hydration') },
        { id: 7, title: useAutoTranslate('DEPLOYMENT FLUX'), desc: useAutoTranslate('Git, CI/CD, Vercel, Performance Audit') }
      ]
    },
    backend: {
      title: backendTitle,
      icon: Server,
      color: '#FF00FF',
      steps: [
        { id: 1, title: useAutoTranslate('SERVER UPLINK'), desc: useAutoTranslate('Node.js, Express, Middleware') },
        { id: 2, title: useAutoTranslate('DATABASE CELL'), desc: useAutoTranslate('SQL (PostgreSQL/MySQL), NoSQL (MongoDB)') },
        { id: 3, title: useAutoTranslate('API OVERRIDE'), desc: useAutoTranslate('RESTful API Design, GraphQL') },
        { id: 4, title: useAutoTranslate('SECURITY GATEWAY'), desc: useAutoTranslate('JWT, OAuth, Encryption, CORS') },
        { id: 5, title: useAutoTranslate('DISTRIBUTED NODES'), desc: useAutoTranslate('Microservices, Redis, Message Queues') },
        { id: 6, title: useAutoTranslate('CLOUD ORCHESTRATION'), desc: useAutoTranslate('Docker, AWS, K8s, CI/CD') }
      ]
    },
    devops: {
      title: devopsTitle,
      icon: Shield,
      color: '#39FF14',
      steps: [
        { id: 1, title: useAutoTranslate('OS TERMINAL'), desc: useAutoTranslate('Linux CLI, Bash Scripting') },
        { id: 2, title: useAutoTranslate('INFRA-CODE'), desc: useAutoTranslate('Terraform, Ansible, CloudFormation') },
        { id: 3, title: useAutoTranslate('CONTAINER NODES'), desc: useAutoTranslate('Docker, Images, Volumes') },
        { id: 4, title: useAutoTranslate('CLUSTER OPS'), desc: useAutoTranslate('Kubernetes, Helm, Nodes') },
        { id: 5, title: useAutoTranslate('CI/CD PIPELINES'), desc: useAutoTranslate('GitHub Actions, Jenkins, GitLab') },
        { id: 6, title: useAutoTranslate('MONITORING MATRIX'), desc: useAutoTranslate('Prometheus, Grafana, Log Management') }
      ]
    }
  };

  const currentRoadmap = roadmaps[activeRoadmap];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scrollLineScale = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="py-24 relative bg-card/50 dark:bg-black/80 font-mono text-foreground overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header and Switches */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 border-b border-border pb-12">
          <div className="text-left w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-foreground uppercase mb-2">
              {t('learningRoadmaps').split(' ')[0]} <span style={{ color: currentRoadmap.color }}>{t('learningRoadmaps').split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="text-[10px] text-accent tracking-[3px] uppercase opacity-70">{t('careerDestination')}</div>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-2 w-full md:w-1/2">
            {Object.keys(roadmaps).map((key) => {
              const RM = roadmaps[key];
              const isActive = activeRoadmap === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveRoadmap(key)}
                  className={`px-6 py-3 border flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest ${
                    isActive 
                    ? `border-[${RM.color}] bg-primary/10 text-foreground shadow-[0_0_15px_${RM.color}22]` 
                    : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                  style={{ borderColor: isActive ? RM.color : undefined }}
                >
                  <RM.icon className={`w-4 h-4 ${isActive ? '' : 'opacity-50'}`} style={{ color: isActive ? RM.color : undefined }} />
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="relative">
          {/* Dynamic Scrollable Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 hidden md:block" />
          <motion.div 
            className="absolute left-[50%] top-0 w-[2px] -translate-x-1/2 hidden md:block"
            style={{ 
              height: '100%',
              scaleY: scrollLineScale,
              transformOrigin: 'top',
              background: `linear-gradient(to bottom, #00FFFF, ${currentRoadmap.color})`,
              boxShadow: `0 0 15px ${currentRoadmap.color}`
            }}
          />

          <div className="space-y-24 relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeRoadmap}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-24"
              >
                {currentRoadmap.steps.map((step, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div key={i} className={`flex flex-col md:flex-row items-center justify-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                      {/* Text Side */}
                      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 text-center md:text-left">
                        <motion.div
                          whileInView={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                          className={`mb-4 flex flex-col ${isEven ? 'md:items-start' : 'md:items-end'}`}
                        >
                          <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-[5px]">MODULE::{step.id.toString().padStart(2, '0')}</div>
                          <h3 className="text-2xl font-bold uppercase group-hover:text-primary transition-colors" style={{ color: currentRoadmap.color }}>{step.title}</h3>
                          <p className="text-sm text-foreground/70 max-w-sm font-mono mt-2 leading-relaxed">
                            {step.desc}
                          </p>
                        </motion.div>
                      </div>

                      {/* Line connector/dot side */}
                      <div className="relative w-12 h-12 flex items-center justify-center z-20">
                        <div className="absolute inset-0 bg-black border-2 rounded-full transition-all group-hover:scale-125" style={{ borderColor: currentRoadmap.color, boxShadow: `0 0 10px ${currentRoadmap.color}44` }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentRoadmap.color, boxShadow: `0 0 15px ${currentRoadmap.color}` }} />
                        
                        {/* Mobile connection line */}
                        <div className="absolute top-12 bottom-[-96px] w-[1px] bg-white/10 md:hidden last:hidden" />
                      </div>

                      {/* Spacer for vertical alignment */}
                      <div className="hidden md:block w-1/2" />
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Start CTA */}
        <div className="mt-32 text-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,255,0.4)' }}
            className="px-12 py-5 bg-transparent border-2 font-black italic tracking-widest text-xl uppercase transition-all"
            style={{ borderColor: currentRoadmap.color, color: currentRoadmap.color }}
          >
            {t('initTraining')}
          </motion.button>
        </div>
      </div>

      {/* Background Decorative Tech */}
      <div className="absolute top-0 right-0 p-12 text-[#00FFFF]/5 text-[80px] font-black -z-0 select-none">ROADMAP</div>
      <div className="absolute bottom-0 left-0 p-12 text-[#39FF14]/5 text-[80px] font-black -z-0 select-none rotate-90">CAREER</div>
    </section>
  );
};

export default Roadmap;
