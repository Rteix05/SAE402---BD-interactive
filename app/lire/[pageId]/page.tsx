"use client";

import { useSpring, animated, to } from "@react-spring/web";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Typewriter from "@/components/Typewriter";

let globalBgm: HTMLAudioElement | null = null;
let currentBgmSrc: string | null = null;
let fadeInterval: NodeJS.Timeout | null = null;

const allPagesData: Record<
  number,
  {
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
      customStack?: boolean;
    }[];
  }
> = {
  1: {
    overlayMask: "/1_ligne.png",
    bgm: "/audio/konoha.mp3",
    panels: [
      { id: 1, layout: "absolute inset-0 w-full h-full", image: "/1_1.png" },
      {
        id: 2,
        layout: "absolute inset-0 w-full h-full",
        image: "/1_2.png",
        textJp: "ラファマ...貴重な ものをく-貴重な ものをたばかりく",
        textFr:
          "Enfin... “Delon - Sama “ m'a donné ma première vraie SAE , je vais lui montrer de quoi je suis capable..",
        bubbleStyle: "bottom-[3%] left-[2%]",
        voice: "/audio/raf_1.WAV",
      },
    ],
  },
  2: {
    overlayMask: "/2_ligne.png",
    bgm: "/audio/akatsuki.mp3",
    panels: [
      {
        id: 1,
        layout: "absolute inset-0 w-full h-full",
        image: "/2_1.png",
        onomatopoeia: "/ono.png",
        onoStyle: "right-[2%] top-[2%] w-[20%]",
        sfx: "/audio/boss-apparition.mp3",
      },
      {
        id: 2,
        layout: "absolute inset-0 w-full h-full",
        image: "/2_2.png",
        textJp: "ラファマル、貴重なものをください！",
        textFr: "Donne-nous le Rouleau des commandes Dockers Rafamaru !",
        bubbleStyle: "bottom-[3%] right-[2%] left-auto",
        voice: "/audio/lucas_1.wav",
      },
      {
        id: 3,
        layout: "absolute inset-0 w-full h-full",
        image: "/2_3.png",
        textJp: "7対1？それだけ？S3を取ったばかりだ、お前らなんか怖くない！",
        textFr:
          "C'est tout ce que vous avez ? Je viens de valider mon S3, vous ne me faites pas peur ! SharinCode !!!",
        bubbleStyle: "bottom-[3%] left-[2%]",
        voice: "/audio/raf_2.mp3",
      },
    ],
  },
  3: {
    overlayMask: "/3_ligne.png",
    bgm: "/audio/ikari.mp3",
    simultaneous: true,
    panels: [
      {
        id: 1,
        layout: "absolute inset-0 w-full h-full z-0",
        image: "/3_fond.png",
      },
      {
        id: 2,
        layout: "absolute inset-0 w-full h-full z-10 mix-blend-screen",
        image: "/3_anim.gif",
      },
      {
        id: 3,
        layout: "absolute inset-0 w-full h-full z-20",
        image: "/3_1.png",
        textJp:
          "悪いな、今朝フルスタックアプリを完成させたところだ。お前らはただの準備運動にすぎない。",
        textFr:
          "Désolé les gars, j'ai fini mon appli fullstack ce matin. Vous êtes juste mon échauffement.",
        sfx: "/audio/raf_3.WAV",
        bubbleStyle: "bottom-[5%] left-[5%] max-w-[60%]",
      },
    ],
  },
  4: {
    overlayMask: "/4_ligne.png",
    bgm: "/audio/ikari.mp3",
    panels: [
      {
        id: 1,
        layout: "absolute inset-0 w-full h-full",
        image: "/4_3.png",
        textJp: "これは…！",
        textFr: "M-Mais... Qu'est-ce que c'est que ce code ?!",
        bubbleStyle:
          "bottom-[10%] right-[3%] w-[28%] md:w-[22%] aspect-square !bg-transparent !border-none !shadow-none bg-[url('/nuage.png')] bg-contain bg-center bg-no-repeat !p-6 md:!p-8 flex items-center justify-center text-center text-xs md:text-sm font-black leading-tight",
      },
      {
        id: 2,
        layout: "absolute inset-0 w-full h-full",
        image: "/4_2.png",
        textJp: "見つけたぞ！",
        sfx: "/audio/raf_4.WAV",
        textFr:
          "Eh... Vous n'êtes pas prêts a voir ma maitrise parfaite de l'hebergement !",
        bubbleStyle: "top-[10%] left-[38%] w-[25%]",
      },
      {
        id: 3,
        layout: "absolute inset-0 w-full h-full",
        image: "/4_1.png",
        textJp: "これでお前たちを倒せる！",
        textFr: "Quoi !? Mais quelle est cette technique ?!",
        sfx: "/audio/mathis_1.WAV",
        onomatopoeia: "/4_ono.png",
        onoStyle: "top-[0%] left-[0%] w-[100%]",
        bubbleStyle: "bottom-[3%] left-[2%] w-[33%]",
      },
    ],
  },
  5: {
    overlayMask: "/5_ligne.png",
    panels: [
      {
        id: 1,
        layout: "absolute inset-0 w-full h-full overflow-hidden",
        customStack: true,
        textFr: "CLIQUEZ SUR LES ENNEMIS POUR LES VAINCRE !",
        bubbleStyle:
          "top-[5%] left-1/2 -translate-x-1/2 w-auto !bg-red-600 !text-white !border-red-800 animate-pulse text-center shadow-[0_0_15px_rgba(220,38,38,0.8)] whitespace-nowrap",
      },
      {
        id: 2,
        layout: "absolute inset-0 w-full h-full",
        image: "/5_2.png",
        textJp: "お前の術は...なんだ？", // "Quel est ton jutsu ?" en japonais
        textFr: "Quel... est ton ... jutsu ... Rafamaru...?",
        voice: "/audio/lucas_2.WAV",
        bubbleStyle: "bottom-[38%] left-[29%] w-[30%] translate-x-[2%] text-xs",
      },
      {
        id: 3,
        layout: "absolute inset-0 w-full h-full",
        image: "/5_3.png",
        textJp: "デロン様は感銘を受けた", // "Delon-sama est impressionné" en japonais
        textFr: "DELON-SAMA est impressionné.",
        sfx: "/audio/anime-scream-wow.mp3",
        bubbleStyle: "bottom-[4%] left-[3%] w-[25%]",
      },
    ],
  },
};

