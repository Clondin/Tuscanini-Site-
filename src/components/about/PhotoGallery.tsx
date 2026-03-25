import { motion } from "motion/react";

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

export default function PhotoGallery() {
  return (
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
  );
}
