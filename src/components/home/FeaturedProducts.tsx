import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const featuredProducts = [
  {
    id: "moscato-grape-juice",
    name: "Moscato Sparkling Grape Juice",
    tagline: "The jewel of every celebration",
    image: "/assets/Beverage/Moscato Juice/Mockups/71006931470.jpg",
    categorySlug: "beverages",
  },
  {
    id: "focaccia-bread",
    name: "Focaccia Bread",
    tagline: "Double-risen with extra virgin olive oil",
    image:
      "/assets/Focaccia Bread/Comps/Tuscasnini Focaccia Comp 6 copy.jpg",
    categorySlug: "bakery",
  },
  {
    id: "chocolate-bar-collection",
    name: "Italian Chocolate Bars",
    tagline: "Art you can taste",
    image:
      "/assets/Chocolate Bars/pisa large 3 LARGER OPTION Topaz Gigapixel 2x scale copy.jpg",
    categorySlug: "chocolate",
  },
  {
    id: "chocolate-truffle-pistachio",
    name: "Pistachio Chocolate Truffles",
    tagline: "Sicilian pistachios meet fine chocolate",
    image: "/assets/Chocolate Truffle/Info/Pistachio/image001.png",
    categorySlug: "chocolate",
  },
  {
    id: "sparkling-lemonade",
    name: "Sparkling Lemonade",
    tagline: "Bright Sicilian citrus in every sip",
    image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 1.jpg",
    categorySlug: "beverages",
  },
  {
    id: "panini-bread",
    name: "Panini Bread",
    tagline: "Classic Italian pressed sandwiches",
    image: "/assets/Focaccia Bread/Comps/Tuscasnini Panini Comp 3 copy.jpg",
    categorySlug: "bakery",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-28 px-6 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            Spotlight
          </span>
          <h2 className="font-headline text-5xl md:text-6xl text-heading italic mb-6">
            Standout Selections
          </h2>
          <p className="font-serif-alt text-on-surface/60 text-lg max-w-xl mx-auto italic">
            A hand-picked curation of our most beloved products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts
            .filter((product) => product.image)
            .map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group block bg-white/60 border border-on-surface/8 rounded-sm overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline text-xl text-heading mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-on-surface/50 text-sm italic mb-4">
                    {product.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold group-hover:gap-3 transition-all">
                    View Product
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
