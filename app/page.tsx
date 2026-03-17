import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    // J'ai changé pb-24 en pb-48 ici pour remonter tout le bloc
    <main className="relative w-full h-screen bg-black flex flex-col items-center justify-end overflow-hidden pb-48">
      {/* Image de fond de la couverture */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/cover.jpg" 
          alt="Rafamaru et les 7 TC" 
          fill 
          priority
          className="object-cover object-top" 
        />
        {/* Un petit voile noir dégradé en bas pour que le bouton soit bien lisible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Bouton par-dessus */}
      <div className="relative z-10 flex flex-col items-center">
        <Link 
          href="/lire/1" 
          className="px-8 py-4 bg-orange-500 hover:bg-orange-600 border-4 border-white text-white font-black text-2xl rounded-full transition-transform hover:scale-110 shadow-[0_0_15px_rgba(255,165,0,0.7)]"
        >
          COMMENCER L'HISTOIRE
        </Link>
      </div>
    </main>
  );
}