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
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,220,120,.15),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,.03),transparent_70%)]" />

      {/* Main Content */}
      <div className="relative w-72 h-60 flex flex-col items-center justify-center">

        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-amber-900/20 blur-3xl scale-75 animate-[softGlow_4s_ease-in-out_infinite]" />

        {/* Earrings (CLOSER NOW) */}
     <div className="relative z-10 flex gap-2 mb-0">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="earring origin-top"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
             <svg width="50" height="120" viewBox="0 0 90 220">
  <defs>
    <linearGradient id={`gold${i}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fff7d6" />
      <stop offset="40%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#8b5a00" />
    </linearGradient>
  </defs>

  {/* Floral Stud */}
 <g>
  {[0,45,90,135,180,225,270,315].map((r,n)=>(
    <ellipse
      key={n}
      cx="45"
      cy="25"
      rx="5"
      ry="13"
      fill="none"
      stroke={`url(#gold${i})`}
      strokeWidth="3"
      transform={`rotate(${r} 45 25)`}
    />
  ))}
  <circle
    cx="45"
    cy="25"
    r="10"
    fill={`url(#gold${i})`}
  />
  <rect
    x="40"
    y="20"
    width="10"
    height="10"
    rx="2"
    fill="#fff2b2"
    opacity=".4"
  />
</g>
{/* Connector Ring */}
{/* Small Ring */}
<circle cx="45"
 cy="48"
  r="6"
  fill="none"
  stroke={`url(#gold${i})`}
  strokeWidth="2.5"
/>
<path
  d="
    M32 58
    Q45 50 58 58
    Q60 64 55 72
    Q45 78 35 72
    Q30 64 32 58
    Z
  "
  fill={`url(#gold${i})`}
/>
{/* Top Highlight */}
<ellipse
  cx="45"
  cy="64"
  rx="8"
  ry="3"
  fill="white"
  opacity=".25"
/>
 {/* Main Jhumka Dome */}
  <path
  d="
    M18 72
    C22 120 68 120 72 72
    Z
  "
  fill={`url(#gold${i})`}
/>
  {/* Dome Strands */}
 {[22,28,34,40,45,50,56,62,68].map((x,n)=>(
  <path
    key={n}
    d={`M45 74 Q${x} 100 ${x} 136`}
    stroke="#fff2b2"
    strokeWidth="2"
    fill="none"
    opacity=".9"
  />
))}
  {/* Bottom Rim */}

  <rect
  x="18"
  y="132"
  width="54"
  height="8"
  rx="4"
  fill={`url(#gold${i})`}
/>

  {/* Hanging Loops */}

 {[22,30,38,46,54,62,70].map((x,n)=>(
  <circle
    key={n}
    cx={x}
    cy="147"
    r="4"
    fill="none"
    stroke={`url(#gold${i})`}
    strokeWidth="2"
  />
))}
  {/* Pearls */}

  {[22,30,38,46,54,62,70].map((x,n)=>(
  <g key={n}>
    <line
      x1={x}
      y1="150"
      x2={x}
      y2="164"
      stroke="#D4AF37"
      strokeWidth="1"
    />
    <circle
      cx={x}
      cy="168"
      r="4.5"
      fill="#fffef9"
    />
  </g>
))}
</svg>
            </div>
          ))}
        </div>

        {/* TEXT MOVED JUST BELOW EARRINGS */}
     <div className="relative z-10 -mt-2">
         <h2 className="text-4xl serif gold-gradient tracking-[0.30em] mb-0">
            LOLAKK
          </h2>
          <p className="text-gray-400 italic font-light tracking-wide text-sm">
            by Athira
          </p>
        </div>

      </div>

      {/* Progress Bar */}
     <div className="-mt-4 w-44 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-amber-500 animate-[progressBar_2.8s_linear_forwards]" />
      </div>

      {/* Styles */}
      <style>{`
        @keyframes softGlow {
          0%,100% { opacity:.45; transform:scale(.75); }
          50% { opacity:1; transform:scale(1); }
        }

        .serif {
          font-family:'Playfair Display',serif;
        }

        .gold-gradient {
          background: linear-gradient(to right, #b8860b, #fff2b2, #d4af37, #8b6508);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .earring {
          transform-origin:45px 12px;
           animation:swing 3.5s ease-in-out infinite;
          filter:drop-shadow(0 0 8px rgba(251,191,36,.35));
        }

        .dome {
          transform-origin:45px 40px;
          animation:domeLag 2.8s ease-in-out infinite;
        }

        @keyframes swing {
          0%,100% { transform:rotate(-16deg); }
          50% { transform:rotate(16deg); }
        }

        @keyframes domeLag {
          0%,100% { transform:rotate(-10deg); }
          50% { transform:rotate(10deg); }
        }
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