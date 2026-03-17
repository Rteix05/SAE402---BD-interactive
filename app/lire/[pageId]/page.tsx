"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'; // Import du composant Link de Next.js
import Typewriter from '@/components/Typewriter'; 

// Données par page : chaque page a ses propres cases, images et fond
const allPagesData: Record<number, {
  // Mode "overlay" : image de fond + masque PNG par-dessus (pour les pages avec découpage)
  overlay?: { backgroundImage: string; maskImage: string };
  panels: {
    id: number;
    textJp: string;
    textFr: string;
    layout: string;
    // Position de la bulle de texte en mode overlay (en %)
    bubblePosition?: { bottom: string; left: string };
  }[];
}> = {
  1: {
    panels: [
      { id: 1, textJp: "７つのTC…必ず見つけ出す！", textFr: "Les 7 TC... Je les retrouverai !", layout: "col-span-2 h-64" },
      { id: 2, textJp: "どんな犠牲を払ってでも。", textFr: "Quoi qu'il en coûte.", layout: "col-span-1 h-80" },
      { id: 3, textJp: "アヒルのチャクラを使ってでもな。", textFr: "Même s'il faut utiliser le chakra du canard.", layout: "col-span-1 h-80" },
    ],
  },
  2: {
    overlay: { backgroundImage: "/cover.jpg", maskImage: "/1_ligne.png" },
    panels: [
      { id: 1, textJp: "左の世界…", textFr: "Le monde à gauche…", layout: "", bubblePosition: { bottom: "8%", left: "5%" } },
      { id: 2, textJp: "右の世界…", textFr: "Le monde à droite…", layout: "", bubblePosition: { bottom: "8%", left: "55%" } },
    ],
  },
};

const TOTAL_PAGES = 6;

export default function ComicPage() {
  // On récupère le numéro de la page actuelle depuis l'URL et on le transforme en nombre
  const params = useParams();
  const currentPage = parseInt(params.pageId as string, 10) || 1;

  const currentPageData = allPagesData[currentPage] ?? allPagesData[1];
  const pageData = currentPageData.panels;

  const [visiblePanels, setVisiblePanels] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleNextPanel = () => {
    if (isLocked) return;

    if (visiblePanels < pageData.length) {
      setIsLocked(true);
      setVisiblePanels(prev => prev + 1);

      setTimeout(() => {
        setIsLocked(false);
      }, 2500);
    }
  };

  // Mode overlay (page avec image de fond + masque)
  const isOverlay = !!currentPageData.overlay;

  return (
    <div 
      className="min-h-screen bg-neutral-900 p-4 md:p-8 flex flex-col items-center justify-between"
    >
      {/* Zone principale de la BD cliquable */}
      <div 
        className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center mb-8 cursor-pointer"
        onClick={handleNextPanel}
      >
        {isOverlay ? (
          /* === MODE OVERLAY : cover.jpg en fond, 1_ligne.png par-dessus === */
          <div className="relative w-full shadow-2xl" style={{ aspectRatio: '16/9' }}>
            {/* Couche 1 : image de fond (cover.jpg) */}
            <img
              src={currentPageData.overlay!.backgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Couche 2 : masque/cadre (1_ligne.png) par-dessus */}
            <img
              src={currentPageData.overlay!.maskImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
            {/* Couche 3 : bulles de texte */}
            <AnimatePresence>
              {pageData.map((panel, index) => (
                index < visiblePanels && (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute z-20 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-bold max-w-[40%] min-h-[3.5rem] shadow-md"
                    style={{
                      bottom: panel.bubblePosition?.bottom ?? '8%',
                      left: panel.bubblePosition?.left ?? '5%',
                    }}
                  >
                    <Typewriter textJp={panel.textJp} textFr={panel.textFr} speed={40} decodeDelay={800} startDelay={500} />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* === MODE CASES CLASSIQUE === */
          <div className="w-full bg-white p-2 gap-2 grid grid-cols-2 shadow-2xl">
            <AnimatePresence>
              {pageData.map((panel, index) => (
                index < visiblePanels && (
                  <motion.div 
                    key={panel.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`relative bg-black border-2 border-black flex items-center justify-center overflow-hidden ${panel.layout}`}
                  >
                    <span className="text-white/20 font-bold text-4xl">CASE {panel.id}</span>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute bottom-4 left-4 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-bold max-w-[80%] min-h-[3.5rem] shadow-md"
                    >
                      <Typewriter textJp={panel.textJp} textFr={panel.textFr} speed={40} decodeDelay={800} startDelay={500} />
                    </motion.div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {pageData.map((panel, index) => (
                index >= visiblePanels && (
                  <div key={`empty-${panel.id}`} className={`bg-neutral-800 ${panel.layout}`}></div>
                )
            ))}
          </div>
        )}

        {visiblePanels === 0 && (
          <p className="text-white/50 mt-8 animate-pulse text-lg font-semibold">
            Cliquez sur la zone pour faire apparaître la première case...
          </p>
        )}
      </div>

      {/* Barre de navigation des pages */}
      <div className="w-full max-w-5xl flex items-center justify-between mt-auto pt-4 border-t border-neutral-700">
        
        {/* Bouton Précédent (Caché sur la page 1) */}
        {currentPage > 1 ? (
          <Link 
            href={`/lire/${currentPage - 1}`}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded transition-colors"
          >
            ← Précédent
          </Link>
        ) : (
          <div></div> // Espace vide pour garder le bouton Suivant à droite
        )}

        <div className="text-neutral-500 font-medium">
          Page {currentPage} / {TOTAL_PAGES}
        </div>

        {/* Bouton Suivant (Caché sur la dernière page) */}
        {currentPage < TOTAL_PAGES ? (
          <Link 
            href={`/lire/${currentPage + 1}`}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded transition-colors"
          >
            Suivant →
          </Link>
        ) : (
          <div></div> // Espace vide pour garder l'équilibre
        )}
        
      </div>
    </div>
  );
}