import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Image de fond de la couverture */}
      <div className="absolute inset-0 z-0 opacity-80">
        {/* Remplace par le bon chemin vers ton image */}
        {/* <Image src="/images/cover.jpg" alt="Rafamaru Cover" fill className="object-cover" /> */}
        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/20">
          [Image Couverture Rafamaru]
        </div>
      </div>

      {/* Contenu par-dessus */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <h1 className="text-6xl font-bold text-white tracking-widest drop-shadow-lg">
          RAFAMARU
        </h1>
        
        <Link 
          href="/lire/1" 
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xl rounded-full transition-transform hover:scale-105"
        >
          Commencer l'histoire
        </Link>
      </div>
    </main>
  );
}