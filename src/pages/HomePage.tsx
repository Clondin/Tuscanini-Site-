import type { ComponentType, SVGProps, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Utensils,
  Award,
  ShieldCheck,
  Leaf,
  ArrowRight,
  ChevronRight,
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

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
    image: "",
  },
  {
    name: "Pizza",
    slug: "pizza",
    tagline: "Authentic Neapolitan Tradition",
    image: "",
  },
  {
    name: "Olive Oil & Vinegars",
    slug: "olive-oil-vinegars",
    tagline: "Liquid Gold of Italy",
    image: "",
  },
  {
    name: "Sauces & Tomato Products",
    slug: "sauces-tomatoes",
    tagline: "Sun-Ripened Perfection",
    image: "",
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
    image: "",
  },
  {
    name: "Crackers & Snacks",
    slug: "crackers-snacks",
    tagline: "Artisan Italian Snacking",
    image: "",
  },
  {
    name: "Tuna & Seafood",
    slug: "tuna-seafood",
    tagline: "Treasures of the Italian Sea",
    image: "",
  },
  {
    name: "Gelato & Sorbetto",
    slug: "gelato",
    tagline: "Frozen Italian Indulgence",
    image: "",
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
    image: "",
  },
];

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

const trustBadges = [
  {
    icon: Award,
    title: "Made in Italy",
    text: "Sourced directly from regional cooperatives and family-owned farms across Italy.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Kosher",
    text: "Uncompromising quality meeting the highest standards of dietary tradition.",
  },
  {
    icon: Leaf,
    title: "Pure Ingredients",
    text: "No unnecessary additives. Just the raw, honest flavor of the earth.",
  },
];

