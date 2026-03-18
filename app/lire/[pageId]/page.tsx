"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Typewriter from '@/components/Typewriter'; 

const allPagesData: Record<number, {
  overlayMask?: string;
  bgm?: string; 
  simultaneous?: boolean; 
  panels: {
    id: number;
    textJp?: string;
    textFr?: string;
    layout: string;
    image?: string;
    onomatopoeia?: string;
    onoStyle?: string;
    bubbleStyle?: string;
    sfx?: string; 
    voice?: string; 
    sfxChain?: string[]; 
  }[];
}> = {
  1: {
    overlayMask: "/1_ligne.png",
    bgm: "/audio/konoha.mp3",
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full", image: "/1_1.png" },
      { id: 2, layout: "absolute inset-0 w-full h-full", image: "/1_2.png", textFr: "Enfin... “Delon - Sama “ m'a donné ma première vraie SAE , je vais lui montrer de quoi je suis capable..", bubbleStyle: "bottom-[3%] left-[2%]", voice: "/audio/itachi-voice.mp3" },
    ],
  },
  2: {
    overlayMask: "/2_ligne.png",
    bgm: "/audio/akatsuki.mp3",
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full", image: "/2_1.png", onomatopoeia: "/ono.png", onoStyle: "right-[2%] top-[2%] w-[20%]", sfx: "/audio/yooo.mp3" },
      { id: 2, layout: "absolute inset-0 w-full h-full", image: "/2_2.png", textJp: "ラファマル、貴重なものをください！", textFr: "Donne-nous le Rouleau des commandes Dockers Rafamaru !", bubbleStyle: "bottom-[3%] right-[2%] left-auto", voice: "/audio/pain-jiraiya-sensei.mp3" },
      { id: 3, layout: "absolute inset-0 w-full h-full", image: "/2_3.png", textJp: "7対1？それだけ？S3を取ったばかりだ、お前らなんか怖くない！", textFr: "C'est tout ce que vous avez ? Je viens de valider mon S3, vous ne me faites pas peur ! SharinCode !!!", bubbleStyle: "bottom-[3%] left-[2%]", sfxChain: ["/audio/itachi-voice.mp3", "/audio/sharingan2.mp3"] },
    ],
  },
  3: {
    overlayMask: "/3_ligne.png",
    bgm: "/audio/ikari.mp3", // <-- AJOUT DE LA MUSIQUE ICI
    simultaneous: true,
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full z-0", image: "/3_fond.png" },
      { id: 2, layout: "absolute inset-0 w-full h-full z-10 mix-blend-screen", image: "/3_anim.gif" },
      { 
        id: 3, 
        layout: "absolute inset-0 w-full h-full z-20", 
        image: "/3_1.png",
        textJp: "悪いな、今朝フルスタックアプリを完成させたところだ。お前らはただの準備運動にすぎない。",
        textFr: "Désolé les gars, j'ai fini mon app fullstack ce matin. Vous serez juste mon échauffement.",
        bubbleStyle: "bottom-[5%] left-[5%] max-w-[60%]"
      },
    ],
  },
};
const TOTAL_PAGES = 6;

function smoothVolume(audio: HTMLAudioElement, target: number, duration: number = 500) {
  const start = audio.volume;
  const diff = target - start;
  if (diff === 0) return;
  const steps = 30;
  let currentStep = 0;
  const stepTime = duration / steps;
  const interval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(0, Math.min(1, start + (diff * (currentStep / steps))));
    if (currentStep >= steps) {
      audio.volume = target;
      clearInterval(interval);
    }
  }, stepTime);
}

