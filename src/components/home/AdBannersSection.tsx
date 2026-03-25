import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const adBanners = [
  {
    src: "/assets/ads/beverages-wide.jpg",
    label: "Sparkling Drinks",
    slug: "beverages",
  },
  {
    src: "/assets/ads/tomatoes-parallax.jpg",
    label: "Tomato Products",
    slug: "sauces-tomatoes",
  },
  {
    src: "/assets/ads/balsamic-parallax.jpg",
    label: "Balsamic Glaze",
    slug: "olive-oil-vinegars",
  },
  {
    src: "/assets/ads/tuna-parallax2.jpg",
    label: "Tuna & Seafood",
    slug: "tuna-seafood",
  },
  {
    src: "/assets/ads/lemon-juice-parallax.jpg",
    label: "Lemon Juice",
    slug: "beverages",
  },
  {
    src: "/assets/ads/marinara-banner2.jpg",
    label: "Pasta Sauces",
    slug: "sauces-tomatoes",
  },
];

export default function AdBannersSection() {
  return (
    <section className="py-16 px-6 bg-dark-surface overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase block mb-2">
            From Our Campaigns
          </span>
          <h2 className="font-script text-4xl md:text-5xl text-italia-white italic">
            As Seen Across Italy
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adBanners.map((banner, idx) => (
            <motion.div
              key={banner.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.07, duration: 0.6 }}
            >
              <Link
                to={`/category/${banner.slug}`}
                className="group block relative overflow-hidden rounded-sm aspect-[16/9] bg-dark shadow-md"
              >
                <motion.img
                  src={banner.src}
                  alt={banner.label}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <span className="font-headline text-gold text-lg">{banner.label}</span>
                  <ArrowRight className="inline ml-2 w-4 h-4 text-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