/* ------------------------------------------------------------------ */
/*  Placeholder gradient backgrounds for categories without images     */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Category slug -> icon mapping (issue #4)                           */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [oliveBranchVisible, setOliveBranchVisible] = useState(true);

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="selection:bg-burnt-terracotta selection:text-white">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative h-screen flex items-end justify-center overflow-hidden bg-surface">
        {/* Background video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
            src="/assets/Trailer/Tuscanini_Trailer_Screens_Final.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-black/20" />
          <div className="absolute inset-0 sketch-overlay pointer-events-none" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative z-10 w-full max-w-6xl mx-auto mb-28 px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-block px-6 py-2 border border-primary/30 mb-8"
          >
            <p className="font-serif-alt italic tracking-widest text-primary text-sm">
              Dal cuore dell&rsquo;Italia
            </p>
          </motion.div>

          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl text-heading mb-6 leading-tight">
            Italy at Your Table
          </h1>

          <p className="font-serif-alt text-lg md:text-2xl text-on-surface/70 max-w-2xl mx-auto italic mb-12">
            Authentic flavors, sourced from the heart of Italy&nbsp;&mdash;
            crafted for your home kitchen.
          </p>

          {/* Issue #3: smooth scroll on hero CTA */}
          <motion.a
            href="#collections"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => handleSmoothScroll(e, "collections")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-primary/90 transition-colors"
          >
            Explore Our Collections
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Bottom trim */}
        <div className="absolute bottom-0 left-0 w-full h-12 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-20" />
      </section>

      {/* ============================================================ */}
      {/*  HERITAGE                                                     */}
      {/* ============================================================ */}
      {/* Issue #9: py-32 -> py-28 */}
      <section className="py-28 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-5" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 md:order-1"
          >
            <div className="aspect-[4/5] wood-grain p-4 shadow-2xl rounded-sm transform -rotate-1 border-b-8 border-on-surface/15">
              <img
                alt="Italian Village"
                className="w-full h-full object-cover sepia-[0.2] contrast-125"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADU3knnkYzqfogwvrEJtCaRmpf3fNBKPOo3BwcHA2-RStaPhFITXR4UrfPdPOKYZ37DkAxFn5f_GO8WcMpbjIwnHI1MZf207HfKDbGpUAnfId_PUWryYSwknegiCBbaWYv1vCkwxrMUoGblpnNgDv9Vmz3d7S_tzNanq3zZ_kS4lkHpkwA_ZVkEg8kNcjHrhdIsW4A3SfZyHeVGeLpWHDfDjuV7kUUv2cLSe21cneVdcgucQPGWBy11tOy76xqBizAV5wxzy8ZOPbk"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10 order-1 md:order-2"
          >
            <header>
              <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
                Our Heritage
              </span>
              <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight">
                A Legacy Born in the Tuscan Pantry
              </h2>
            </header>
            <div className="space-y-6 text-on-surface/70 text-lg leading-relaxed font-light">
              <p>
                Tuscanini was founded on a singular obsession: to bottle the
                ephemeral magic of a Sunday afternoon in an Italian village. We
                believe that true luxury lies in simplicity&mdash;the peppery
                bite of first-press olive oil, the perfect snap of bronze-cut
                pasta.
              </p>
              <p className="italic border-l-2 border-primary/40 pl-6 py-2">
                Every product in our archive is a tribute to the families who
                have perfected their craft over generations. We don&rsquo;t just
                import food; we preserve the soul of the Italian kitchen.
              </p>
            </div>
            {/* Issue #2: Changed Link to <a> for in-page anchor navigation */}
            <a
              href="#collections"
              onClick={(e) => handleSmoothScroll(e, "collections")}
              className="inline-flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-semibold hover:gap-4 transition-all"
            >
              Discover our collections
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURED CATEGORIES GRID                                     */}
      {/* ============================================================ */}
      {/* Issue #9: py-32 -> py-28 */}
      <section id="collections" className="py-28 px-6 bg-aged-cream relative">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
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

          {/* Grid */}
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
                        /* Issue #4: Show category icon instead of "Coming Soon" */
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${placeholderGradients[idx % placeholderGradients.length]} relative overflow-hidden`}
                        >
                          {/* Subtle pattern overlay */}
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

          {/* Issue #8: "View All Categories" link at bottom of grid */}
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

      {/* ============================================================ */}
      {/*  FEATURED PRODUCTS                                            */}
      {/* ============================================================ */}
      {/* Issue #9: py-32 -> py-28 */}
      <section className="py-28 px-6 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-[0.03]" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Heading */}
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

          {/* Product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts
              /* Issue #5: Skip products without images */
              .filter((product) => product.image)
              .map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                {/* Issue #1: Link to /product/:id instead of /category/:slug */}
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

      {/* ============================================================ */}
      {/*  ITALIAN QUOTE                                                */}
      {/* ============================================================ */}
      {/* Issue #9: py-48 -> py-36 */}
      <section className="relative py-36 overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0">
          <img
            alt="Italian Coast"
            className="w-full h-full object-cover opacity-20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN5mUX9JZGjnSsvYEYqUhuJgKDqZp0SgCmy4ZBcB1MSb0tHXakUnUchTzLazRZlStxn6p9mZhDBdisboWQ9YXoIcXuznI6FO0s63LGO9VDh9Rb2DonXgx_S57OkccH5pHEk-ZU2tc9TP7WAkqEjtDmjLyI5IWe0sVw_RQfxTsy_s_3VATENtqlBrKKPPcaOG8t9D7qKXd9L32Lm7G-3007Mvvc-1fR6wLTGmoW5gIPQ6gOQbf1a_NVCM2_ACKirgw8sdCiqQ2z5Y7i"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-transparent to-surface/90" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-headline text-4xl md:text-6xl text-heading italic leading-relaxed font-light"
          >
            &ldquo;From the Dolomite mountain ranges to Sicilian
            beaches&nbsp;&mdash; we travel so you don&rsquo;t have to.&rdquo;
          </motion.h2>
          <div className="mt-12 flex justify-center items-center gap-6">
            <div className="w-16 h-px bg-primary/40" />
            <span className="font-serif-alt text-primary uppercase tracking-[0.4em] text-[10px]">
              The Pursuit
            </span>
            <div className="w-16 h-px bg-primary/40" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRUST BADGES / FEATURES                                      */}
      {/* ============================================================ */}
      {/* Issue #9: py-32 -> py-24 */}
      <section className="py-24 bg-earth-dark relative">
        <div className="absolute inset-0 sketch-overlay opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge, idx) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="stone-texture p-12 text-center border border-on-surface/8 shadow-lg hover:border-primary/20 transition-colors"
              >
                <badge.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-headline text-2xl text-heading mb-4">
                  {badge.title}
                </h3>
                <p className="font-body text-on-surface/60 text-sm leading-relaxed">
                  {badge.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  NEWSLETTER / CTA                                             */}
      {/* ============================================================ */}
      {/* Issue #9: py-32 -> py-28 */}
      <section className="py-28 px-6 bg-aged-cream relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-[0.04]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              Stay Connected
            </span>
            <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight mb-6">
              Join the Italian Table
            </h2>
            <p className="font-serif-alt text-on-surface/60 text-lg italic max-w-lg mx-auto mb-12">
              Recipes, stories from the field, and first access to new
              arrivals&nbsp;&mdash; delivered to your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              {/* Issue #6: Added required and aria-label */}
              <input
                type="email"
                placeholder="your@email.com"
                required
                aria-label="Email address"
                className="flex-1 px-5 py-4 bg-white border border-on-surface/15 text-on-surface placeholder:text-on-surface/30 text-sm tracking-wide focus:outline-none focus:border-primary/60 rounded-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-white font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="text-on-surface/30 text-[10px] tracking-widest uppercase mt-6">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CLOSING                                                      */}
      {/* ============================================================ */}
      {/* Issue #9: py-48 -> py-36 */}
      <section className="py-36 px-8 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Issue #7: onError handler hides olive branch if image fails */}
          {oliveBranchVisible && (
            <div className="mb-16">
              <img
                alt="Olive Branch"
                className="mx-auto h-32 w-auto opacity-40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCosI5jZjacVrJBNWbXh-YBOMdgr-dyzta3uQaRIdUkwuF-o-7DhIy6IaYW-l2av887VF-JOVA7qeOUzEXVlJyMHOz0kglm0qxF0Js8OaMD_PfTyY4BjWw8ELZPaqAy45nB3SvYeZPzuNPbIljtEcw5a3rMU06017eFjeozsbV9oXg6vw7P0MHJxrxQOd67bW0z4H4LFpBuxAbxJH4uRwJOuG3qJCKWkTLSJKCDxU5t9YfHX5UByy9MAA4RfUhlaFaVy-U-Ye0X-C0s"
                referrerPolicy="no-referrer"
                onError={() => setOliveBranchVisible(false)}
              />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight mb-10">
              Food connects people. Every Tuscanini product is made to bring
              your table to life.
            </h2>
            <p className="font-serif-alt text-primary italic text-2xl tracking-wide">
              Benvenuti alla nostra tavola.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-4 wood-grain" />
      </section>
    </div>
  );
}
