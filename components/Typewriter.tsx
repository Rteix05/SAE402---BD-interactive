"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  textJp: string;
  textFr: string;
  speed?: number;
  decodeDelay?: number;
  startDelay?: number; // On rajoute un délai initial !
  onComplete?: () => void;
}

export default function Typewriter({
  textJp,
  textFr,
  speed = 40,
  decodeDelay = 800,
  startDelay = 500, // 500ms d'attente par défaut pour laisser la bulle apparaître
  onComplete,
}: TypewriterProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(0);

    const delayTicks = Math.floor(decodeDelay / speed);
    const maxTicks = Math.max(textJp.length, textFr.length + delayTicks);

    // 1. On attend d'abord que l'animation de la bulle se termine (startDelay)
    const timeoutId = setTimeout(() => {
      // 2. Ensuite, on lance la machine à écrire
      const interval = setInterval(() => {
        setTick((prev) => {
          if (prev >= maxTicks) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return prev;
          }
          return prev + 1;
        });
      }, speed);

      // Sécurité si on quitte la page pendant la frappe
      return () => clearInterval(interval);
    }, startDelay);

    // Sécurité si on quitte la page avant même que la frappe commence
    return () => clearTimeout(timeoutId);
  }, [textJp, textFr, speed, decodeDelay, startDelay]);

  // Les calculs restent exactement les mêmes
  const jpCount = Math.min(tick, textJp.length);
  const delayTicks = Math.floor(decodeDelay / speed);
  const frCount = Math.max(0, Math.min(tick - delayTicks, textFr.length));

  const visibleFr = textFr.slice(0, frCount);
  const visibleJp = textJp.slice(frCount, jpCount);

  return (
    <span className="whitespace-pre-wrap">
      <span>{visibleFr}</span>
      <span className="text-neutral-400 font-medium">{visibleJp}</span>
    </span>
  );
}
