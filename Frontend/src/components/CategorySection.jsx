export default function CategorySection() {
  const categories = [
    { name: "Earrings", image: "/earingred.jpeg", link: "/earrings" },
    { name: "Necklaces", image: "/necklace4.jpeg", link: "/necklaces-pendants" },
    { name: "Rings", image: "ring2.jpeg", link: "/rings" },
    { name: "Bangles", image: "bangle2.jpeg", link: "/bracelets-bangles" },
    { name: "Rentals", image: "/rental.jpeg", link: "/rental" },
    { name: "Hair", image: "/hair.jpeg", link: "/hair-accessories" },
    { name: "Kids", image: "/kids.jpeg", link: "/kids" },
    { name: "customer FAV", image: "/necklace.jpeg", link: "/trending" },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl serif mb-2">Shop by Category</h2>
        <div className="w-12 h-1 bg-amber-600 mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((item) => (
          <a key={item.name} href={item.link} className="group">
            <div className="overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="h-72 w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <h3 className="text-center mt-4 uppercase tracking-widest">
              {item.name}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}