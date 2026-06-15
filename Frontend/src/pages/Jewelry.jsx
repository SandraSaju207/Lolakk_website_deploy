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
  className="w-full bg-black text-white relative"
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
            {/* LEFT IMAGE */}
<div className="w-full lg:w-1/2 h-[280px] sm:h-[400px] lg:h-[650px] overflow-hidden">
  <img
    src={slide.image}
    className="w-full h-full object-cover transition duration-700"
    alt={slide.title}
  />
</div>

            {/* RIGHT CONTENT */}
<div className="w-full lg:w-1/2 h-[280px] sm:h-[400px] lg:h-[650px] bg-neutral-900 flex flex-col justify-center items-center px-6 text-center">
  <h2 className="font-royal text-2xl sm:text-4xl lg:text-6xl tracking-wider uppercase mb-6">
    {slide.title}
  </h2>

  <img
    src={slide.product}
    alt={slide.title}
    className="w-[180px] sm:w-[250px] lg:w-[380px] object-contain transition duration-700 hover:scale-105"
  />
</div>

          </div>
        ))}
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