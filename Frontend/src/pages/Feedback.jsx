import { useEffect } from "react";

export default function Feedback() {
 const gallery = [
  {
    id: 1,
    type: "image",
    src: "highlight3.jpeg",
    className: "md:row-span-2",
  },
  {
    id: 2,
    type: "image",
    src: "earing1.jpeg",
    className: "md:col-span-2",
    tag: "#MyLolakkStory",
  },
  {
    id: 3,
    type: "image",
    src: "earing2.jpeg",
  },
  {
    id: 4,
    type: "image",
    src: "highlight2.jpeg",
  },
  {
    id: 5,
    type: "image",
    src: "earingred.jpeg",
  },

  {
    id: 6,
    type: "image",
    src: "necklace1.jpeg",
    className: "md:col-span-2",
    tag: "#MyLolakkStory",
  },
];

  useEffect(() => {
    // 🔥 Load Instagram script
    // 🔥 Load Instagram script
const existingScript = document.querySelector(
  'script[src="https://www.instagram.com/embed.js"]'
);

if (!existingScript) {
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;

  script.onload = () => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };

  document.body.appendChild(script);
} else if (window.instgrm) {
  window.instgrm.Embeds.process();
}

    // 🔥 Parallax Tilt
    const cards = document.querySelectorAll(".parallax-card");

    const handleMouseMove = (card) => (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rX = -(y - rect.height / 2) / 20;
      const rY = (x - rect.width / 2) / 20;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rX}deg)
        rotateY(${rY}deg)
        scale(1.03)
      `;
    };

    const handleMouseLeave = (card) => () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    cards.forEach((card) => {
      const move = handleMouseMove(card);
      const leave = handleMouseLeave(card);

      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);

      card._move = move;
      card._leave = leave;
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", card._move);
        card.removeEventListener("mouseleave", card._leave);
      });
    };
  }, []);

  return (
    <section
      id="feedback"
      className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5"
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <span className="text-amber-500 uppercase tracking-[0.5em] text-[10px] mb-2 block">
          As seen on Instagram
        </span>
        <h2 className="text-4xl serif mb-2 gold-gradient">
          The #LolakkStyle
        </h2>
        <p className="text-gray-500 text-sm italic">
          Join our community of elegance
        </p>
      </div>

      {/* Grid */}
 {/* Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[420px]">
  {gallery.map((item) => (
    <div
      key={item.id}
      className={`parallax-card relative overflow-hidden rounded-3xl glass group ${
        item.className || ""
      }`}
    >
      {/* IMAGE */}
      <img
        src={item.src}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
        alt=""
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-500"></div>

      {/* Tag */}
      {item.tag && (
        <div className="absolute bottom-5 left-5 z-10">
          <p className="text-amber-400 text-xs uppercase font-semibold tracking-[0.2em]">
            {item.tag}
          </p>
        </div>
      )}
    </div>
  ))}
</div>
    </section>
  );
}