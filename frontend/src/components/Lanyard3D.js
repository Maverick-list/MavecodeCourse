import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, RoundedBox, useCursor } from '@react-three/drei';
import * as THREE from 'three';

// Lanyard Card Component
const LanyardCard = ({ name, photoUrl, onDrag }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });

    useCursor(hovered);

    // Physics simulation
    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Pendulum swing
        if (!dragging) {
            const swing = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
            targetRotation.current.x = swing;
            targetRotation.current.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
        }

        // Smooth interpolation
        meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.1;

        // Damping
        setVelocity(v => ({ x: v.x * 0.95, y: v.y * 0.95 }));
    });

    const handlePointerDown = (e) => {
        e.stopPropagation();
        setDragging(true);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = (e) => {
        setDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (dragging) {
            targetRotation.current.x += e.movementY * 0.01;
            targetRotation.current.y += e.movementX * 0.01;
            targetRotation.current.x = Math.max(-0.5, Math.min(0.5, targetRotation.current.x));
            targetRotation.current.y = Math.max(-0.5, Math.min(0.5, targetRotation.current.y));
        }
    };

    // Get first name only
    const firstName = name?.split(' ')[0] || 'User';

    return (
        <group position={[0, 0, 0]}>
            {/* Lanyard Strap */}
            <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[0.15, 1, 0.02]} />
                <meshStandardMaterial color="#00FFFF" />
            </mesh>

            {/* Clip */}
            <mesh position={[0, 1.7, 0]}>
                <boxGeometry args={[0.3, 0.15, 0.05]} />
                <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Card */}
            <group
                ref={meshRef}
                position={[0, 0.5, 0]}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => { setHovered(false); setDragging(false); }}
            >
                {/* Card Front */}
                <RoundedBox args={[1.8, 2.4, 0.08]} radius={0.1} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a1a2e" />
                </RoundedBox>

                {/* Gradient overlay */}
                <mesh position={[0, -0.8, 0.045]}>
                    <planeGeometry args={[1.7, 0.8]} />
                    <meshBasicMaterial color="#00FFFF" opacity={0.15} transparent />
                </mesh>

                {/* Photo placeholder */}
                <mesh position={[0, 0.4, 0.05]}>
                    <circleGeometry args={[0.5, 32]} />
                    <meshBasicMaterial color="#00FFFF" opacity={0.3} transparent />
                </mesh>

                {/* Name */}
                <Text
                    position={[0, -0.4, 0.05]}
                    fontSize={0.22}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/Inter-Bold.woff"
                >
                    {firstName}
                </Text>

                {/* Role */}
                <Text
                    position={[0, -0.7, 0.05]}
                    fontSize={0.12}
                    color="#00FFFF"
                    anchorX="center"
                    anchorY="middle"
                >
                    MAVECODE STUDENT
                </Text>

                {/* Logo placeholder */}
                <Text
                    position={[0, -1, 0.05]}
                    fontSize={0.1}
                    color="#39FF14"
                    anchorX="center"
                >
                    MAVECODE
                </Text>

                {/* Card Back */}
                <RoundedBox args={[1.8, 2.4, 0.08]} radius={0.1} position={[0, 0, -0.09]}>
                    <meshStandardMaterial color="#0f0f1a" />
                </RoundedBox>
            </group>
        </group>
    );
};

// Main Lanyard3D Component
const Lanyard3D = ({ name = 'User', photoUrl }) => {
    const [profile, setProfile] = useState({ name, photoUrl });

    useEffect(() => {
        const saved = localStorage.getItem('mavecode_profile');
        if (saved) {
            const data = JSON.parse(saved);
            setProfile({
                name: data.firstName || 'User',
                photoUrl: data.photoUrl
            });
        }
    }, []);

    return (
        <div className="w-full h-[350px] cursor-grab active:cursor-grabbing">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FFFF" />
                <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />

                <Suspense fallback={null}>
                    <LanyardCard name={profile.name} photoUrl={profile.photoUrl} />
                </Suspense>
            </Canvas>
            <p className="text-center text-xs text-muted-foreground mt-2">
                Tarik kartu untuk berinteraksi ↔️
            </p>
        </div>
    );
};

export default Lanyard3D;
