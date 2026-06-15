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
  className="w-full overflow-hidden bg-black text-white relative"
>      
      {/* SLIDER */}
<div className="h-full scale-[0.7] md:scale-100 origin-center">
  <div
    className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${active * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
<div
  key={i}
className="w-full h-full flex-shrink-0 flex">            
            {/* LEFT IMAGE */}
<div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">             
 <img
                src={slide.image}
                className="w-full h-full object-cover scale-110 hover:scale-100 transition duration-1000"
              />
            </div>

            {/* RIGHT CONTENT */}
<div className="w-1/2 h-full flex flex-col justify-center items-center bg-neutral-900">    
          <h2 className="font-royal text-2xl sm:text-3xl md:text-6xl tracking-[0.15em] md:tracking-[0.25em] uppercase mb-6 md:mb-8 text-white drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
              {slide.title} 
              </h2> 

              <img
                src={slide.product}
className="w-[180px] sm:w-[220px] md:w-[380px] object-contain transition duration-700 hover:scale-105"              />
            </div>

          </div>
        ))}
      </div>
      </div>

      {/* CONTROLS */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-3xl"
      >
        ›
      </button>

    </section>
  );
}