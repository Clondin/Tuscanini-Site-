import type { ComponentType, SVGProps, MouseEvent } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Utensils,
  ArrowRight,
  Wheat,
  UtensilsCrossed,
  Droplets,
  Flame,
  Cookie,
  Fish,
  IceCreamBowl,
  Snowflake,
  Wine,
  Croissant,
  Candy,
  Leaf,
} from "lucide-react";

const featuredCategories = [
  {
    name: "Beverages",
    slug: "beverages",
    tagline: "Sparkling Celebrations",
    image: "/assets/ads/sparkling-parallax.jpg",
  },
  {
    name: "Pasta & Gnocchi",
    slug: "pasta-gnocchi",
    tagline: "The Heart of Italian Cuisine",
    image: "/assets/ads/gnocchi-recipe.jpg",
  },
  {
    name: "Pizza",
    slug: "pizza",
    tagline: "Authentic Neapolitan Tradition",
    image: "/assets/ads/pizza-banner.jpg",
  },
  {
    name: "Olive Oil & Vinegars",
    slug: "olive-oil-vinegars",
    tagline: "Liquid Gold of Italy",
    image: "/assets/ads/balsamic-glaze.jpg",
  },
  {
    name: "Sauces & Tomato Products",
    slug: "sauces-tomatoes",
    tagline: "Sun-Ripened Perfection",
    image: "/assets/ads/marinara-banner.jpg",
  },
  {
    name: "Chocolate",
    slug: "chocolate",
    tagline: "Italian Chocolate Excellence",
    image: "/assets/Chocolate Bars/pisa large 3 LARGER OPTION Topaz Gigapixel 2x scale copy.jpg",
  },
  {
    name: "Olives & Condiments",
    slug: "olives-condiments",
    tagline: "Mediterranean Essentials",
    image: "/assets/ads/ketchup-banner.jpg",
  },
  {
    name: "Crackers & Snacks",
    slug: "crackers-snacks",
    tagline: "Artisan Italian Snacking",
    image: "/assets/ads/lemon-juice-focused.jpg",
  },
  {
    name: "Tuna & Seafood",
    slug: "tuna-seafood",
    tagline: "Treasures of the Italian Sea",
    image: "/assets/ads/tuna-parallax.jpg",
  },
  {
    name: "Gelato & Sorbetto",
    slug: "gelato",
    tagline: "Frozen Italian Indulgence",
    image: "/assets/Gelato/730520-chocolate-gelato.png",
  },
  {
    name: "Bakery",
    slug: "bakery",
    tagline: "Fresh From the Italian Oven",
    image: "/assets/Focaccia Bread/Comps/Tuscasnini Focaccia Comp 6 copy.jpg",
  },
  {
    name: "Frozen & Ready Meals",
    slug: "frozen-meals",
    tagline: "Italian Convenience, No Compromise",
    image: "/assets/ads/chef-pasta.jpg",
  },
];

const placeholderGradients = [
  "from-[#e8d5c4] via-[#d4bfad] to-[#f0e2d4]",
  "from-[#d5e0d6] via-[#b8ccae] to-[#e2edd5]",
  "from-[#e0d0cc] via-[#cdb8ae] to-[#ede0d8]",
  "from-[#d8dce4] via-[#bfc8d6] to-[#e8ecf2]",
  "from-[#e2d6cc] via-[#d0bfb2] to-[#ede2d8]",
  "from-[#ddd5c8] via-[#ccc0ad] to-[#ede5d8]",
  "from-[#d8d8e2] via-[#c4c4d6] to-[#e8e8f0]",
  "from-[#e0d5cc] via-[#ccbfb2] to-[#ede2d8]",
  "from-[#d0d8e0] via-[#b8c8d4] to-[#e0e8ee]",
  "from-[#ddd5cc] via-[#ccbfad] to-[#ede2d4]",
  "from-[#d8d5cc] via-[#c8c2b2] to-[#e8e5d8]",
  "from-[#ccddd8] via-[#b2ccc4] to-[#deedea]",
];

const categoryIconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  beverages: Wine,
  "pasta-gnocchi": Wheat,
  pizza: UtensilsCrossed,
  "olive-oil-vinegars": Droplets,
  "sauces-tomatoes": Flame,
  chocolate: Candy,
  "olives-condiments": Leaf,
  "crackers-snacks": Cookie,
  "tuna-seafood": Fish,
  gelato: IceCreamBowl,
  bakery: Croissant,
  "frozen-meals": Snowflake,
};

export default function CollectionsGrid() {
  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="collections" className="py-28 px-6 bg-aged-cream relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            The Pantry
          </span>
          <h2 className="font-headline text-5xl md:text-6xl text-heading italic mb-6">
            Curated Collections
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-px bg-primary/30" />
            <Utensils className="w-5 h-5 text-primary/40" />
            <div className="w-16 h-px bg-primary/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredCategories.map((cat, idx) => {
            const CategoryIcon = categoryIconMap[cat.slug] || Utensils;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="still-life-frame group block cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden mb-6 bg-surface ring-1 ring-on-surface/10">
                    {cat.image ? (
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        src={cat.image}
                        alt={cat.name}
                      />
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${placeholderGradients[idx % placeholderGradients.length]} relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 opacity-[0.06]" style={{
                          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,44,32,0.3) 1px, transparent 0)",
                          backgroundSize: "24px 24px",
                        }} />
                        <div className="absolute inset-0 border border-on-surface/[0.06]" />
                        <CategoryIcon className="w-16 h-16 text-heading/20 mb-5 relative z-10" />
                        <span className="font-headline text-2xl text-heading/60 text-center px-6 relative z-10">
                          {cat.name}
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-headline text-2xl text-primary mb-2 group-hover:text-heading transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-on-surface/60 text-sm leading-relaxed">
                        {cat.tagline}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="#collections"
            onClick={(e) => handleSmoothScroll(e, "collections")}
            className="inline-flex items-center gap-3 text-primary text-sm uppercase tracking-widest font-semibold hover:gap-4 transition-all border border-primary/20 px-8 py-4 rounded-sm hover:border-primary/50"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
