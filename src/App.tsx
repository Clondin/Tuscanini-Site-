/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Menu, Utensils, Award, ShieldCheck, Leaf, Instagram, Youtube, Share2 } from "lucide-react";

const collections = [
  {
    title: "Pasta",
    description: "Bronze-die cut and slow-dried for the perfect al dente texture.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgYV6u-hXc0zrnuvPUiTXSoaNIgx8sKAnwTI_5RIAcTbOESzuXQhFi2VmC_6EEjxWkkzl_l0aVCm_xPqExqq_TraSKo1j-HkkK6vbh6HCTZ4t1biuEBbPYWR6cuWxDDEgAcKIDUlyhzvOB6Q_GI1klv43X5GKXTRSmiMSZFvuxlBR7lf0HO4A9mck2YBeR977lSoZ1GBWR2R3OWF8W4pO36-BSBXH7PIqPZp5k5YskcGGLmxnFVEV0ef1EAc7TJPD_8pJmixTKHXlt"
  },
  {
    title: "Sauces",
    description: "Small-batch recipes using vine-ripened Italian tomatoes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOF_tTPNcdtRjbXj_4niW4EfWmJPilctXV_77XLep4KgwR2jypfop8PxE3x8p-yXFXN0t9QPSRytEnzoNeima-JSrsu-jGILa3itcNwyAMbaRTA6ZD2EOPW9tGW5lpeBC-tfjfnClmRgs3zq2OdBctlISU7iagzXvNT2Io8mPWnccPtwTBcnoLPonqKih4wiuRPA6QsuukAeUr3ob5280lfkdSJ_hkEhJ9OV0eUGYTLI4GglM-s56zerC27N9EU43NPWn0AvQK5Sna"
  },
  {
    title: "Olive Oil & Vinegars",
    description: "Cold-pressed liquid gold from century-old groves.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTaDADG16XEv2F0aKMNNVe_nDKDdH-kdI7M5VyVENAkDhX1hp7XVNLZcswtkhWxaDgqOUyIIj5qap0l7E5wD2hYBNi2abLAaKNz_R3nDZf5uWSdZJCP5XjIPXltajjOlYkXcmwePKLFZZsG8SpM2makgqI6Q_5lu1EiMVKVhw7X5Kmcr5Ak5qtf4V1Z0-JuMl2qPZC37awqrh8GfyRlPv4XUFByQeLCCLfXAdjxRLHMJwIw7x3m295jVq0gcRmEb6x3suALKh73370"
  },
  {
    title: "Flour",
    description: "Professional grade Tipo 00 for the perfect crumb.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRFf2IkZ7QvxnN7ecanNKe9wkhcKnTCAtEPU_rGNyqzq81PAv-NUpN5EtaGLvSD87Cj0sg4idBlyk81-xg2wjhIgongT7oorof5PL_OSW2wHqLQzgQiAk5qYbedEVEVIi4elL7lQi2G5nYBNzyU2IPCjaS6htqCegwlGdQWs1DmK5nTTeZ5XaMsDZRIk74wGU5bgNOYiTgKPuZx-xFJbZN01l6tXFZWRqVq_V8dRb2J1mQrmO9JZVimBbVOO4D5wNZEaP9VW5VghDE"
  },
  {
    title: "Pantry & Specialty",
    description: "The essential accents that complete the Italian table.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiibIOR3yduYuNxM0I5v7d9MVYZDqjf1wK-W1s6_gz0P_Inz77v4R1wLuL5tNKs90If1kv6YGG_GRs3zMkyh0xtK7vrSkDokvGlZzo2vf38-NHGTV81f9awEiY9QUc-XhI9DxKp5Q6QASBXyYGRX8dVaV_LsrFnk9HYE7GjEdY-1JrBKTGIy0w106_qRHOhjZFbA-CS6R_RXLeTJ0OZsQAMd9UHDIgP5LAGkEeGO3btEd0rMIjGPfbVkUzHncg3mIfqrjuCEDQI_fC"
  },
  {
    title: "Tuna & Seafood",
    description: "Sustainably sourced from the Mediterranean blue.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9mEKX0iK8ECcYwbWfm1pDGjSUN-CRBH-oH2iYb491cgA351RqZb4WHXlxZWhOFBz-AiuxAtkuW4bA8e2i_6wD6Lt1tncHmiEtlHcsRqVN9sUNtjYeXUbRvd0S0eXpm-GZCDS4PbxeBegWmUq7hGXwtT7yM6jQcRuhJp4zK3HUjaJpEUwhj4LxcjqF7s_5e_zkRARzQxDcK5xXnlp3EHW0Awu5H23sBX5_NV01J64hsfjLHlFwLyzv_FlsN4ko_gHCtPS7HOqFJfjd"
  }
];

