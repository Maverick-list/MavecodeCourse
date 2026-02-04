import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Interactive CSS 3D Lanyard Card
const Lanyard3D = () => {
    const [profile, setProfile] = useState({ name: 'User', photoUrl: '' });
    const cardRef = useRef(null);
    const [swing, setSwing] = useState(0);

    const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

    useEffect(() => {
        const saved = localStorage.getItem('mavecode_profile');
        try {
            if (saved) {
                const data = JSON.parse(saved);
                setProfile({
                    name: data.firstName || 'User',
                    photoUrl: data.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName || 'User'}`
                });
            }
        } catch (e) {
            console.error("Failed to parse profile", e);
        }
    }, []);

    // Pendulum swing effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSwing(Math.sin(Date.now() / 1500) * 5);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / 10;
        const y = (e.clientY - centerY) / 10;
        rotateY.set(x);
        rotateX.set(-y);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <div className="w-full h-[380px] flex flex-col items-center justify-start">
            {/* Lanyard Strap */}
            <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full mx-auto shadow-lg border border-gray-500" />
                <motion.div
                    className="w-3 bg-gradient-to-b from-primary via-primary/50 to-accent mx-auto rounded-sm shadow-lg"
                    style={{ height: 60, rotate: swing, transformOrigin: 'top center' }}
                />
                <motion.div
                    className="w-8 h-3 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto rounded-sm shadow-md -mt-1"
                    style={{ rotate: swing, transformOrigin: 'top center' }}
                />
            </div>

            {/* Card */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, rotate: swing, transformOrigin: 'top center' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-44 h-56 cursor-pointer"
            >
                <div
                    className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 255, 255, 0.25)'
                    }}
                >
                    <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(0,255,255,0.3) 50%, transparent 100%)' }} />

                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse" />
                            <img
                                src={profile.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                                alt={profile.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary relative z-10 bg-slate-800"
                            />
                        </div>

                        <h3 className="text-white font-bold text-lg tracking-wide text-center uppercase truncate w-full">{profile.name}</h3>
                        <p className="text-primary text-[10px] font-mono tracking-widest mt-1">MAVECODE STUDENT</p>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent my-3" />
                        <div className="text-center">
                            <span className="text-primary font-black text-xs tracking-widest">MAVE</span>
                            <span className="text-accent font-black text-xs tracking-widest">CODE</span>
                        </div>

                        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                            <div className="w-5 h-5 grid grid-cols-3 gap-px">
                                {[...Array(9)].map((_, i) => (<div key={i} className="bg-white/50" style={{ opacity: Math.random() > 0.5 ? 1 : 0.3 }} />))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-60 font-mono tracking-tighter">ID: #{Math.floor(Math.random() * 89999 + 10000)}</p>
        </div>
    );
};

export default Lanyard3D;