export default function ComicPage() {
  const params = useParams();
  const currentPage = parseInt(params.pageId as string, 10) || 1;

  const currentPageData = allPagesData[currentPage] ?? allPagesData[1];
  const pageData = currentPageData.panels;

  const [visiblePanels, setVisiblePanels] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const startBgm = () => {
    if (!currentPageData.bgm || bgmRef.current) return;
    const bgm = new Audio(currentPageData.bgm);
    bgm.loop = true;
    bgm.volume = 0.75;
    bgm.play().catch(e => console.log("BGM Error:", e));
    bgmRef.current = bgm;
  };

  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, [currentPage]);

  const handleNextPanel = () => {
    if (isLocked) return;

    if (visiblePanels < pageData.length) {
      startBgm();

      const nextPanel = pageData[visiblePanels];

      if (nextPanel.sfx) {
        const sfx = new Audio(nextPanel.sfx);
        sfx.volume = 1.0;
        sfx.play().catch(e => console.log("SFX Error:", e));
      }

      if (nextPanel.voice && bgmRef.current) {
        const bgm = bgmRef.current;
        smoothVolume(bgm, 0.3, 500);
        const voice = new Audio(nextPanel.voice);
        voice.volume = 1.0;
        voice.play().catch(e => console.log("Voice Error:", e));
        voice.onended = () => {
          smoothVolume(bgm, 0.75, 500);
        };
      }

      if (nextPanel.sfxChain && nextPanel.sfxChain.length > 0) {
        if (bgmRef.current) smoothVolume(bgmRef.current, 0.3, 500);

        const playNextSound = (index: number) => {
          if (index >= nextPanel.sfxChain!.length) {
            if (bgmRef.current) smoothVolume(bgmRef.current, 0.75, 500);
            return;
          }

          const audio = new Audio(nextPanel.sfxChain![index]);
          audio.volume = 1.0;
          audio.play().catch(e => console.log("SFX Chain Error:", e));

          audio.onended = () => {
            if (nextPanel.id === 3 && index === 0) {
              setTimeout(() => {
                playNextSound(index + 1);
              }, 800);
            } else {
              playNextSound(index + 1);
            }
          };
        };

        playNextSound(0);
      }

      setIsLocked(true);
      
      if (currentPageData.simultaneous) {
        setVisiblePanels(pageData.length);
      } else {
        setVisiblePanels(prev => prev + 1);
      }

      setTimeout(() => {
        setIsLocked(false);
      }, 1500);
    }
  };

  const hasMask = !!currentPageData.overlayMask;

  return (
    <div className="min-h-screen bg-neutral-900 p-4 md:p-8 flex flex-col items-center justify-between">
      
      <div 
        className={`w-full max-w-5xl flex-grow flex flex-col items-center justify-center mb-8 ${isLocked ? 'cursor-wait' : 'cursor-pointer'}`}
        onClick={handleNextPanel}
      >
        {hasMask ? (
          <div className="relative w-full aspect-video bg-black shadow-2xl overflow-hidden">
            
            <img
              src={currentPageData.overlayMask}
              alt="Lignes du panel"
              className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none"
            />

            <div className="absolute inset-0 z-10 w-full h-full">
              <AnimatePresence>
                {pageData.map((panel, index) => (
                  index < visiblePanels && (
                    <motion.div 
                      key={panel.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={panel.layout}
                    >
                      {panel.image && (
                        <img 
                          src={panel.image} 
                          alt={`Case ${panel.id}`} 
                          className="w-full h-full object-cover" 
                        />
                      )}

                      {panel.onomatopoeia && (
                        <motion.img
                          src={panel.onomatopoeia}
                          alt="SFX"
                          initial={{ opacity: 0, scale: 3, rotate: -8 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className={`absolute z-40 h-auto pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] ${panel.onoStyle || 'inset-0 m-auto w-[40%]'}`}
                        />
                      )}

                      {(panel.textJp || panel.textFr) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className={`absolute z-40 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-bold max-w-[40%] min-h-[3.5rem] shadow-md ${panel.bubbleStyle || 'bottom-4 left-4'}`}
                        >
                          <Typewriter 
                            textJp={panel.textJp || ""} 
                            textFr={panel.textFr || ""} 
                            speed={40} 
                            decodeDelay={800} 
                            startDelay={500} 
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white p-2 gap-2 grid grid-cols-2 shadow-2xl">
            <AnimatePresence>
              {pageData.map((panel, index) => (
                index < visiblePanels && (
                  <motion.div 
                    key={panel.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`relative bg-black flex items-center justify-center overflow-hidden ${panel.layout}`}
                  >
                    {panel.image ? (
                      <img src={panel.image} alt={`Case ${panel.id}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/20 font-bold text-4xl">CASE {panel.id}</span>
                    )}
                    
                    {(panel.textJp || panel.textFr) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute bottom-4 left-4 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-bold max-w-[80%] min-h-[3.5rem] shadow-md"
                      >
                        <Typewriter 
                          textJp={panel.textJp || ""} 
                          textFr={panel.textFr || ""} 
                          speed={40} 
                          decodeDelay={800} 
                          startDelay={500} 
                        />
                      </motion.div>
                    )}
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

      <div className="w-full max-w-5xl flex items-center justify-between mt-auto pt-4 border-t border-neutral-700">
        {currentPage > 1 ? (
          <Link 
            href={`/lire/${currentPage - 1}`}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded transition-colors"
          >
            ← Précédent
          </Link>
        ) : (
          <div></div>
        )}

        <div className="text-neutral-500 font-medium">
          Page {currentPage} / {TOTAL_PAGES}
        </div>

        {currentPage < TOTAL_PAGES ? (
          <Link 
            href={`/lire/${currentPage + 1}`}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded transition-colors"
          >
            Suivant →
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}