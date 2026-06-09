import { useEffect } from "react";

export default function Collection() {
  const products = [
    {
      id: 1,
      name: "Antique Gold",
      tag: "Kerala Heritage",
      image:
        "highlight.png",
    },
    {
      id: 2,
      name: "Chandbali Earing",
      tag: "Antique collection",
      image:
        "earing1.jpeg",
    },
    {
      id: 3,
      name: "Antique Gold",
      tag: "Temble collection",
      image:
        "highlight3.jpeg",
    },
  ];

  // 🔥 Parallax Mouse Effect
  useEffect(() => {
    const cards = document.querySelectorAll(".parallax-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * 10;
        const rotateY = ((x / rect.width) - 0.5) * -10;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }, []);

  return (
    <section id="collection" className="py-24 px-6 max-w-7xl mx-auto">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl serif mb-2">Curated Highlights</h2>
        <div className="w-12 h-1 bg-amber-600 mx-auto"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {products.map((item, index) => (
          <div
            key={item.id}
            className="parallax-card float group relative aspect-[3/4] overflow-hidden rounded-xl bg-black/60 backdrop-blur border border-white/10 transition duration-500"
            style={{ animationDelay: `${index}s` }}
          >
            {/* Background */}
            <div className="parallax-bg h-full w-full">
              <img
                src={item.image}
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition duration-700"
                alt={item.name}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent"></div>

            {/* Content */}
            <div className="parallax-inner absolute bottom-6 left-6">
              <h3 className="serif text-xl">{item.name}</h3>
              <p className="text-amber-500 text-[10px] uppercase tracking-widest mt-1">
                {item.tag}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}