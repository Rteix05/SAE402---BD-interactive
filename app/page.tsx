"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';

// --- VARIANTS D'ANIMATION ---

const cloudRevealVariants = {
    initial: (i: number) => ({
        opacity: 0,
        scale: 2.5,
        x: "-50%",
        y: "-50%",
        top: "50%",
        left: i === 0 ? "40%" : "60%",
    }),
    animate: (i: number) => ({
        opacity: [0, 1, 1],
        scale: 4,
        x: i === 0 ? "-600%" : "500%",
        transition: {
            duration: 3.5,
            delay: 0.1,
            ease: "easeInOut" as const,
        },
    }),
};

const cloudDriftVariants = {
    animate: (custom: number): TargetAndTransition => ({
        x: ['-20vw', '120vw'],
        transition: {
            duration: custom % 2 === 0 ? 85 : 110,
            delay: custom * 2,
            repeat: Infinity,
            ease: "linear" as const,
        },
    }),
};

export default function Home() {
    const [phase, setPhase] = useState<'intro' | 'transition' | 'main'>('intro');

    const startSequence = () => {
        if (phase === 'intro') {
            setPhase('transition');
            setTimeout(() => setPhase('main'), 2000);
        }
    };

    // Fonction pour scroller directement au guide
    const scrollToGuide = (e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche de déclencher d'autres clics
        const element = document.getElementById('guide');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main
            className={`relative w-full min-h-screen bg-black transition-all duration-1000 ${phase === 'main' ? 'overflow-y-auto' : 'overflow-hidden'}`}
            onClick={startSequence}
        >
            <style jsx global>{`
                @font-face {
                    font-family: 'Manga Temple';
                    src: url('/font/mangati.ttf') format('truetype');
                }
                .font-manga { font-family: 'Manga Temple', sans-serif; }
                html { scroll-behavior: smooth; }
            `}</style>

            {/* --- SECTION 1 : LA COVER --- */}
            <section className="relative w-full h-screen overflow-hidden">

                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase !== 'intro' ? 1 : 0 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                >
                    <Image
                        src="/cover.jpg"
                        alt="Rafamaru Cover"
                        fill
                        priority
                        className="object-cover object-top"
                    />

                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={`drift-${i}`}
                                className="absolute w-80 h-40 bg-contain bg-no-repeat bg-center opacity-20"
                                style={{
                                    top: `${10 + (i * 12)}%`,
                                    backgroundImage: `url(${i % 2 === 0 ? '/cloud.png' : '/bcloud.png'})`,
                                }}
                                custom={i}
                                variants={cloudDriftVariants}
                                animate="animate"
                            />
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {phase === 'intro' && (
                        <motion.div
                            key="intro-black"
                            className="absolute inset-0 z-[60] bg-black flex items-center justify-center"
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.p
                                className="text-white text-3xl md:text-5xl tracking-[0.2em] font-manga text-center px-8"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                CLIQUER POUR ENTRER
                            </motion.p>
                        </motion.div>
                    )}

                    {phase === 'transition' && (
                        <motion.div key="transition-layer" className="absolute inset-0 z-50 pointer-events-none">
                            {[...Array(2)].map((_, i) => (
                                <motion.div
                                    key={`reveal-cloud-${i}`}
                                    className="absolute w-[600px] h-[300px] bg-contain bg-no-repeat bg-center"
                                    style={{ backgroundImage: "url('/cloud.png')" }}
                                    custom={i}
                                    variants={cloudRevealVariants}
                                    initial="initial"
                                    animate="animate"
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- LE BOUTON DE SCROLL CLIQUABLE (DÉCALÉ À GAUCHE) --- */}
                <AnimatePresence>
                    {phase === 'main' && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            // Décalage vers la gauche augmenté (right-32 ou right-48)
                            className="absolute top-12 right-24 md:right-158 z-30 flex flex-col items-center gap-2 cursor-pointer group"
                            onClick={scrollToGuide}
                        >
                            <motion.div
                                className="bg-red-600 text-white font-manga px-6 py-3 text-2xl shadow-[0_0_20px_rgba(220,38,38,0.8)] border-2 border-white transition-colors group-hover:bg-white group-hover:text-red-600 group-hover:border-red-600"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                SCROLLER POUR LIRE
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,1)] group-hover:scale-125 transition-transform"
                            >
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* --- SECTION 2 : GUIDE DE LECTURE (AVEC ID POUR LE SCROLL) --- */}
            <section id="guide" className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center p-8 md:p-24 border-t-4 border-red-600">
                <motion.div
                    className="max-w-4xl w-full border-t border-b border-white/10 py-16 px-8 relative bg-zinc-950/80 shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1 }}
                >
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-600"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-600"></div>

                    <h2 className="text-white text-6xl md:text-8xl font-manga mb-12 text-center tracking-tighter">
                        GUIDE DE LECTURE
                    </h2>

                    <p className="text-gray-200 text-2xl md:text-3xl leading-relaxed text-center uppercase tracking-widest mb-16 max-w-3xl mx-auto font-sans">
                        Utilisez les flèches directionnelles pour naviguer.
                        Le sens de lecture est de gauche à droite.
                        Cliquez sur les bords de l'écran pour tourner les pages.
                    </p>

                    <div className="flex justify-center">
                        <Link href="/lire/1">
                            <motion.button
                                className="px-16 py-6 bg-red-600 text-white text-4xl font-manga shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]"
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    boxShadow: '10px 10px 0px 0px rgba(220,38,38,1)'
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                COMMENCER L'HISTOIRE
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-24 w-full flex justify-end">
                    <div className="text-right border-r-4 border-red-600 pr-5 py-2">
                        <h3 className="text-white font-manga text-2xl mb-1 tracking-tight">CRÉDITS</h3>
                        <div className="text-gray-400 text-sm uppercase tracking-wider font-sans">
                            <p>Scénario & Dessin : <span className="text-gray-100">LOU CALMES - MARWAN BOUCHEBBAT</span></p>
                            <p>Développement : <span className="text-gray-100">RAFAEL TEXIERA - OURIRI RADOUAN</span></p>
                            <p>© 2026 TOUS DROITS RÉSERVÉS</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
