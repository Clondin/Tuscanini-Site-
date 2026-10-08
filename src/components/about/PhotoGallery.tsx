import { motion } from "motion/react";
import SectionHeading from "../ui/SectionHeading";
import { getResponsiveImageProps } from "../../lib/productImage";

const leadPhoto = "/assets/Photos/story/coastal-craftsperson-lead.webp";

const photos = [
  {
    src: "/assets/Photos/story/terrace-family-table.webp",
    alt: "Family and friends sharing pasta on a terrace overlooking olive-covered hills.",
  },
  {
    src: "/assets/Photos/story/hillside-aperitivo.webp",
    alt: "Friends sharing an evening aperitivo on a hillside terrace.",
  },
  {
    src: "/assets/Photos/story/village-produce-market.webp",
    alt: "Market vendor arranging lemons and tomatoes for shoppers on a stone village lane.",
  },
  {
    src: "/assets/Photos/story/olive-harvest.webp",
    alt: "Two people harvesting olives by hand in a sunlit grove.",
  },
];

export default function PhotoGallery() {
  return (
    <section className="bg-surface py-20 md:py-22 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Scenes from Italian life"
          className="mb-10"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative col-span-2 aspect-[4/5] md:aspect-square md:row-span-2 overflow-hidden group"
          >
            <img
              {...getResponsiveImageProps(leadPhoto, "100vw")}
              alt="Craftsperson coiling rope beside blue fishing boats in a coastal Italian harbor."
              width={1122}
              height={1402}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[50%_45%] block group-hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>

          {photos.map((photo, idx) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 1) * 0.08, duration: 0.5 }}
              className="aspect-square overflow-hidden group"
            >
              <img
                {...getResponsiveImageProps(photo.src, "100vw")}
                alt={photo.alt}
                width={1254}
                height={1254}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-1000"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
