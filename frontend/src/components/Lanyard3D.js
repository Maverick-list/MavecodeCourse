import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';

// Interactive CSS 3D Lanyard Card with Enhanced Physics
const Lanyard3D = () => {
    const [profile, setProfile] = useState({ name: 'User', photoUrl: '' });
    const cardRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Position for drag
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Rotation based on position
    const rotateX = useTransform(y, [-150, 150], [25, -25]);
    const rotateY = useTransform(x, [-150, 150], [-25, 25]);

    // Spring physics for smooth movement
    const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.5 });
    const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

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

    // Natural pendulum swing when not dragging
    useEffect(() => {
        if (isDragging) return;

        const interval = setInterval(() => {
            const time = Date.now() / 1000;
            const newSwing = Math.sin(time * 1.2) * 6 + Math.sin(time * 0.7) * 3;
            setSwing(newSwing);
        }, 16);

        return () => clearInterval(interval);
    }, [isDragging]);

    // Bounce back animation when released
    const handleDragEnd = () => {
        setIsDragging(false);
        // Bounce back to center with spring physics
        animate(x, 0, { type: 'spring', stiffness: 300, damping: 10, mass: 0.8 });
        animate(y, 0, { type: 'spring', stiffness: 300, damping: 10, mass: 0.8 });
    };

    return (
        <div className="w-full h-[420px] flex flex-col items-center justify-start select-none"
            style={{ perspective: '1000px' }}>

            {/* Fixed anchor point */}
            <div className="w-4 h-4 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full shadow-lg border-2 border-zinc-500 z-10" />

            {/* Rope/Strap - animates with card */}
            <motion.div
                className="relative"
                style={{
                    rotateZ: isDragging ? springRotateY : swing,
                    transformOrigin: 'top center',
                }}
            >
                {/* Main strap */}
                <motion.div
                    className="w-3 bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 mx-auto rounded-sm shadow-lg relative overflow-hidden"
                    style={{
                        height: 70,
                        x: useTransform(springX, v => v * 0.3),
                    }}
                >
                    {/* Strap texture */}
                    <div className="absolute inset-0 opacity-30">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-full h-1 bg-white/20 mb-1" />
                        ))}
                    </div>
                </motion.div>

                {/* Clip */}
                <motion.div
                    className="w-10 h-4 bg-gradient-to-b from-zinc-400 to-zinc-600 mx-auto rounded-sm shadow-md -mt-1 flex items-center justify-center"
                    style={{ x: useTransform(springX, v => v * 0.3) }}
                >
                    <div className="w-4 h-2 bg-zinc-700 rounded-sm" />
                </motion.div>

                {/* Card */}
                <motion.div
                    ref={cardRef}
                    drag
                    dragConstraints={{ left: -200, right: 200, top: -150, bottom: 150 }}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    style={{
                        x: springX,
                        y: springY,
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                        rotateZ: swing,
                        transformStyle: 'preserve-3d',
                    }}

                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                    className="relative w-48 h-64 cursor-grab mt-1"
                >
                    {/* Card Front */}
                    <div
                        className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl backface-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #0a1628 0%, #0f172a 50%, #1a1a2e 100%)',
                            border: '2px solid rgba(0, 255, 255, 0.4)',
                            boxShadow: `
                                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                                0 0 40px rgba(0, 255, 255, 0.15),
                                inset 0 0 30px rgba(0, 255, 255, 0.05)
                            `,
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {/* Holographic effect */}
                        <div
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, transparent 20%, rgba(0,255,255,0.2) 40%, rgba(57,255,20,0.2) 60%, transparent 80%)',
                            }}
                        />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                            {/* Photo */}
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-cyan-400/40 rounded-full blur-lg animate-pulse" />
                                <img
                                    src={profile.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                                    alt={profile.name}
                                    className="w-20 h-20 rounded-full object-cover border-3 border-cyan-400 relative z-10 bg-slate-800"
                                    style={{ borderWidth: '3px' }}
                                />
                            </div>

                            {/* Name */}
                            <h3 className="text-white font-bold text-xl tracking-wider text-center uppercase mb-1">
                                {profile.name}
                            </h3>

                            {/* Role */}
                            <p className="text-cyan-400 text-[10px] font-mono tracking-[0.2em]">
                                MAVECODE STUDENT
                            </p>

                            {/* Divider */}
                            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-4" />

                            {/* Logo */}
                            <div className="text-center">
                                <span className="text-cyan-400 font-black text-sm tracking-widest">MAVE</span>
                                <span className="text-green-400 font-black text-sm tracking-widest">CODE</span>
                            </div>

                            {/* QR Code */}
                            <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/10 rounded border border-white/20 p-1">
                                <div className="w-full h-full grid grid-cols-4 gap-0.5">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className={`bg-white ${Math.random() > 0.4 ? 'opacity-80' : 'opacity-20'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* ID Number */}
                            <div className="absolute bottom-3 left-3 text-[8px] text-white/40 font-mono">
                                ID: 2026-{Math.floor(Math.random() * 9000 + 1000)}
                            </div>
                        </div>
                    </div>

                    {/* Card Back */}
                    <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%)',
                            border: '2px solid rgba(57, 255, 20, 0.3)',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="w-full h-8 bg-zinc-800 mb-4" />
                            <div className="text-white/50 text-xs text-center">
                                Scan QR for verification
                            </div>
                            <div className="mt-4 w-20 h-20 bg-white/10 rounded" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Instruction */}
            <p className="text-center text-[10px] text-muted-foreground mt-4 opacity-60">
                Tarik kartu ke segala arah ↕️↔️
            </p>
        </div>
    );
};

export default Lanyard3D;
