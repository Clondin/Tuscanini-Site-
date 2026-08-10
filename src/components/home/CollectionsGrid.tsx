import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";

const featuredCategories = [
  {
    name: "Olive Oil",
    slug: "olive-oil",
    tagline: "Liquid gold of Italy",
    image: "/assets/Olive Oil/730406 Large.png",
  },
  {
    name: "Pasta & Gnocchi",
    slug: "pasta-gnocchi",
    tagline: "The heart of Italian cuisine",
    image: "/assets/Pasta/Tuscanini Classic Gnocci Mockup.png",
  },
  {
    name: "Pasta Sauces",
    slug: "pasta-sauces",
    tagline: "Sun-ripened perfection",
    image: "/assets/Sauces/730207.png",
  },
  {
    name: "Canned Tomatoes & Paste",
    slug: "canned-tomatoes",
    tagline: "Premium Italian tomato essentials",
    image: "/assets/Sauces/Tuscanini-Crushed-Tomatoes-730212.png",
  },
  {
    name: "Vinegars & Glazes",
    slug: "vinegars-glazes",
    tagline: "The art of Italian acidity",
    image: "/assets/Vinegar/Tuscanini-Balsamic-Vinegar-8.45-oz.png",
  },
  {
    name: "Chocolate",
    slug: "chocolate",
    tagline: "Italian chocolate excellence",
    image: "/assets/Chocolate/Chocolate Bars/730590.png",
  },
  {
    name: "Pizza",
    slug: "pizza",
    tagline: "Authentic Neapolitan tradition",
    image: "/assets/Pizza/730100.png",
  },
  {
    name: "Beverages",
    slug: "beverages",
    tagline: "Sparkling celebrations",
    image: "/assets/Beverage/730380.png",
  },
  {
    name: "Frozen Sides & Appetizers",
    slug: "bread-frozen-appetizers",
    tagline: "Crisp Italian favorites",
    image: "/assets/Foodservice/730142-eggplant-cutlets.webp",
  },
  {
    name: "Olives",
    slug: "olives",
    tagline: "Mediterranean treasures",
    image: "/assets/Olive/Tuscanini-Italian-Olive-Trio-Platter-730185.png",
  },
  {
    name: "Italian Condiments",
    slug: "italian-condiments",
    tagline: "Bold flavors of Italy",
    image: "/assets/Peppers/730438.png",
  },
  {
    name: "Potato Chips",
    slug: "potato-chips",
    tagline: "Italian olive oil crunch",
    image: "/assets/Chips/Tuscanini-Potato-Chips-with-Olive-Oil-Classic-4.6oz-730340.png",
  },
  {
    name: "Chestnuts",
    slug: "chestnuts",
    tagline: "Italian roasted goodness",
    image: "/assets/Chestnuts/Tuscanini Chestnuts_Original.png",
  },
  {
    name: "Tuna & Seafood",
    slug: "tuna-seafood",
    tagline: "Treasures of the Italian sea",
    image: "/assets/ads/tuna-parallax.jpg",
  },
  {
    name: "Cooking Wines & Citrus",
    slug: "cooking-wines-citrus",
    tagline: "Essential Italian kitchen staples",
    image: "/assets/Vinegar/730265-PRIMARY-SHOT.png",
  },
  {
    name: "Flour & Baking",
    slug: "flour-baking",
    tagline: "Professional grade Italian flour",
    image: "/assets/Flour/High gluten TUSCANINI_2,27Kg_2501013_facing.png",
  },
  {
    name: "Pesto",
    slug: "pesto",
    tagline: "Fresh basil, Italian tradition",
    image: "/assets/Pesto/730231.png",
  },
  {
    name: "Seasonings & Truffles",
    slug: "seasonings-truffles",
    tagline: "The essence of Italian flavor",
    image: "/assets/Truffles/730580.png",
  },
  {
    name: "Fruit Spreads",
    slug: "fruit-spreads",
    tagline: "Pure Italian fruit preserves",
    image: "/assets/Jam/730270.png",
  },
  {
    name: "Cheese",
    slug: "cheese",
    tagline: "Aged Italian excellence",
    image: "/assets/Parmesan Cheese/730170.png",
  },
];

export default function CollectionsGrid() {
  return (
    <section id="collections" className="bg-aged-cream py-20 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="The Pantry"
          title="Curated Collections"
          action={{ label: `All ${featuredCategories.length} collections`, to: "/#collections" }}
          className="mb-11"
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-9">
          {featuredCategories.slice(0, 9).map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.06, duration: 0.55 }}
            >
              <Link to={`/category/${cat.slug}`} className="group block text-inherit">
                <div className="aspect-[4/3] bg-surface border border-on-surface/10 flex items-center justify-center overflow-hidden">
                  <ImageWithSkeleton
                    className="w-full h-full object-contain p-5 md:p-[26px] drop-shadow-[0_12px_18px_rgba(42,31,22,0.14)] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    wrapperClassName="w-full h-full"
                    skeletonClassName="aspect-auto"
                    src={cat.image}
                    alt={cat.name}
                  />
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-headline font-normal text-lg md:text-[21px] text-heading group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-on-surface/60">{cat.tagline}</p>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] shrink-0 text-primary/75 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