const TOTAL_PAGES = 5;

function smoothVolume(
  audio: HTMLAudioElement,
  target: number,
  duration: number = 500,
) {
  const start = audio.volume;
  const diff = target - start;
  if (diff === 0) return;
  const steps = 30;
  let currentStep = 0;
  const stepTime = duration / steps;
  const interval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(
      0,
      Math.min(1, start + diff * (currentStep / steps)),
    );
    if (currentStep >= steps) {
      audio.volume = target;
      clearInterval(interval);
    }
  }, stepTime);
}

export default function ComicPage() {
  const [lucasHits, setLucasHits] = useState(0);
  const [mathisHits, setMathisHits] = useState(0);
  const [lucasDead, setLucasDead] = useState(false);
  const [mathisDead, setMathisDead] = useState(false);
  const [showDockerJutsu, setShowDockerJutsu] = useState(false);

  useEffect(() => {
    if (showDockerJutsu) {
      const audio = new Audio("/audio/att_docker.WAV");
      audio.volume = 1.0;
      audio.play().catch(() => {});
    }
  }, [showDockerJutsu]);

  const router = useRouter();

  // UTILISATION DE TON FILTRE ROUGE EXACT
  const redFilter =
    "saturate(200%) hue-rotate(-30deg) brightness(125%) contrast(150%)";
  const normalFilter =
    "saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)";

  const [lucasProps, lucasApi] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    filter: normalFilter,
  }));

  const [mathisProps, mathisApi] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    filter: normalFilter,
  }));

  const handleLucasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lucasDead) return;

    // Son de coup
    const audio = new Audio("/audio/strong-mace-strike.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});

    const nextHits = lucasHits + 1;
    setLucasHits(nextHits);

    if (nextHits >= 10) {
      setLucasDead(true);
      lucasApi.start({
        to: { y: 1000, opacity: 0 },
        config: { duration: 500 },
      });
    } else {
      // Tremblement horizontal
      lucasApi.start({
        from: { x: 0, rotate: 0, filter: redFilter },
        to: async (next) => {
          await next({ x: -5 });
          await next({ x: 5 });
          await next({ x: -5 });
          await next({ x: 5 });
          await next({ x: 0, filter: normalFilter });
        },
        config: { tension: 800, friction: 10 },
        reset: true,
      });
    }
  };

  const handleMathisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mathisDead) return;

    // Son de coup
    const audio = new Audio("/audio/strong-mace-strike.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});

    const nextHits = mathisHits + 1;
    setMathisHits(nextHits);

    if (nextHits >= 10) {
      setMathisDead(true);
      mathisApi.start({
        to: { y: 1000, opacity: 0 },
        config: { duration: 500 },
      });
    } else {
      // Tremblement horizontal
      mathisApi.start({
        from: { x: 0, rotate: 0, filter: redFilter },
        to: async (next) => {
          await next({ x: 5 });
          await next({ x: -5 });
          await next({ x: 5 });
          await next({ x: -5 });
          await next({ x: 0, filter: normalFilter });
        },
        config: { tension: 800, friction: 10 },
        reset: true,
      });
    }
  };

  const params = useParams();
  const currentPage = parseInt(params.pageId as string, 10) || 1;

  const currentPageData = allPagesData[currentPage] ?? allPagesData[1];
  const pageData = currentPageData.panels;

  const [visiblePanels, setVisiblePanels] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [warningText, setWarningText] = useState<string>(
    "Hé ! Ne sautez pas des cases !",
  );

  const [cliState, setCliState] = useState<number>(0);
  const [cliInput, setCliInput] = useState<string>("");
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const attack1Target = "React-sengan";
  const attack2Target = "Git-dori";
  const attack3Target = "API-terasu";
  const attack4Target = "Jsonagi";

  const startBgm = () => {
    const targetBgmSrc = currentPageData.bgm;

    // Si pas de musique pour cette page
    if (!targetBgmSrc) {
      if (globalBgm) {
        smoothVolume(globalBgm, 0, 1000);
        setTimeout(() => {
          if (globalBgm && !currentBgmSrc) globalBgm.pause();
        }, 1000);
        currentBgmSrc = null;
      }
      return;
    }

    // Si même musique : on continue (juste on remet le volume si baissé)
    if (globalBgm && currentBgmSrc === targetBgmSrc) {
      if (globalBgm.volume < 0.75) smoothVolume(globalBgm, 0.75, 500);
      return;
    }

    // Si nouvelle musique : Fade out l'ancienne et start la nouvelle
    if (globalBgm) {
      const oldBgm = globalBgm;
      smoothVolume(oldBgm, 0, 1000);
      setTimeout(() => oldBgm.pause(), 1000);
    }

    const newBgm = new Audio(targetBgmSrc);
    newBgm.loop = true;
    newBgm.volume = 0;
    newBgm.play().catch((e) => console.log("BGM Error:", e));
    smoothVolume(newBgm, 0.75, 1000);

    globalBgm = newBgm;
    currentBgmSrc = targetBgmSrc;
  };

  useEffect(() => {
    // Tente de lancer la musique au chargement de la page (si déjà autorisée ou continu)
    startBgm();

    // Pas de cleanup ici pour laisser la musique continuer entre les pages !
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 4 && visiblePanels === 2 && cliState === 0) {
      setCliState(1);
    }
    if (currentPage === 4 && visiblePanels === 3 && cliState === 3) {
      setCliState(4);
    }
  }, [currentPage, visiblePanels, cliState]);

  useEffect(() => {
    if (![1, 2, 4, 5].includes(cliState)) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      const targetString =
        cliState === 1
          ? attack1Target
          : cliState === 2
            ? attack2Target
            : cliState === 4
              ? attack3Target
              : attack4Target;

      if (e.key === "Enter") {
        if (cliInput === targetString) {
          executeAttackSequence(cliState);
        } else {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 200);
        }
      } else if (e.key === "Backspace") {
        setCliInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
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

    // Remet le volume
    if (globalBgm) smoothVolume(globalBgm, 0.2, 300);

    let voiceSrc = "";
    let sfxSrc = "";

    if (currentState === 1) {
      voiceSrc = "/audio/att_react.WAV";
      sfxSrc = "/audio/rasengan.mp3";
    } else if (currentState === 2) {
      voiceSrc = "/audio/att_git.WAV";
      sfxSrc = "/audio/chidori.mp3";
    } else if (currentState === 4) {
      voiceSrc = "/audio/att_api.WAV";
      sfxSrc = "/audio/amaterasu.mp3";
    } else if (currentState === 5) {
      voiceSrc = "/audio/att_json.WAV";
      sfxSrc = "/audio/katon.mp3";
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

        if (currentState === 1) {
          setCliState(2);
          setCliInput("");
        } else if (currentState === 2) {
          setCliState(3);
          setCliInput("");
        } else if (currentState === 4) {
          setCliState(5);
          setCliInput("");
        } else if (currentState === 5) {
          setCliState(6);
          setCliInput("");
        }
      }, 1500);
    };

    voiceAudio.play().catch(() => fallbackToNext());

    voiceAudio.onended = () => {
      sfxAudio.play().catch(() => fallbackToNext());

      sfxAudio.onended = () => {
        setIsShaking(false);
        setIsLocked(false);
        if (globalBgm) smoothVolume(globalBgm, 0.75, 500);

        if (currentState === 1) {
          setCliState(2);
          setCliInput("");
        } else if (currentState === 2) {
          setCliState(3);
          setCliInput("");
        } else if (currentState === 4) {
          setCliState(5);
          setCliInput("");
        } else if (currentState === 5) {
          setCliState(6);
          setCliInput("");
        }
      };
    };
  };

  const handleNextPanel = () => {
    if (isLocked) return;

    if (visiblePanels >= pageData.length) {
      if (currentPage === 4 && cliState < 6) {
        setWarningText(
          "Tapez sur le clavier pour lancer les attaques finales !",
        );
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return;
      }
      if (
        currentPage === 5 &&
        visiblePanels === 1 &&
        (!lucasDead || !mathisDead)
      ) {
        setWarningText(
          "Battez Lucas et Mathis avant de continuer ! (Cliquez dessus)",
        );
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return;
      }
      if (currentPage < TOTAL_PAGES) {
        router.push(`/lire/${currentPage + 1}`);
      }
      return;
    }

    if (currentPage === 4) {
      if (visiblePanels === 2 && cliState < 3) {
        setWarningText("Tapez sur le clavier pour lancer les deux attaques !");
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return;
      }
      if (visiblePanels === 3 && cliState < 6) {
        setWarningText(
          "Tapez sur le clavier pour lancer les attaques finales !",
        );
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return;
      }
    }

    if (
      currentPage === 5 &&
      visiblePanels === 1 &&
      (!lucasDead || !mathisDead)
    ) {
      setWarningText(
        "Battez Lucas et Mathis avant de continuer ! (Cliquez dessus)",
      );
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    startBgm();

    const nextPanel = pageData[visiblePanels];

    // GESTION SPÉCIALE POUR LES PAGES SIMULTANÉES (Page 3)
    if (currentPageData.simultaneous) {
      setVisiblePanels(pageData.length);

      // Jouer les sons de TOUS les panels pertinents
      pageData.forEach((panel) => {
        if (panel.voice) {
          if (globalBgm) smoothVolume(globalBgm, 0.3, 500);
          const voice = new Audio(panel.voice);
          voice.volume = 1.0;
          voice.play().catch((e) => console.log("Voice Error:", e));
          voice.onended = () => {
            if (globalBgm) smoothVolume(globalBgm, 0.75, 500);
          };
        }
        if (panel.sfx) {
          const sfx = new Audio(panel.sfx);
          sfx.volume = 1.0;
          sfx.play().catch((e) => console.log("SFX Error:", e));
        }
      });

      // Logique de verrouillage spécifique à la page 3
      // On garde la logique existante basée sur "nextPanel" qui était le premier panel
      let lockDuration = 1500;
      if (currentPage === 3) lockDuration = 7000;

      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
      }, lockDuration);

      return; // On arrête ici pour ne pas exécuter la logique standard
    }

    // LOGIQUE STANDARD SÉQUENTIELLE
    if (nextPanel.sfx && currentPage !== 3) {
      const sfx = new Audio(nextPanel.sfx);
      sfx.volume = 1.0;
      sfx.play().catch((e) => console.log("SFX Error:", e));
    }

    if (nextPanel.voice) {
      const bgm = globalBgm;
      if (bgm) smoothVolume(bgm, 0.3, 500);
      const voice = new Audio(nextPanel.voice);
      voice.volume = 1.0;
      voice.play().catch((e) => console.log("Voice Error:", e));
      voice.onended = () => {
        if (bgm && globalBgm === bgm) smoothVolume(bgm, 0.75, 500);
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
        audio.play().catch((e) => console.log("SFX Chain Error:", e));

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
      setVisiblePanels((prev) => prev + 1);
    }

    let lockDuration = 1500;

    if (currentPage === 2 && nextPanel.id === 3) lockDuration = 13000;
    if (currentPage === 1 && nextPanel.id === 2) lockDuration = 6200;

    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setIsLocked(false);
    }, lockDuration);
  };

  const handleNextPageClick = (e: React.MouseEvent) => {
    if (
      visiblePanels < pageData.length ||
      isLocked ||
      (currentPage === 4 && cliState < 6)
    ) {
      e.preventDefault();

      if (currentPage === 5 && (!lucasDead || !mathisDead)) {
        setWarningText("Battez Lucas et Mathis d'abord ! (Cliquez dessus)");
      } else {
        setWarningText("Veuillez finir cette page.");
      }

      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visiblePanels === 0) {
      timer = setTimeout(() => {
        handleNextPanel();
      }, 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visiblePanels]);

  const hasMask = !!currentPageData.overlayMask;

  return (
    <motion.div
      key={currentPage}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center py-8 px-6 md:px-20 overflow-hidden select-none"
    >
      <div className="text-neutral-500 font-bold mb-6 tracking-widest uppercase">
        Page {currentPage} / {TOTAL_PAGES}
      </div>

      <div className="relative w-full max-w-5xl flex flex-col items-center justify-center">
        {currentPage < TOTAL_PAGES && (
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-20 z-50 flex flex-col items-center">
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
                visiblePanels < pageData.length ||
                isLocked ||
                (currentPage === 4 && cliState < 6)
                  ? "bg-neutral-600 border-neutral-400 text-neutral-300 shadow-none cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-500 hover:scale-110 text-white border-orange-400"
              }`}
              title="Page suivante"
            >
              <svg
                className="w-6 h-6 md:w-8 md:h-8 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
        )}

        <motion.div
          className={`w-full ${isLocked ? "cursor-wait" : "cursor-pointer"}`}
          animate={
            isShaking
              ? { x: [-10, 10, -10, 10, -5, 5, 0], y: [-5, 5, -5, 5, -2, 2, 0] }
              : { x: 0, y: 0 }
          }
          transition={
            isShaking ? { repeat: Infinity, duration: 0.3 } : { duration: 0 }
          }
          onClick={handleNextPanel}
        >
          {hasMask ? (
            <div className="relative w-full aspect-video bg-black shadow-2xl overflow-hidden">
              <img
                src={currentPageData.overlayMask}
                alt="Lignes du panel"
                className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none select-none"
              />

              {currentPage === 5 && visiblePanels >= 3 && (
                <motion.div
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: -5, opacity: 1 }}
                  transition={{
                    delay: 3.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                  <h1
                    className="font-black text-[80px] md:text-[180px] text-white tracking-widest leading-none drop-shadow-[0_10px_0_rgba(0,0,0,1)] text-center"
                    style={{
                      WebkitTextStroke: "3px black",
                      fontFamily: "Impact, sans-serif",
                      transform: "rotate(-5deg)",
                    }}
                  >
                    FIN
                  </h1>
                </motion.div>
              )}
              <div className="absolute inset-0 z-10 w-full h-full">
                <AnimatePresence>
                  {pageData.map(
                    (panel, index) =>
                      index < visiblePanels && (
                        <motion.div
                          key={panel.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={panel.layout}
                        >
                          {currentPage === 5 &&
                          panel.id === 1 &&
                          panel.customStack ? (
                            <>
                              <img
                                src="/5_1_fond.png"
                                alt="fond"
                                className="w-full h-full object-cover absolute inset-0 z-0 pointer-events-none"
                              />

                              <animated.img
                                src="/5_1_lucas.png"
                                alt="lucas"
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 10,
                                  mixBlendMode: lucasDead
                                    ? "luminosity"
                                    : "normal",
                                  // @ts-ignore
                                  transform: to(
                                    [
                                      lucasProps.x,
                                      lucasProps.y,
                                      lucasProps.rotate,
                                    ],
                                    (x, y, r) =>
                                      `translate3d(${x}px,${y}px,0) rotate(${r}deg)`,
                                  ),
                                  filter: lucasProps.filter,
                                  opacity: lucasProps.opacity,
                                }}
                                className="pointer-events-none" // Ignore les clics directs pour utiliser la hitbox
                              />

                              <animated.img
                                src="/5_1_mathis.png"
                                alt="mathis"
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 20,
                                  mixBlendMode: mathisDead
                                    ? "luminosity"
                                    : "normal",
                                  // @ts-ignore
                                  transform: to(
                                    [
                                      mathisProps.x,
                                      mathisProps.y,
                                      mathisProps.rotate,
                                    ],
                                    (x, y, r) =>
                                      `translate3d(${x}px,${y}px,0) rotate(${r}deg)`,
                                  ),
                                  filter: mathisProps.filter,
                                  opacity: mathisProps.opacity,
                                }}
                                className="pointer-events-none" // Ignore les clics directs pour utiliser la hitbox
                              />

                              <img
                                src="/5_1_premierplan.png"
                                alt="premierplan"
                                className="w-full h-full object-cover absolute inset-0 z-30 pointer-events-none"
                              />
                              <img
                                src="/5_1_aura.png"
                                alt="aura"
                                className="w-full h-full object-cover absolute inset-0 z-40 mix-blend-screen pointer-events-none"
                              />

                              {/* HITBOX INVISIBLE (Côté Gauche) -> Vise le personnage de gauche */}
                              {!mathisDead && (
                                <div
                                  className="absolute inset-y-0 left-0 w-1/2 z-50 cursor-crosshair"
                                  onClick={handleMathisClick}
                                />
                              )}

                              {/* HITBOX INVISIBLE (Côté Droit) -> Vise le personnage de droite */}
                              {!lucasDead && (
                                <div
                                  className="absolute inset-y-0 right-0 w-1/2 z-50 cursor-crosshair"
                                  onClick={handleLucasClick}
                                />
                              )}
                            </>
                          ) : (
                            panel.image && (
                              <img
                                src={panel.image}
                                alt={`Case ${panel.id}`}
                                className="w-full h-full object-cover select-none"
                              />
                            )
                          )}
                          {panel.onomatopoeia && (
                            <motion.img
                              src={panel.onomatopoeia}
                              alt="SFX"
                              initial={{ opacity: 0, scale: 3, rotate: -8 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              transition={{
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className={`absolute z-40 h-auto pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] ${panel.onoStyle || "inset-0 m-auto w-[40%]"}`}
                            />
                          )}
                          {(panel.textJp || panel.textFr) && (
                            <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                              className={`absolute z-40 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-manga font-bold max-w-[40%] min-h-[3.5rem] shadow-md ${panel.bubbleStyle || "bottom-4 left-4"}`}
                            >
                              <Typewriter
                                textJp={panel.textJp || ""}
                                textFr={panel.textFr || ""}
                                speed={40}
                                decodeDelay={800}
                                startDelay={500}
                                // @ts-ignore
                                onComplete={() => {
                                  if (currentPage === 5 && panel.id === 2) {
                                    setTimeout(
                                      () => setShowDockerJutsu(true),
                                      1000,
                                    );
                                  }
                                }}
                              />
                            </motion.div>
                          )}
                          {currentPage === 5 &&
                            panel.id === 2 &&
                            showDockerJutsu && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className="absolute z-100 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-manga font-bold max-w-[30%] min-h-[3.5rem] shadow-md bottom-[4%] right-[4%]"
                              >
                                <Typewriter
                                  textJp="Dockerの術！"
                                  textFr="Docker-Jutsu !"
                                  speed={40}
                                  decodeDelay={0}
                                  startDelay={0}
                                />
                              </motion.div>
                            )}

                          {currentPage === 4 &&
                            panel.id === 2 &&
                            cliState > 0 &&
                            cliState < 3 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-[40%] left-[45%] md:left-[42%] w-[24%] md:w-[20%] z-50 bg-black/90 border border-green-500 rounded p-2 md:p-3 font-mono shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                              >
                                <div className="text-[10px] md:text-xs text-green-500">
                                  <p className="mb-1 opacity-70">
                                    root@sae402:~# init
                                  </p>
                                  <p className="mb-2 md:mb-3 text-green-400 font-bold animate-pulse">
                                    COMMANDE {cliState}/2...
                                  </p>
                                  <div className="flex text-xs md:text-sm text-green-300 font-bold">
                                    <span className="mr-1 md:mr-2">&gt;</span>
                                    <span>{cliInput}</span>
                                    {!isLocked && (
                                      <span className="inline-block w-1.5 md:w-2 h-3 md:h-4 bg-green-500 animate-ping ml-1" />
                                    )}
                                  </div>
                                  <p className="mt-3 md:mt-4 text-[8px] md:text-[10px] text-green-700 opacity-80 uppercase tracking-widest text-center leading-tight">
                                    {isLocked
                                      ? "EXÉCUTION..."
                                      : "Tapez puis ENTRÉE"}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                          {currentPage === 4 &&
                            panel.id === 3 &&
                            cliState > 3 &&
                            cliState < 6 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-[60%] left-[20%] -translate-x-1/2 w-[28%] md:w-[25%] z-50 bg-black/90 border border-green-500 rounded p-2 md:p-3 font-mono shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                              >
                                <div className="text-[10px] md:text-xs text-green-500">
                                  <p className="mb-1 opacity-70">
                                    root@sae402:~# final_atk
                                  </p>
                                  <p className="mb-2 md:mb-3 text-green-400 font-bold animate-pulse">
                                    COMMANDE {cliState - 3}/2...
                                  </p>
                                  <div className="flex text-xs md:text-sm text-green-300 font-bold">
                                    <span className="mr-1 md:mr-2">&gt;</span>
                                    <span>{cliInput}</span>
                                    {!isLocked && (
                                      <span className="inline-block w-1.5 md:w-2 h-3 md:h-4 bg-green-500 animate-ping ml-1" />
                                    )}
                                  </div>
                                  <p className="mt-3 md:mt-4 text-[8px] md:text-[10px] text-green-700 opacity-80 uppercase tracking-widest text-center leading-tight">
                                    {isLocked
                                      ? "EXÉCUTION..."
                                      : "Tapez puis ENTRÉE"}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white p-2 gap-2 grid grid-cols-2 shadow-2xl">
              <AnimatePresence>
                {pageData.map(
                  (panel, index) =>
                    index < visiblePanels && (
                      <motion.div
                        key={panel.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`relative bg-black flex items-center justify-center overflow-hidden ${panel.layout}`}
                      >
                        {panel.image ? (
                          <img
                            src={panel.image}
                            alt={`Case ${panel.id}`}
                            className="w-full h-full object-cover select-none"
                          />
                        ) : (
                          <span className="text-white/20 font-bold text-4xl">
                            CASE {panel.id}
                          </span>
                        )}
                        {(panel.textJp || panel.textFr) && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="absolute bottom-4 left-4 bg-white text-black border-2 border-black rounded-3xl px-4 py-3 font-manga font-bold max-w-[80%] min-h-[3.5rem] shadow-md"
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
                    ),
                )}
              </AnimatePresence>
              {pageData.map(
                (panel, index) =>
                  index >= visiblePanels && (
                    <div
                      key={`empty-${panel.id}`}
                      className={`bg-neutral-800 ${panel.layout}`}
                    ></div>
                  ),
              )}
            </div>
          )}
        </motion.div>
      </div>

      {visiblePanels === 0 && (
        <p className="text-white/50 mt-12 animate-pulse text-lg font-semibold text-center">
          Cliquez sur la case pour lire la suite...
        </p>
      )}
    </motion.div>
  );
}