export default function App() {
  return (
    <div className="min-h-screen selection:bg-burnt-terracotta selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-10 py-6 bg-earth-dark/90 backdrop-blur-md z-50 border-b border-white/5">
        <div className="text-3xl font-headline italic text-primary tracking-tighter">Tuscanini</div>
        <div className="hidden md:flex gap-10 items-center">
          <a className="uppercase tracking-[0.2em] text-[10px] text-on-surface/70 hover:text-primary transition-colors" href="#">The Pantry</a>
          <a className="uppercase tracking-[0.2em] text-[10px] text-on-surface/70 hover:text-primary transition-colors" href="#">Artisans</a>
          <a className="uppercase tracking-[0.2em] text-[10px] text-on-surface/70 hover:text-primary transition-colors" href="#">Heritage</a>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <Menu className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-end justify-center overflow-hidden bg-earth-dark">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Rustic Kitchen" 
              className="w-full h-full object-cover opacity-60 scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3dpJr_PnM2euKbVqQCNZqB_ihZacD-vDGfggDQWNZffyyxzw-I3pf-g7syozd_NMrMn83JWlk0RbO_SBlrGz8fjcdC6feq08-11S5ebarhT3bn8SoOnrxW2mNjN_lEBNQ-OfnRRxG9Xs6H25k4-KyWoqiYYAwEkrtX4XpBenpMfSXsdOCGVAq9gqaih_oZATMcPHeSHRGWB-Nqv1GJHmQFqCnVPDOevVGxNHMDdnygE9u-2p4NLAiNyjhLabCg6Cvhy7RzApE0Wgc"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-dark via-transparent to-black/60"></div>
            <div className="absolute inset-0 sketch-overlay pointer-events-none"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-full max-w-6xl mx-auto mb-24 px-6 text-center"
          >
            <div className="inline-block px-6 py-2 border border-primary/30 mb-8">
              <p className="font-serif-alt italic tracking-widest text-primary text-sm">Dal cuore dell'Italia</p>
            </div>
            <h1 className="font-headline text-6xl md:text-9xl text-white mb-6 leading-tight">Italy at Your Table</h1>
            <p className="font-serif-alt text-lg md:text-2xl text-on-surface/80 max-w-2xl mx-auto italic">
              Authentic flavors, sourced from the heart of Italy — crafted for your home kitchen.
            </p>
          </motion.div>
          <div className="absolute bottom-0 left-0 w-full h-12 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-20"></div>
        </section>

        {/* Heritage Section */}
        <section className="py-32 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
          <div className="absolute inset-0 sketch-overlay opacity-5"></div>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-[4/5] wood-grain p-4 shadow-2xl rounded-sm transform -rotate-1 border-b-8 border-black/40">
                <img 
                  alt="Italian Village" 
                  className="w-full h-full object-cover sepia-[0.2] contrast-125" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADU3knnkYzqfogwvrEJtCaRmpf3fNBKPOo3BwcHA2-RStaPhFITXR4UrfPdPOKYZ37DkAxFn5f_GO8WcMpbjIwnHI1MZf207HfKDbGpUAnfId_PUWryYSwknegiCBbaWYv1vCkwxrMUoGblpnNgDv9Vmz3d7S_tzNanq3zZ_kS4lkHpkwA_ZVkEg8kNcjHrhdIsW4A3SfZyHeVGeLpWHDfDjuV7kUUv2cLSe21cneVdcgucQPGWBy11tOy76xqBizAV5wxzy8ZOPbk"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 blur-3xl rounded-full"></div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-10 order-1 md:order-2"
            >
              <header>
                <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">Our Heritage</span>
                <h2 className="font-headline text-5xl md:text-6xl text-white leading-tight">A Legacy Born in the Tuscan Pantry</h2>
              </header>
              <div className="space-y-6 text-on-surface/70 text-lg leading-relaxed font-light">
                <p>Tuscanini was founded on a singular obsession: to bottle the ephemeral magic of a Sunday afternoon in an Italian village. We believe that true luxury lies in simplicity—the peppery bite of first-press olive oil, the perfect snap of bronze-cut pasta.</p>
                <p className="italic border-l-2 border-primary/40 pl-6 py-2">Every product in our archive is a tribute to the families who have perfected their craft over generations. We don't just import food; we preserve the soul of the Italian kitchen.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-32 px-6 bg-[#151210] relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-headline text-5xl text-white italic mb-6">Curated Collections</h2>
              <div className="flex justify-center items-center gap-4">
                <div className="w-16 h-px bg-primary/30"></div>
                <Utensils className="w-5 h-5 text-primary/40" />
                <div className="w-16 h-px bg-primary/30"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {collections.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="still-life-frame group cursor-default"
                >
                  <div className="aspect-square overflow-hidden mb-6 bg-earth-dark ring-1 ring-white/10">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80" 
                      src={item.image} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-headline text-2xl text-primary mb-3">{item.title}</h3>
                  <p className="text-on-surface/60 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="relative py-48 overflow-hidden bg-earth-dark">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Italian Coast" 
              className="w-full h-full object-cover opacity-30 grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN5mUX9JZGjnSsvYEYqUhuJgKDqZp0SgCmy4ZBcB1MSb0tHXakUnUchTzLazRZlStxn6p9mZhDBdisboWQ9YXoIcXuznI6FO0s63LGO9VDh9Rb2DonXgx_S57OkccH5pHEk-ZU2tc9TP7WAkqEjtDmjLyI5IWe0sVw_RQfxTsy_s_3VATENtqlBrKKPPcaOG8t9D7qKXd9L32Lm7G-3007Mvvc-1fR6wLTGmoW5gIPQ6gOQbf1a_NVCM2_ACKirgw8sdCiqQ2z5Y7i"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-earth-dark via-transparent to-earth-dark"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="font-headline text-4xl md:text-6xl text-on-surface italic leading-relaxed font-light"
            >
              "From the Dolomite mountain ranges to Sicilian beaches — we travel so you don't have to."
            </motion.h2>
            <div className="mt-12 flex justify-center items-center gap-6">
              <div className="w-16 h-px bg-primary/40"></div>
              <span className="font-serif-alt text-primary uppercase tracking-[0.4em] text-[10px]">The Pursuit</span>
              <div className="w-16 h-px bg-primary/40"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-earth-dark relative">
          <div className="absolute inset-0 sketch-overlay opacity-[0.03]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="stone-texture p-12 text-center border border-white/5 shadow-2xl">
                <Award className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-headline text-2xl text-white mb-4">Made in Italy</h3>
                <p className="font-body text-on-surface/60 text-sm leading-relaxed">Sourced directly from regional cooperatives and family-owned farms.</p>
              </div>
              <div className="stone-texture p-12 text-center border border-white/5 shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-headline text-2xl text-white mb-4">Certified Kosher</h3>
                <p className="font-body text-on-surface/60 text-sm leading-relaxed">Uncompromising quality meeting the highest standards of tradition.</p>
              </div>
              <div className="stone-texture p-12 text-center border border-white/5 shadow-2xl">
                <Leaf className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="font-headline text-2xl text-white mb-4">Pure Ingredients</h3>
                <p className="font-body text-on-surface/60 text-sm leading-relaxed">No unnecessary additives. Just the raw, honest flavor of the earth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="py-48 px-8 bg-earth-dark relative overflow-hidden">
          <div className="absolute inset-0 sketch-overlay opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-16">
              <img 
                alt="Olive Branch" 
                className="mx-auto h-32 w-auto opacity-60 invert" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCosI5jZjacVrJBNWbXh-YBOMdgr-dyzta3uQaRIdUkwuF-o-7DhIy6IaYW-l2av887VF-JOVA7qeOUzEXVlJyMHOz0kglm0qxF0Js8OaMD_PfTyY4BjWw8ELZPaqAy45nB3SvYeZPzuNPbIljtEcw5a3rMU06017eFjeozsbV9oXg6vw7P0MHJxrxQOd67bW0z4H4LFpBuxAbxJH4uRwJOuG3qJCKWkTLSJKCDxU5t9YfHX5UByy9MAA4RfUhlaFaVy-U-Ye0X-C0s"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="font-headline text-5xl md:text-6xl text-white leading-tight mb-10">
              Food connects people. Every Tuscanini product is made to bring your table to life.
            </h2>
            <p className="font-serif-alt text-primary italic text-2xl tracking-wide">Benvenuti alla nostra tavola.</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-4 wood-grain"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-20 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="font-headline text-primary text-3xl mb-2">Tuscanini</div>
            <p className="text-[10px] text-on-surface/40 uppercase tracking-[0.3em]">An Authentic Brand Archive</p>
          </div>
          <div className="flex gap-12 text-on-surface/50 text-[10px] tracking-widest uppercase">
            <a className="hover:text-primary transition-colors" href="#">Pantry</a>
            <a className="hover:text-primary transition-colors" href="#">Story</a>
            <a className="hover:text-primary transition-colors" href="#">Journal</a>
          </div>
          <div className="flex gap-8 items-center text-primary/60">
            <Instagram className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
            <Youtube className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
            <Share2 className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] text-on-surface/30 uppercase tracking-[0.5em]">
            © Tuscanini. Italy's finest. Sourced with integrity.
          </p>
        </div>
      </footer>
    </div>
  );
}
