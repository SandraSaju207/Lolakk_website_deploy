"use client";
import { useState, useEffect } from "react";

export default function KeralaLuxuryHomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (2.5 seconds to match animations)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // LOADER VIEW
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-900/20 blur-3xl transform scale-75 animate-[softGlow_4s_ease-in-out_infinite]"></div>
          <div className="relative z-10 w-32 h-32 text-amber-400/90 animate-[iconBreathe_3s_ease-in-out_infinite]">
            <svg viewBox="0 0 100 100" fill="currentColor" className="drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              <defs>
                <linearGradient id="handGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <path
                fill="url(#handGradient)"
                d="M50 10 C 55 25, 65 35, 65 55 C 65 75, 55 85, 50 90 C 45 85, 35 75, 35 55 C 35 35, 45 25, 50 10 Z M50 20 C 52 30, 58 38, 58 55 C 58 68, 54 75, 50 80 C 46 75, 42 68, 42 55 C 42 38, 48 30, 50 20 Z"
              />
              <rect x="49.5" y="15" width="1" height="70" fill="#fef3c7" opacity="0.5" />
            </svg>
          </div>
          <div className="mt-6 relative z-10">
            <h2 className="text-3xl md:text-4xl serif gold-gradient tracking-[0.25em] mb-1">LOLAKK</h2>
            <p className="text-gray-400 italic font-light text-sm tracking-wide">by Athira</p>
          </div>
        </div>
        <div className="mt-12 w-48 h-[1px] bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-amber-500 animate-[progressBar_2.5s_linear_forwards]"></div>
        </div>
        <style>{`
          @keyframes softGlow { 0%, 100% { opacity: 0.5; transform: scale(0.75); } 50% { opacity: 1; transform: scale(1); } }
          @keyframes iconBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.03); opacity: 1; } }
          @keyframes progressBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(0%); } }
          .serif { font-family: 'Playfair Display', serif; }
          .gold-gradient { background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309); -webkit-background-clip: text; background-clip: text; color: transparent; }
        `}</style>
      </div>
    );
  }

  // --- Main Content (Unchanged, incorporating 'Kerala' connection) ---
  return (
   <section
  id="home"
  className="relative h-screen flex items-center justify-center text-center overflow-hidden"
>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-30"
          alt="Luxury Jewelry Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
      </div>

     <div className="relative z-10 px-4 sm:px-6 py-12 md:py-20 w-full max-w-5xl mx-auto">
        <span className="text-amber-500 uppercase tracking-[0.5em] text-[10px] mb-6 block">Est. 2025 • Kerala</span>
        <h1 className="relative overflow-hidden inline-block text-5xl sm:text-6xl md:text-8xl serif mb-6 leading-tight bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600 bg-clip-text text-transparent px-2
                       after:content-[''] after:absolute after:top-0 after:left-[-150%] after:w-1/2 after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:skew-x-[-20deg] after:animate-[shimmerOnce_3s_ease_forwards]">
          Lolakk{" "}
          <span className="italic text-gray-500 font-light text-2xl sm:text-3xl md:text-6xl block md:inline-block md:ml-4">by Athira</span>
        </h1>
        <p className="max-w-md md:max-w-xl mx-auto text-gray-400 mb-10 text-xs md:text-sm tracking-wide leading-relaxed">Redefining traditional elegance for the modern soul. Pure gold, timeless craftsmanship from Kerala.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
          <a href="#jewelry" className="w-full sm:w-auto border border-amber-500/50 text-amber-500 px-10 py-4 hover:bg-amber-500 hover:text-black uppercase text-[10px] tracking-widest transition-all duration-300">Explore Collection</a>
          <a href="#collection" className="w-full sm:w-auto border border-white/20 text-white px-10 py-4 hover:bg-white hover:text-black uppercase text-[10px] tracking-widest transition-all duration-300">View Catalog</a>
        </div>
      </div>

      {/* Animation Definitions */}
      <style jsx global>{`
        /* --- Loader Animations --- */
        @keyframes softGlow {
          0%, 100% { opacity: 0.5; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes iconBreathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }

        /* --- Main Content Animations --- */
        .serif { font-family: 'Playfair Display', serif; }
        .gold-gradient {
          background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @keyframes shimmerOnce {
          0% { left: -150%; }
          100% { left: 150%; }
        }
      `}</style>
    </section>
  );
}