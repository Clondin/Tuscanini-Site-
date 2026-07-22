import type { ComponentType, SVGProps } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import TextReveal from "../ui/TextReveal";
import TiltCard from "../ui/TiltCard";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import {
  Utensils,
  ArrowRight,
  Wheat,
  UtensilsCrossed,
  Droplets,
  Flame,
  Cookie,
  Fish,
  Wine,
  Candy,
  Leaf,
} from "lucide-react";

const featuredCategories = [
  {
    name: "Beverages",
    slug: "beverages",
    tagline: "Sparkling Celebrations",
    image: "/assets/Beverage/Moscato Juice/Mockups/71006931470.jpg",
  },
  {
    name: "Pasta & Gnocchi",
    slug: "pasta-gnocchi",
    tagline: "The Heart of Italian Cuisine",
    image: "/assets/Pasta/Tuscanini Classic Gnocci Mockup.png",
  },
  {
    name: "Pizza",
    slug: "pizza",
    tagline: "Authentic Neapolitan Tradition",
    image: "/assets/Pizza/730100.png",
  },
  {
    name: "Frozen Sides & Appetizers",
    slug: "bread-frozen-appetizers",
    tagline: "Crisp Italian Favorites",
    image: "/assets/Foodservice/730142-eggplant-cutlets.webp",
  },
  {
    name: "Olive Oil",
    slug: "olive-oil",
    tagline: "Liquid Gold of Italy",
    image: "/assets/Olive Oil/730406 Large.png",
  },
  {
    name: "Vinegars & Glazes",
    slug: "vinegars-glazes",
    tagline: "The Art of Italian Acidity",
    image: "/assets/Vinegar/Tuscanini-Balsamic-Vinegar-8.45-oz.png",
  },
  {
    name: "Pasta Sauces",
    slug: "pasta-sauces",
    tagline: "Sun-Ripened Perfection",
    image: "/assets/Sauces/730207.png",
  },
  {
    name: "Canned Tomatoes & Paste",
    slug: "canned-tomatoes",
    tagline: "Premium Italian Tomato Essentials",
    image: "/assets/Sauces/Tuscanini-Crushed-Tomatoes-730212.png",
  },
  {
    name: "Chocolate",
    slug: "chocolate",
    tagline: "Italian Chocolate Excellence",
    image: "/assets/Chocolate/Chocolate Bars/730590.png",
  },
  {
    name: "Olives",
    slug: "olives",
    tagline: "Mediterranean Treasures",
    image: "/assets/Olive/Tuscanini-Italian-Olive-Trio-Platter-730185.png",
  },
  {
    name: "Italian Condiments",
    slug: "italian-condiments",
    tagline: "Bold Flavors of Italy",
    image: "/assets/Peppers/730438.png",
  },
  {
    name: "Potato Chips",
    slug: "potato-chips",
    tagline: "Italian Olive Oil Crunch",
    image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Classic-4.6oz-730340.png",
  },
  {
    name: "Chestnuts",
    slug: "chestnuts",
    tagline: "Italian Roasted Goodness",
    image: "/assets/Chestnuts/Tuscanini Chestnuts_Original.png",
  },
  {
    name: "Tuna & Seafood",
    slug: "tuna-seafood",
    tagline: "Treasures of the Italian Sea",
    image: "/assets/ads/tuna-parallax.jpg",
  },
  {
    name: "Cooking Wines & Citrus",
    slug: "cooking-wines-citrus",
    tagline: "Essential Italian Kitchen Staples",
    image: "/assets/Vinegar/730265-PRIMARY-SHOT.png",
  },
  {
    name: "Flour & Baking",
    slug: "flour-baking",
    tagline: "Professional Grade Italian Flour",
    image: "/assets/Flour/High gluten TUSCANINI_2,27Kg_2501013_facing.png",
  },
  {
    name: "Pesto",
    slug: "pesto",
    tagline: "Fresh Basil, Italian Tradition",
    image: "/assets/Pesto/730231.png",
  },
  {
    name: "Seasonings & Truffles",
    slug: "seasonings-truffles",
    tagline: "The Essence of Italian Flavor",
    image: "/assets/Truffles/730580.png",
  },
  {
    name: "Fruit Spreads",
    slug: "fruit-spreads",
    tagline: "Pure Italian Fruit Preserves",
    image: "/assets/Jam/730270.png",
  },
  {
    name: "Cheese",
    slug: "cheese",
    tagline: "Aged Italian Excellence",
    image: "/assets/Parmesan Cheese/730170.png",
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
  "bread-frozen-appetizers": UtensilsCrossed,
  "olive-oil": Droplets,
  "vinegars-glazes": Droplets,
  "cooking-wines-citrus": Wine,
  "pasta-sauces": Flame,
  "canned-tomatoes": Flame,
  chocolate: Candy,
  olives: Leaf,
  "italian-condiments": Flame,
  "potato-chips": Cookie,
  chestnuts: Leaf,
  "tuna-seafood": Fish,
  "flour-baking": Wheat,
  pesto: Leaf,
  "seasonings-truffles": Flame,
  "fruit-spreads": Candy,
  cheese: Utensils,
};

export default function CollectionsGrid() {
  return (
    <section id="collections" className="py-16 md:py-20 px-6 bg-aged-cream relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <span className="text-burnt-terracotta font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            The Pantry
          </span>
          <TextReveal
            text="Curated Collections"
            as="h2"
            mode="word"
            className="font-headline text-4xl md:text-5xl text-heading italic mb-6"
          />
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-px bg-gold/30" />
            <Utensils className="w-5 h-5 text-primary" />
            <div className="w-16 h-px bg-gold/30" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
          {featuredCategories.slice(0, 9).map((cat, idx) => {
            const CategoryIcon = categoryIconMap[cat.slug] || Utensils;
            return (
              <motion.div
                key={cat.slug}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
              >
                <TiltCard>
                <Link
                  to={`/category/${cat.slug}`}
                  className="still-life-frame group block cursor-pointer"
                >
                  <div
                    className="aspect-[4/3] overflow-hidden mb-4 bg-earth-dark/50 ring-1 ring-on-surface/10 relative"
                  >
                    {cat.image ? (
                      <motion.div
                        whileHover={{ scale: 1.035 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-3 md:inset-4 bg-white/80 border border-on-surface/8 shadow-sm overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.95),rgba(255,255,255,0.45))]" />
                        <ImageWithSkeleton
                          className="relative z-10 w-full h-full object-contain p-3 md:p-5 opacity-95 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_10px_14px_rgba(42,31,22,0.14)]"
                          wrapperClassName="w-full h-full"
                          skeletonClassName="aspect-auto"
                          src={cat.image}
                          alt={cat.name}
                        />
                      </motion.div>
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
                      <h3 className="font-headline text-lg md:text-2xl text-heading mb-1 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="hidden sm:block text-on-surface/70 text-sm leading-relaxed">
                        {cat.tagline}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary/70 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
