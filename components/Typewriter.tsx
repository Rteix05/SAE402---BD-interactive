"use client";

import { useState, useEffect, useMemo } from 'react';

// Lettres Katakana pour l'effet visuel
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const getRandomJpChar = () => KATAKANA[Math.floor(Math.random() * KATAKANA.length)];

// Pour ne pas transformer la ponctuation en japonais
const isPunctuation = (char: string) => /[ .,!?'-]/.test(char);

interface TypewriterProps {
  text: string;
  speed?: number;       // Vitesse de frappe (ex: 40ms par lettre)
  decodeDelay?: number; // Délai avant la transformation en FR (ex: 500ms)
}

export default function Typewriter({ text, speed = 40, decodeDelay = 500 }: TypewriterProps) {
  const [jpCount, setJpCount] = useState(0); // Combien de lettres JP affichées
  const [frCount, setFrCount] = useState(0); // Combien de lettres FR ont remplacé le JP

  // On génère la phrase japonaise une seule fois pour éviter que les lettres clignotent
  const jpString = useMemo(() => {
    return text.split('').map(char => (isPunctuation(char) ? char : getRandomJpChar()));
  }, [text]);

  useEffect(() => {
    setJpCount(0);
    setFrCount(0);

    // 1. La machine à écrire commence en JAPONAIS
    const jpInterval = setInterval(() => {
      setJpCount(prev => {
        if (prev < text.length) return prev + 1;
        clearInterval(jpInterval);
        return prev;
      });
    }, speed);

    // 2. On attend le délai (0.5s), puis la machine à écrire FRANÇAISE démarre et remplace le JP
    const timeout = setTimeout(() => {
      const frInterval = setInterval(() => {
        setFrCount(prev => {
          if (prev < text.length) return prev + 1;
          clearInterval(frInterval);
          return prev;
        });
      }, speed);

      // Sécurité si le composant disparaît
      return () => clearInterval(frInterval);
    }, decodeDelay);

    // Nettoyage global
    return () => {
      clearInterval(jpInterval);
      clearTimeout(timeout);
    };
  }, [text, speed, decodeDelay]);

  return (
    <span>
      {text.split('').map((char, index) => {
        // 1. La lettre n'est pas encore arrivée du tout
        if (index >= jpCount) return null;

        // 2. La lettre a été rattrapée par le français
        if (index < frCount) {
          return <span key={`fr-${index}`}>{char}</span>;
        }

        // 3. La lettre vient d'apparaître, elle est en japonais (en attendant le français)
        return (
          <span key={`jp-${index}`} className="text-neutral-500 font-medium">
            {jpString[index]}
          </span>
        );
      })}
    </span>
  );
}