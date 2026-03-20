"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Credits() {
    return (
        <main className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-red-600">
            {/* EFFET DE GRAIN / TEXTURE MANGA */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-8 py-20">

                {/* TITRE PRINCIPAL STYLE JAPONAIS */}
                <motion.div
                    className="flex flex-col items-center mb-24"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-7xl md:text-9xl font-manga text-red-600 tracking-tighter">CRÉDITS</h1>
                  
                </motion.div>

                {/* GRILLE DES RÔLES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12">

                    {/* SECTION VISUELLE - LE PHOTOMONTAGE */}
                    <motion.section
                        className="space-y-6 border-l-2 border-red-600 pl-8"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-manga text-white italic">VISUELS & PHOTOGRAPHIE</h2>
                        <div className="space-y-4 text-gray-400 uppercase tracking-widest text-sm md:text-base leading-relaxed">
                            <p><span className="text-red-500 font-bold">Concept :</span> Basé sur l'univers de <span className="text-white">Naruto (Masashi Kishimoto)</span></p>
                            <p><span className="text-red-500 font-bold">Photographie :</span> Prises de vues réelles réalisées par nos soins</p>
                            <p><span className="text-red-500 font-bold">Post-Production :</span> Photomontage & Édition avancée via <span className="text-blue-400">Adobe Photoshop</span></p>
                            <p className="text-xs italic lowercase opacity-60">Chaque décor et personnage a été méticuleusement intégré pour fusionner le réel et la fiction.</p>
                        </div>
                    </motion.section>

                    {/* SECTION AUDIO - SOUND DESIGN */}
                    <motion.section
                        className="space-y-6 border-l-2 border-white/20 pl-8"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-manga text-white italic">SOUND DESIGN</h2>
                        <div className="space-y-4 text-gray-400 uppercase tracking-widest text-sm md:text-base leading-relaxed">
                            <p><span className="text-red-500 font-bold">Samples :</span> Tirés de l'animé original</p>
                            <p><span className="text-red-500 font-bold">Onomatopées :</span> Créations sonores & mixage maison</p>
                            <p><span className="text-red-500 font-bold">Ambiance :</span> Réalisation originale pour l'immersion BD</p>
                        </div>
                    </motion.section>

                    {/* SECTION DOUBLAGE - LES VOIX */}
                    <motion.section
                        className="md:col-span-2 space-y-8 bg-zinc-900/30 p-10 border border-white/5 relative"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute -top-4 left-10 bg-red-600 px-4 py-1 font-manga text-xl">CASTING VOIX</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                            {[
                                "Rafael Texiera",
                                "Jeremy Hordé",
                                "Emmanuel Etsion",
                                "Lucas Correiras"
                            ].map((name, index) => (
                                <div key={index} className="flex flex-col items-center md:items-start">
                                    <span className="text-white font-bold tracking-tighter text-xl">{name}</span>
                                    <span className="text-red-600 text-xs font-manga">VOICE ACTOR</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                </div>

                {/* FOOTER & RETOUR */}
                <div className="mt-32 flex flex-col items-center gap-12">
                    <Link href="/">
                        <motion.button
                            className="relative px-16 py-5 border-2 border-white font-manga text-2xl group overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 group-hover:text-black transition-colors duration-300">RETOUR AU VILLAGE</span>
                            <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></div>
                        </motion.button>
                    </Link>

                    <p className="text-gray-600 text-[10px] tracking-[0.5em] uppercase">
                        © 2026 Rafamaru Project - Naruto Fanwork
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @font-face {
                    font-family: 'Manga Temple';
                    src: url('/font/mangati.ttf') format('truetype');
                }
                .font-manga { font-family: 'Manga Temple', sans-serif; }
            `}</style>
        </main>
    );
}