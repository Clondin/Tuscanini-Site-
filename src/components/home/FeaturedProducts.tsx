import type { MouseEvent as ReactMouseEvent } from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getProductById } from "../../data/products";
import type { Product } from "../../data/products";
import TextReveal from "../ui/TextReveal";
import TiltCard from "../ui/TiltCard";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import QuickViewButton from "../ui/QuickViewButton";
import QuickViewModal from "../ui/QuickViewModal";

const featuredProducts = [
  {
    id: "moscato-grape-juice",
    name: "Moscato Sparkling Grape Juice",
    tagline: "The jewel of every celebration",
    image: "/assets/Beverage/Moscato Juice/Mockups/71006931470.jpg",
    categorySlug: "beverages",
  },
  {
    id: "evoo-750ml",
    name: "Extra Virgin Olive Oil",
    tagline: "Cold-pressed from Italian groves",
    image: "/assets/Olive Oil/730406 Large.png",
    categorySlug: "olive-oil",
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
    id: "classic-marinara-sauce",
    name: "Classic Marinara Sauce",
    tagline: "Simple, pure, bursting with flavor",
    image: "/assets/Sauces/730207 Classic Marinara Sauce.jpg",
    categorySlug: "pasta-sauces",
  },
];

export default function FeaturedProducts() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (e: ReactMouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getProductById(productId);
    if (product) setQuickViewProduct(product);
  };

  return (
    <section className="py-28 px-6 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            Spotlight
          </span>
          <TextReveal
            text="Standout Selections"
            as="h2"
            mode="word"
            className="font-headline text-5xl md:text-6xl text-heading italic mb-6"
          />
          <p className="font-script text-on-surface/60 text-xl max-w-xl mx-auto italic">
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
              <TiltCard>
              <Link
                to={`/product/${product.id}`}
                className="group block bg-white/60 border border-on-surface/8 rounded-sm overflow-hidden hover:border-gold/30 transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface relative">
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <ImageWithSkeleton
                      className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      wrapperClassName="w-full h-full"
                      skeletonClassName="aspect-auto"
                      src={product.image}
                      alt={product.name}
                    />
                  </motion.div>
                  <QuickViewButton onClick={(e) => handleQuickView(e, product.id)} />
                </div>
                <div className="p-6">
                  <h3 className="font-headline text-xl text-heading mb-1 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-on-surface/50 text-sm italic mb-4">
                    {product.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-semibold group-hover:gap-3 transition-all">
                    View Product
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
