import { useState, useEffect } from "react";

const slides = [
  {
    image: "/necklace1.jpeg",
    product: "/model3.jpeg",
    title: "Royal Elegance",
  },
  {
    image: "/bg2.jpeg",
    product: "/modernGrace.png",
    title: "Modern Grace",
  },
  {
    image: "/necklace3.jpeg",
    product: "/model4.jpeg",
    title: "Timeless Tradition",
  },
];

export default function JewelryExperience() {
  const [active, setActive] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    setShowModel(false);
    setShowTitle(false);

    const modelTimer = setTimeout(() => {
      setShowModel(true);
    }, 1500);

    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 2200);

    const slideTimer = setTimeout(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      clearTimeout(modelTimer);
      clearTimeout(titleTimer);
      clearTimeout(slideTimer);
    };
  }, [active]);

  const next = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="jewelry"
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Background Jewellery */}
      <img
        src={slides[active].image}
        alt={slides[active].title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5500ms] scale-110"
      />

      {/* Dark Luxury Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Model */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={slides[active].product}
          alt={slides[active].title}
          className={`
            w-[260px]
            sm:w-[320px]
            md:w-[420px]
            lg:w-[520px]
            object-contain
            transition-all duration-1000
            ${
              showModel
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            }
          `}
        />
      </div>

      {/* Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 sm:pb-24 lg:pb-28">
        <h2
          className={`
            text-white
            text-2xl
            sm:text-4xl
            lg:text-6xl
            font-royal
            uppercase
            transition-all
            duration-1000
            ${
              showTitle
                ? "opacity-100 translate-y-0 tracking-[0.2em]"
                : "opacity-0 translate-y-8 tracking-[0.5em]"
            }
          `}
        >
          {slides[active].title}
        </h2>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white text-4xl z-20 hover:scale-125 transition"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white text-4xl z-20 hover:scale-125 transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}