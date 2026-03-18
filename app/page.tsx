"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="relative w-full h-screen bg-black overflow-hidden">
            {/* Image de fond brute sans dégradé pour ne pas cacher le titre "Rafamaru" */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/cover.jpg"
                    alt="Rafamaru et les 7 TC"
                    fill
                    priority
                    className="object-cover object-top"
                />
            </div>

            {/* Bouton positionné en haut à droite - Ajusté plus haut (top-12) */}
            <div className="absolute top-12 right-24 z-20">
                <Link href="/lire/1">
                    <button
                        className="px-10 py-5 bg-white border-[3px] border-black text-black text-3xl transition-transform hover:scale-110 active:scale-95 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        style={{
                            fontFamily: "'Manga Temple', sans-serif",
                            letterSpacing: '2px'
                        }}
                    >
                        COMMENCER L'HISTOIRE
                    </button>
                </Link>
            </div>

            {/* CSS Inline pour charger la police proprement si tu ne l'as pas encore fait dans globals.css */}
            <style jsx global>{`
        @font-face {
          font-family: 'Manga Temple';
          src: url('/font/mangati.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
        </main>
    );
}
