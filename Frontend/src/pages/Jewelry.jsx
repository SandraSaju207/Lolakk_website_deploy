import { useState, useEffect } from "react";

const slides = [
  {
    image: "necklace1.jpeg",
    product: "model3.jpeg",
    title: "Royal Elegance",
  },
  {
    image: "/bg2.jpeg",
    product: "/modernGrace.png",
    title: "Modern Grace",
  },
  {
    image: "necklace3.jpeg",
    product: "model4.jpeg",
    title: "Timeless Tradition",
  },
];

export default function JewelryExperience() {
  const [active, setActive] = useState(0);

  const next = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // ✅ AUTOPLAY
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000); // change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
<section
  id="jewelry"
  className="w-full bg-black text-white relative overflow-hidden"
>    
      {/* SLIDER */}

  <div
  className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${active * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
<div
  key={i}
  className="w-full flex-shrink-0 flex flex-col lg:flex-row"
>       
<p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-2">
  Signature Collection
</p>

            {/* LEFT IMAGE */}
<div className="relative w-full lg:w-1/2 h-[250px] sm:h-[450px] lg:h-[650px] overflow-hidden">
  <img
    src={slide.image}
   className="w-full h-full object-cover"
    alt={slide.title}
  />
</div>

            {/* RIGHT CONTENT */}
<div className="
w-full
lg:w-1/2
h-[250px]
sm:h-[450px]
lg:h-[650px]
bg-gradient-to-b
from-[#111]
to-black
flex
flex-col
justify-center
items-center
px-4
sm:px-6
text-center
">
  <h2 className="
font-royal
text-2xl
sm:text-3xl
lg:text-6xl
tracking-[0.18em]
uppercase
mb-3
lg:mb-6
bg-gradient-to-r
from-[#d4af37]
via-[#f5e6b3]
to-[#d4af37]
bg-clip-text
text-transparent
">
    {slide.title}
  </h2>

  <img
    src={slide.product}
    alt={slide.title}
   className="
w-[170px]
sm:w-[250px]
lg:w-[380px]
object-contain
transition
duration-700
hover:scale-105
drop-shadow-[0_0_20px_rgba(212,175,55,0.25)]
"
  />
</div>

          </div>
        ))}
      </div>
      

      {/* CONTROLS */}
      <button
        onClick={prev}
       className="
absolute
left-3
sm:left-5
top-1/2
-translate-y-1/2
w-10
h-10
rounded-full
bg-black/50
backdrop-blur-md
border
border-[#d4af37]/30
text-[#d4af37]
text-xl
z-20
hover:bg-[#d4af37]
hover:text-black
transition
"
      >
        ‹
      </button>

      <button
        onClick={next}
       className="
absolute
right-3
sm:right-5
top-1/2
-translate-y-1/2
w-10
h-10
rounded-full
bg-black/50
backdrop-blur-md
border
border-[#d4af37]/30
text-[#d4af37]
text-xl
z-20
hover:bg-[#d4af37]
hover:text-black
transition
"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
  {slides.map((_, i) => (
    <button
      key={i}
      onClick={() => setActive(i)}
      className={`h-2 rounded-full transition-all duration-300 ${
        active === i
          ? "w-8 bg-[#d4af37]"
          : "w-2 bg-white/40"
      }`}
    />
  ))}
</div>

    </section>
  );
}