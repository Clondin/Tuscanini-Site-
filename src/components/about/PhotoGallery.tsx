import { motion } from "motion/react";
import SectionHeading from "../ui/SectionHeading";

const leadPhoto = "/assets/Photos/PHOTO-2020-11-27-15-44-52.jpg";

const photos = [
  "/assets/Photos/PHOTO-2020-11-28-22-05-50.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-13-28.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-23-56.jpg",
  "/assets/Photos/PHOTO-2020-11-28-22-30-56.jpg",
];

export default function PhotoGallery() {
  return (
    <section className="bg-surface py-20 md:py-22 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="Behind the Scenes" title="From Our World" className="mb-10" />

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 row-span-2 overflow-hidden group"
          >
            <img
              src={leadPhoto}
              alt="Tuscanini lifestyle"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>

          {photos.map((photo, idx) => (
            <motion.div
              key={photo}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 1) * 0.08, duration: 0.5 }}
              className="aspect-square overflow-hidden group"
            >
              <img
                src={photo}
                alt="Tuscanini lifestyle"
                loading="lazy"
                className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-1000"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
