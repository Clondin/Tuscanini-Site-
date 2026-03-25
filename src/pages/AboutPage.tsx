import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Award, ShieldCheck, Landmark, ArrowRight, Grape, TreePine, Sun } from "lucide-react";

const photos = [
  "/assets/Photos/PHOTO-2020-11-27-15-44-52.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-05-50.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-13-28.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-23-56.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-30-56.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-36-50.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-38-37.jpg",
  "/assets/Photos/PHOTO-2020-11-29-10-11-33.jpg",
];

const values = [
  {
    icon: Award,
    title: "Authenticity",
    description: "Every product traces back to Italian soil. We source directly from regional cooperatives and family-owned farms who have cultivated their land for generations.",
  },
  {
    icon: ShieldCheck,
    title: "Quality",
    description: "Certified Kosher, uncompromising standards. Every ingredient is vetted, every process verified, every product held to the highest benchmarks of excellence.",
  },
  {
    icon: Landmark,
    title: "Heritage",
    description: "Preserving centuries-old culinary traditions. We honor the recipes and methods that have defined Italian cooking through the ages.",
  },
];

const journeySteps = [
  {
    icon: Sun,
    region: "Tuscany",
    title: "Tuscan Olive Groves",
    description: "From century-old olive trees nestled in the rolling hills of Tuscany, we source the finest extra virgin olive oil — cold-pressed within hours of harvest to capture the peppery, fruity essence of the land.",
  },
  {
    icon: Grape,
    region: "Sicily",
    title: "Sicilian Citrus Orchards",
    description: "The volcanic soils of Sicily yield blood oranges and lemons of extraordinary intensity. Our citrus beverages and flavors draw directly from these sun-drenched orchards, carrying the vibrant spirit of the island.",
  },
  {
    icon: TreePine,
    region: "Piedmont",
    title: "Piedmont Hazelnut Farms",
    description: "The prized Tonda Gentile hazelnut of Piedmont forms the heart of our chocolate truffles. Roasted slowly and blended with Italian cocoa, these nuts contribute a depth of flavor found nowhere else on earth.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0">
          <img
            alt="Italian Countryside"
            className="w-full h-full object-cover opacity-40 scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADU3knnkYzqfogwvrEJtCaRmpf3fNBKPOo3BwcHA2-RStaPhFITXR4UrfPdPOKYZ37DkAxFn5f_GO8WcMpbjIwnHI1MZf207HfKDbGpUAnfId_PUWryYSwknegiCBbaWYv1vCkwxrMUoGblpnNgDv9Vmz3d7S_tzNanq3zZ_kS4lkHpkwA_ZVkEg8kNcjHrhdIsW4A3SfZyHeVGeLpWHDfDjuV7kUUv2cLSe21cneVdcgucQPGWBy11tOy76xqBizAV5wxzy8ZOPbk"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-black/15"></div>
          <div className="absolute inset-0 sketch-overlay pointer-events-none"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <div className="inline-block px-6 py-2 border border-primary/30 mb-8">
            <p className="font-serif-alt italic tracking-widest text-primary text-sm">La Nostra Storia</p>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl text-heading mb-6 leading-tight">Our Story</h1>
          <p className="font-serif-alt text-lg md:text-2xl text-on-surface/70 max-w-2xl mx-auto italic">
            A journey rooted in tradition, driven by an unwavering passion for authentic Italian flavors.
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-12 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-20"></div>
      </section>

      {/* Origin Story */}
      <section className="py-32 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-5"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] wood-grain p-4 shadow-2xl rounded-sm transform -rotate-1 border-b-8 border-on-surface/15">
              <img
                alt="Italian Heritage"
                className="w-full h-full object-cover sepia-[0.2] contrast-125"
                src="/assets/Photos/PHOTO-2020-11-27-15-44-52.jpg"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <header>
              <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">Our Origins</span>
              <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight">
                Born of a Love for Italy's Table
              </h2>
            </header>
            <div className="space-y-6 text-on-surface/70 text-lg leading-relaxed font-light">
              <p>
                Tuscanini was founded on a singular obsession: to bring the soul of the Italian kitchen
                to homes everywhere. Not through imitation, but through authenticity — sourcing directly
                from the families, cooperatives, and artisans who have perfected their craft over centuries.
              </p>
              <p>
                Our founders traveled the length of Italy, from the sun-baked olive groves of Puglia to the
                alpine dairies of Trentino, forging relationships built on shared values: quality without
                compromise, tradition without shortcuts, and a deep respect for the land.
              </p>
              <p className="italic border-l-2 border-primary/40 pl-6 py-2">
                "We don't just import Italian food. We carry forward the stories, the traditions,
                and the generations of knowledge that make each product extraordinary."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-aged-cream relative">
        <div className="absolute inset-0 sketch-overlay opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">What We Stand For</span>
            <h2 className="font-headline text-5xl text-heading italic mb-6">Our Pillars</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="w-16 h-px bg-primary/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              <div className="w-16 h-px bg-primary/30"></div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="stone-texture p-12 text-center border border-on-surface/8 shadow-lg"
              >
                <value.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-headline text-2xl text-heading mb-4">{value.title}</h3>
                <p className="font-body text-on-surface/60 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-32 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">From Farm to Table</span>
            <h2 className="font-headline text-5xl text-heading italic mb-6">The Italian Sourcing Journey</h2>
            <p className="font-serif-alt text-on-surface/60 text-lg italic max-w-2xl mx-auto">
              We travel so you don't have to — traversing Italy's diverse regions to bring you the finest each has to offer.
            </p>
          </motion.div>

          <div className="space-y-20">
            {journeySteps.map((step, idx) => (
              <motion.div
                key={step.region}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="flex-shrink-0 w-32 h-32 rounded-full stone-texture border border-on-surface/10 flex items-center justify-center shadow-lg">
                  <step.icon className="w-14 h-14 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-primary/70 font-bold tracking-[0.3em] text-[10px] uppercase block mb-2">
                    {step.region}
                  </span>
                  <h3 className="font-headline text-3xl text-heading mb-4">{step.title}</h3>
                  <p className="text-on-surface/60 text-lg leading-relaxed font-light max-w-xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-32 bg-aged-cream relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">Behind the Scenes</span>
            <h2 className="font-headline text-5xl text-heading italic mb-6">From Our World</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="w-16 h-px bg-primary/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              <div className="w-16 h-px bg-primary/30"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className={`overflow-hidden group ${
                  idx === 0 || idx === 5 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <div className="still-life-frame h-full">
                  <img
                    src={photo}
                    alt="Tuscanini lifestyle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 aspect-square"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-8 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-10"></div>
        <div className="absolute inset-0 z-0">
          <img
            alt="Italian Coast"
            className="w-full h-full object-cover opacity-15"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN5mUX9JZGjnSsvYEYqUhuJgKDqZp0SgCmy4ZBcB1MSb0tHXakUnUchTzLazRZlStxn6p9mZhDBdisboWQ9YXoIcXuznI6FO0s63LGO9VDh9Rb2DonXgx_S57OkccH5pHEk-ZU2tc9TP7WAkqEjtDmjLyI5IWe0sVw_RQfxTsy_s_3VATENtqlBrKKPPcaOG8t9D7qKXd9L32Lm7G-3007Mvvc-1fR6wLTGmoW5gIPQ6gOQbf1a_NVCM2_ACKirgw8sdCiqQ2z5Y7i"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth-dark via-earth-dark/80 to-earth-dark"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight mb-8">
            Taste the Tradition
          </h2>
          <p className="font-serif-alt text-on-surface/60 text-xl italic mb-12 max-w-2xl mx-auto">
            From our family to yours — discover the full range of authentic Italian products crafted with generations of expertise.
          </p>
          <Link
            to="/#collections"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20"
          >
            Explore Our Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="font-serif-alt text-primary italic text-2xl tracking-wide mt-16">
            Benvenuti alla nostra tavola.
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-4 wood-grain"></div>
      </section>
    </div>
  );
}
