"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Typewriter from '@/components/Typewriter'; 

// ==========================================
// VARIABLES GLOBALES POUR L'AUDIO
// ==========================================
let globalBgm: HTMLAudioElement | null = null;
let currentBgmSrc: string | null = null;

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
      { id: 2, layout: "absolute inset-0 w-full h-full", image: "/1_2.png", textFr: "Enfin... “Delon - Sama “ m'a donné ma première vraie SAE , je vais lui montrer de quoi je suis capable..", bubbleStyle: "bottom-[3%] left-[2%]", voice: "/audio/raf_1.WAV" },
    ],
  },
  2: {
    overlayMask: "/2_ligne.png",
    bgm: "/audio/akatsuki.mp3",
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full", image: "/2_1.png", onomatopoeia: "/ono.png", onoStyle: "right-[2%] top-[2%] w-[20%]", sfx: "/audio/boss-apparition.mp3" },
      { id: 2, layout: "absolute inset-0 w-full h-full", image: "/2_2.png", textJp: "ラファマル、貴重なものをください！", textFr: "Donne-nous le Rouleau des commandes Dockers Rafamaru !", bubbleStyle: "bottom-[3%] right-[2%] left-auto", voice: "/audio/pain-jiraiya-sensei.mp3" },
      { id: 3, layout: "absolute inset-0 w-full h-full", image: "/2_3.png", textJp: "7対1？それだけ？S3を取ったばかりだ、お前らなんか怖くない！", textFr: "C'est tout ce que vous avez ? Je viens de valider mon S3, vous ne me faites pas peur ! SharinCode !!!", bubbleStyle: "bottom-[3%] left-[2%]", sfxChain: ["/audio/raf_2.WAV", "/audio/sharingan.mp3"] },
    ],
  },
  3: {
    overlayMask: "/3_ligne.png",
    bgm: "/audio/ikari.mp3",
    simultaneous: true,
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full z-0", image: "/3_fond.png" },
      { id: 2, layout: "absolute inset-0 w-full h-full z-10 mix-blend-screen", image: "/3_anim.gif" },
      { 
        id: 3, 
        layout: "absolute inset-0 w-full h-full z-20", 
        image: "/3_1.png", 
        sfx: "/audio/raf_3.WAV",
        textJp: "悪いな、今朝フルスタックアプリを完成させたところだ。お前らはただの準備運動にすぎない。",
        textFr: "Désolé les gars, j'ai fini mon appli fullstack ce matin. Vous êtes juste mon échauffement.",
        bubbleStyle: "bottom-[5%] left-[5%] max-w-[60%]"
      },
    ],
  },
  4: {
    overlayMask: "/4_ligne.png",
    bgm: "/audio/ikari.mp3", 
    panels: [
      // 1er clic : Panneau de DROITE
      { 
        id: 1, 
        layout: "absolute inset-0 w-full h-full", 
        image: "/4_3.png",
        textJp: "これは…！",
        textFr: "M-Mais... Qu'est-ce que c'est que ce code ?!",
        bubbleStyle: "bottom-[10%] right-[3%] w-[28%] md:w-[22%] aspect-square !bg-transparent !border-none !shadow-none bg-[url('/nuage.png')] bg-contain bg-center bg-no-repeat !p-6 md:!p-8 flex items-center justify-center text-center text-xs md:text-sm font-black leading-tight"
      },
      // 2ème clic : Panneau du MILIEU (Attaques 1 et 2)
      { 
        id: 2, 
        layout: "absolute inset-0 w-full h-full", 
        image: "/4_2.png",
        textJp: "見つけたぞ！",
        textFr: "Le fameux parchemin du Docker Jutsu...",
        bubbleStyle: "top-[10%] left-[38%] w-[25%]" 
      },
      // 3ème clic : Panneau de GAUCHE (Attaques 3 et 4)
      { 
        id: 3, 
        layout: "absolute inset-0 w-full h-full", 
        image: "/4_1.png",
        onomatopoeia: "/4_ono.png",
        onoStyle: "top-[15%] left-[5%] w-[25%]" 
      },
    ],
  },
  5: {
    overlayMask: "/5_ligne.png",
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full", image: "/5_1.png" },
      { id: 2, layout: "absolute inset-0 w-full h-full", image: "/5_2.png" },
      { id: 3, layout: "absolute inset-0 w-full h-full", image: "/5_3.png" },
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
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [warningText, setWarningText] = useState<string>("Hé ! Ne sautez pas des cases !");

  // ========================================================
  // ÉTAT DU TERMINAL
  // 0: inactif
  // 1: Attente "React-sengan" (sur 4_2)
  // 2: Attente "Git-Dori" (sur 4_2)
  // 3: Fini sur 4_2, attente du prochain clic
  // 4: Attente "API-terasu" (sur 4_1)
  // 5: Attente "Jsonagi" (sur 4_1)
  // 6: TOUT FINI
  // ========================================================
  const [cliState, setCliState] = useState<number>(0); 
  const [cliInput, setCliInput] = useState<string>("");
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const attack1Target = "React-sengan";
  const attack2Target = "Git-Dori";
  const attack3Target = "API-terasu";
  const attack4Target = "Jsonagi";

  const startBgm = () => {
    const targetBgmSrc = currentPageData.bgm;

    if (!targetBgmSrc) {
      if (globalBgm) {
        smoothVolume(globalBgm, 0, 1000);
        setTimeout(() => globalBgm?.pause(), 1000);
        globalBgm = null;
        currentBgmSrc = null;
      }
      return;
    }

    if (globalBgm && currentBgmSrc === targetBgmSrc) {
        if (globalBgm.volume < 0.75) smoothVolume(globalBgm, 0.75, 500);
        return;
    }

    if (globalBgm) {
      smoothVolume(globalBgm, 0, 1000); 
      setTimeout(() => globalBgm?.pause(), 1000);
    }

    const newBgm = new Audio(targetBgmSrc);
    newBgm.loop = true;
    newBgm.volume = 0; 
    newBgm.play().catch(e => console.log("BGM Error:", e));
    smoothVolume(newBgm, 0.75, 1000); 

    globalBgm = newBgm;
    currentBgmSrc = targetBgmSrc;
  };

  useEffect(() => {
    startBgm();
  }, [currentPage]);

  // ========================================================
  // LOGIQUE DU CLAVIER (CLI)
  // ========================================================
  useEffect(() => {
    // Affiche le 1er terminal sur la case du milieu (4_2.png)
    if (currentPage === 4 && visiblePanels === 2 && cliState === 0) {
      setCliState(1); 
    }
    // Affiche le 2ème terminal sur la case de gauche (4_1.png)
    if (currentPage === 4 && visiblePanels === 3 && cliState === 3) {
      setCliState(4); 
    }
  }, [currentPage, visiblePanels, cliState]);

  useEffect(() => {
    if (![1, 2, 4, 5].includes(cliState)) return; // On écoute que pendant ces états

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return; 

      const targetString = 
        cliState === 1 ? attack1Target : 
        cliState === 2 ? attack2Target : 
        cliState === 4 ? attack3Target : 
        attack4Target; // état 5

      if (e.key === "Enter") {
        if (cliInput === targetString) {
          executeAttackSequence(cliState);
        } else {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 200);
        }
      } 
      else if (e.key === "Backspace") {
        setCliInput(prev => prev.slice(0, -1));
      } 
      else if (e.key.length === 1) {
        if (e.key === " ") e.preventDefault(); 
        if (cliInput.length < targetString.length) {
          setCliInput(targetString.substring(0, cliInput.length + 2));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cliState, cliInput, isLocked]);

  const executeAttackSequence = (currentState: number) => {
    setIsLocked(true);
    setIsShaking(true); 
    
    if (globalBgm) smoothVolume(globalBgm, 0.2, 300);

    let voiceSrc = "";
    let sfxSrc = "";

    // Configuration des sons pour chaque attaque (MODIFIE LES LIENS SI BESOIN)
    if (currentState === 1) {
      voiceSrc = "/audio/att_react.WAV"; sfxSrc = "/audio/rasengan.mp3";
    } else if (currentState === 2) {
      voiceSrc = "/audio/att_git.WAV"; sfxSrc = "/audio/chidori.mp3";
    } else if (currentState === 4) {
      voiceSrc = "/audio/att_api.WAV"; sfxSrc = "/audio/amaterasu.mp3"; // <-- Modifier ici
    } else if (currentState === 5) {
      voiceSrc = "/audio/att_json.WAV"; sfxSrc = "/audio/izanagi.mp3"; // <-- Modifier ici
    }

    const voiceAudio = new Audio(voiceSrc);
    const sfxAudio = new Audio(sfxSrc);

    voiceAudio.volume = 1.0;
    sfxAudio.volume = 1.0;

    const fallbackToNext = () => {
      setTimeout(() => {
        setIsShaking(false);
        setIsLocked(false);
        if (globalBgm) smoothVolume(globalBgm, 0.75, 500);
        
        if (currentState === 1) { setCliState(2); setCliInput(""); } 
        else if (currentState === 2) { setCliState(3); setCliInput(""); }
        else if (currentState === 4) { setCliState(5); setCliInput(""); }
        else if (currentState === 5) { setCliState(6); setCliInput(""); }
      }, 1500);
    };

    voiceAudio.play().catch(() => fallbackToNext());

    voiceAudio.onended = () => {
      sfxAudio.play().catch(() => fallbackToNext());

      sfxAudio.onended = () => {
        setIsShaking(false);
        setIsLocked(false);
        if (globalBgm) smoothVolume(globalBgm, 0.75, 500); 

        if (currentState === 1) { setCliState(2); setCliInput(""); } 
        else if (currentState === 2) { setCliState(3); setCliInput(""); }
        else if (currentState === 4) { setCliState(5); setCliInput(""); }
        else if (currentState === 5) { setCliState(6); setCliInput(""); }
      };
    };
  };

  // ========================================================

  const handleNextPanel = () => {
    if (isLocked) return;

    // BLOQUE LA PROGRESSION SI LE TERMINAL DU MILIEU N'EST PAS FINI
    if (currentPage === 4 && visiblePanels === 2 && cliState < 3) {
      setWarningText("Tapez sur le clavier pour lancer l'attaque !");
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    
    // BLOQUE LA PROGRESSION SI LE TERMINAL DE GAUCHE N'EST PAS FINI
    if (currentPage === 4 && visiblePanels === 3 && cliState < 6) {
      setWarningText("Tapez sur le clavier pour lancer l'attaque !");
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    setShowWarning(false);

    if (visiblePanels < pageData.length) {
      if (currentPage === 3 && visiblePanels === 0 && pageData[2]?.sfx) {
        const audio = new Audio(pageData[2].sfx);
        audio.volume = 1.0;
        audio.play().catch(e => console.log("Audio error:", e));
      }

      startBgm();

      const nextPanel = pageData[visiblePanels];

      if (nextPanel.sfx && currentPage !== 3) {
        const sfx = new Audio(nextPanel.sfx);
        sfx.volume = 1.0;
        sfx.play().catch(e => console.log("SFX Error:", e));
      }

      if (nextPanel.voice && globalBgm) {
        const bgm = globalBgm;
        smoothVolume(bgm, 0.3, 500);
        const voice = new Audio(nextPanel.voice);
        voice.volume = 1.0;
        voice.play().catch(e => console.log("Voice Error:", e));
        voice.onended = () => {
          smoothVolume(bgm, 0.75, 500);
        };
      }

      if (nextPanel.sfxChain && nextPanel.sfxChain.length > 0) {
        if (globalBgm) smoothVolume(globalBgm, 0.3, 500);

        const playNextSound = (index: number) => {
          if (index >= nextPanel.sfxChain!.length) {
            if (globalBgm) smoothVolume(globalBgm, 0.75, 500);
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

      let lockDuration = 1500; 

      if (currentPage === 2 && nextPanel.id === 3) lockDuration = 13000;
      if (currentPage === 1 && nextPanel.id === 2) lockDuration = 6200;
      if (currentPage === 3 && nextPanel.id === 1) lockDuration = 7000;

      setTimeout(() => {
        setIsLocked(false);
      }, lockDuration);
    }
  };

  const handleNextPageClick = (e: React.MouseEvent) => {
    // MODIFIE ICI : On autorise le changement de page SEULEMENT SI le cliState a atteint 6
    if (visiblePanels < pageData.length || isLocked || (currentPage === 4 && cliState < 6)) {
      e.preventDefault(); 
      setWarningText("Veuillez finir cette page.");
      setShowWarning(true); 
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };

  const hasMask = !!currentPageData.overlayMask;

  return (
    <motion.div 
      key={currentPage}
      initial={{ opacity: 0, filter: "blur(8px)" }} 
      animate={{ opacity: 1, filter: "blur(0px)" }} 
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center py-8 px-6 md:px-20 overflow-hidden"
    >
      
      <div className="text-neutral-500 font-bold mb-6 tracking-widest uppercase">
        Page {currentPage} / {TOTAL_PAGES}
      </div>

      <div className="relative w-full max-w-5xl flex flex-col items-center justify-center">
        
        {currentPage > 1 && (
          <Link 
            href={`/lire/${currentPage - 1}`}
            className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-20 z-50 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 hover:scale-110 text-white rounded-full transition-all border-2 border-neutral-600 shadow-xl"
            title="Page précédente"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </Link>
        )}

        <motion.div 
          className={`w-full ${isLocked ? 'cursor-wait' : 'cursor-pointer'}`}
          animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0], y: [-5, 5, -5, 5, -2, 2, 0] } : { x: 0, y: 0 }}
          transition={isShaking ? { repeat: Infinity, duration: 0.3 } : { duration: 0 }}
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
                          <img src={panel.image} alt={`Case ${panel.id}`} className="w-full h-full object-cover" />
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
                            <Typewriter textJp={panel.textJp || ""} textFr={panel.textFr || ""} speed={40} decodeDelay={800} startDelay={500} />
                          </motion.div>
                        )}

                        {/* ======================================================== */}
                        {/* TERMINAL CLI #1 (Sur la case du milieu, id: 2)           */}
                        {/* ======================================================== */}
                        {currentPage === 4 && panel.id === 2 && cliState > 0 && cliState < 3 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[28%] md:w-[25%] z-50 bg-black/90 border border-green-500 rounded p-2 md:p-3 font-mono shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                          >
                            <div className="text-[10px] md:text-xs text-green-500">
                              <p className="mb-1 opacity-70">root@sae402:~# init</p>
                              <p className="mb-2 md:mb-3 text-green-400 font-bold animate-pulse">
                                COMMANDE {cliState}/2...
                              </p>
                              <div className="flex text-xs md:text-sm text-green-300 font-bold">
                                <span className="mr-1 md:mr-2">&gt;</span>
                                <span>{cliInput}</span>
                                {!isLocked && <span className="inline-block w-1.5 md:w-2 h-3 md:h-4 bg-green-500 animate-ping ml-1" />}
                              </div>
                              <p className="mt-3 md:mt-4 text-[8px] md:text-[10px] text-green-700 opacity-80 uppercase tracking-widest text-center leading-tight">
                                {isLocked ? "EXÉCUTION..." : "Tapez puis ENTRÉE"}
                              </p>
                            </div>
                          </motion.div>
                        )}

                       {/* ======================================================== */}
{/* ======================================================== */}
{/* TERMINAL CLI #2 (Sur la case de gauche, id: 3)           */}
{/* ======================================================== */}
{currentPage === 4 && panel.id === 3 && cliState > 3 && cliState < 6 && (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute top-[70%] left-[20%] -translate-x-1/2 w-[28%] md:w-[25%] z-50 bg-black/90 border border-green-500 rounded p-2 md:p-3 font-mono shadow-[0_0_20px_rgba(34,197,94,0.6)]"
  >
    <div className="text-[10px] md:text-xs text-green-500">
      <p className="mb-1 opacity-70">root@sae402:~# final_atk</p>
      <p className="mb-2 md:mb-3 text-green-400 font-bold animate-pulse">
        COMMANDE {cliState - 3}/2...
      </p>
      <div className="flex text-xs md:text-sm text-green-300 font-bold">
        <span className="mr-1 md:mr-2">&gt;</span>
        <span>{cliInput}</span>
        {!isLocked && <span className="inline-block w-1.5 md:w-2 h-3 md:h-4 bg-green-500 animate-ping ml-1" />}
      </div>
      <p className="mt-3 md:mt-4 text-[8px] md:text-[10px] text-green-700 opacity-80 uppercase tracking-widest text-center leading-tight">
        {isLocked ? "EXÉCUTION..." : "Tapez puis ENTRÉE"}
      </p>
    </div>
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
                          <Typewriter textJp={panel.textJp || ""} textFr={panel.textFr || ""} speed={40} decodeDelay={800} startDelay={500} />
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
        </motion.div>

        {currentPage < TOTAL_PAGES && (
          <div className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-20 z-50 flex flex-col items-center">
            
            <AnimatePresence>
              {showWarning && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max bg-red-600 text-white px-4 py-2 rounded-lg shadow-[0_4px_15px_rgba(220,38,38,0.5)] text-sm md:text-base font-bold pointer-events-none before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-red-600"
                >
                  {warningText}
                </motion.div>
              )}
            </AnimatePresence>

            <Link 
              href={`/lire/${currentPage + 1}`}
              onClick={handleNextPageClick} 
              className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-all border-2 shadow-[0_0_15px_rgba(234,88,12,0.5)] ${
                visiblePanels < pageData.length || isLocked || (currentPage === 4 && cliState < 6)
                  ? 'bg-neutral-600 border-neutral-400 text-neutral-300 shadow-none cursor-not-allowed' 
                  : 'bg-orange-600 hover:bg-orange-500 hover:scale-110 text-white border-orange-400' 
              }`}
              title="Page suivante"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        )}

      </div>

      {visiblePanels === 0 && (
        <p className="text-white/50 mt-12 animate-pulse text-lg font-semibold text-center">
          Cliquez sur la case pour lire la suite...
        </p>
      )}

    </motion.div>
  );
}