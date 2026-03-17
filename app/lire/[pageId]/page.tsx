"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Exemple de structure de données pour une page
const pageData = [
  { id: 1, text: "Watashi wa Rafamaru desu...", audio: "/audio/ch1/voice1.mp3", image: "/images/ch1/panel1.jpg" },
  { id: 2, text: "Iku zo!", audio: "/audio/ch1/voice2.mp3", image: "/images/ch1/panel2.jpg" },
  // ... autres cases
];

export default function ComicPage() {
  // État qui retient combien de cases sont actuellement visibles
  const [visiblePanels, setVisiblePanels] = useState<number>(0);

  const handleNextPanel = () => {
    if (visiblePanels < pageData.length) {
      const nextPanelIndex = visiblePanels;
      
      // 1. On augmente le nombre de cases visibles
      setVisiblePanels(prev => prev + 1);
      
      // 2. On joue l'audio associé à la nouvelle case
      const audio = new Audio(pageData[nextPanelIndex].audio);
      audio.play().catch(e => console.log("L'audio nécessite une interaction préalable de l'utilisateur", e));
    } else {
      // Passer à la page web suivante si toutes les cases sont affichées
      console.log("Aller à la page suivante !");
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-100 p-8 cursor-pointer flex flex-col items-center"
      onClick={handleNextPanel} // Un clic n'importe où fait avancer
    >
      <div className="w-full max-w-3xl space-y-8">
        <AnimatePresence>
          {pageData.slice(0, visiblePanels).map((panel, index) => (
            <motion.div 
              key={panel.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-64 bg-white border-4 border-black shadow-lg flex items-center justify-center"
            >
              {/* Emplacement pour l'image de la case */}
              <p className="text-gray-400">[Case {panel.id} : {panel.image}]</p>
              
              {/* Bulle de texte */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -right-4 -top-4 bg-white border-2 border-black rounded-[2rem] p-4 shadow-md max-w-[200px]"
              >
                {/* Ici on mettra l'effet machine à écrire plus tard */}
                <p className="font-bold">{panel.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visiblePanels === 0 && (
        <p className="text-gray-500 mt-[40vh] animate-pulse text-xl">
          Cliquez pour révéler la première case...
        </p>
      )}
    </div>
  );
}