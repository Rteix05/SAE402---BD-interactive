"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from '@/components/Typewriter'; 

const pageData = [
  { id: 1, text: "Les 7 TC... Je les retrouverai !", layout: "col-span-2 h-64" }, 
  { id: 2, text: "Quoi qu'il en coûte.", layout: "col-span-1 h-80" }, 
  { id: 3, text: "Même s'il faut utiliser le chakra du canard.", layout: "col-span-1 h-80" },
];

export default function ComicPage() {
  const [visiblePanels, setVisiblePanels] = useState<number>(0);

  const handleNextPanel = () => {
    if (visiblePanels < pageData.length) {
      setVisiblePanels(prev => prev + 1);
    }
  };

  return (
    <div 
      className="min-h-screen bg-neutral-900 p-4 md:p-8 cursor-pointer flex flex-col items-center justify-center"
      onClick={handleNextPanel}
    >
      <div className="w-full max-w-5xl bg-white p-2 gap-2 grid grid-cols-2 shadow-2xl">
        
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
                  {/* On passe le texte. Vitesse de 40ms/lettre, transformation après 500ms */}
                  <Typewriter text={panel.text} speed={40} decodeDelay={500} />
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

      {visiblePanels === 0 && (
        <p className="text-white/50 mt-8 animate-pulse text-lg font-semibold">
          Cliquez n'importe où pour faire apparaître la première case...
        </p>
      )}
    </div>
  );
}