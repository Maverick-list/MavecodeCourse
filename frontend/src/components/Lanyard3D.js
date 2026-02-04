import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Interactive CSS 3D Lanyard Card (no Three.js)
const Lanyard3D = () => {
    const [profile, setProfile] = useState({ name: 'User', photoUrl: '' });
    const cardRef = useRef(null);

    // Mouse position for 3D effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animations
    const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 300, damping: 30 });

    // Swing animation
    const [swing, setSwing] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('mavecode_profile');
        if (saved) {
            const data = JSON.parse(saved);
            setProfile({
                name: data.firstName || 'User',
                photoUrl: data.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName || 'User'}`
            });
        }
    }, []);

    // Pendulum swing effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSwing(s => Math.sin(Date.now() / 1000) * 8);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="w-full h-[380px] flex flex-col items-center justify-start perspective-1000">
            {/* Lanyard Strap */}
            <div className="relative">
                {/* Top attachment point */}
                <div className="w-4 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full mx-auto mb-0 shadow-lg border border-gray-500" />

                {/* Strap */}
                <motion.div
                    className="w-3 bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 mx-auto rounded-sm shadow-lg"
                    style={{
                        height: 60,
                        rotateZ: swing,
                        transformOrigin: 'top center'
                    }}
                />

                {/* Clip */}
                <motion.div
                    className="w-8 h-3 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto rounded-sm shadow-md -mt-1"
                    style={{ rotateZ: swing, transformOrigin: 'top center' }}
                />
            </div>

            {/* Card */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    rotateZ: swing,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'top center'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-44 h-56 cursor-grab active:cursor-grabbing"
            >
                {/* Card Front */}
                <div
                    className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
                        backfaceVisibility: 'hidden',
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 255, 255, 0.25), 0 0 30px rgba(0, 255, 255, 0.1)'
                    }}
                >
                    {/* Holographic overlay */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: 'linear-gradient(135deg, transparent 0%, rgba(0,255,255,0.3) 50%, transparent 100%)',
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                        {/* Photo */}
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md animate-pulse" />
                            <img
                                src={profile.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                                alt={profile.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 relative z-10 bg-slate-800"
                            />
                        </div>

                        {/* Name */}
                        <h3 className="text-white font-bold text-lg tracking-wide text-center uppercase">
                            {profile.name}
                        </h3>

                        {/* Role */}
                        <p className="text-cyan-400 text-[10px] font-mono tracking-widest mt-1">
                            MAVECODE STUDENT
                        </p>

                        {/* Divider */}
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-3" />

                        {/* Logo */}
                        <div className="text-center">
                            <span className="text-cyan-400 font-black text-xs tracking-widest">MAVE</span>
                            <span className="text-green-400 font-black text-xs tracking-widest">CODE</span>
                        </div>

                        {/* QR placeholder */}
                        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                            <div className="w-5 h-5 grid grid-cols-3 gap-px">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className={`bg-white/50 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-30'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Back (visible when rotated) */}
                <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        border: '1px solid rgba(57, 255, 20, 0.3)',
                    }}
                />
            </motion.div>

            {/* Instruction */}
            <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-60">
                Hover untuk interaksi 3D ↔️
            </p>
        </div>
    );
};

export default Lanyard3D;
