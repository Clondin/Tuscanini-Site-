import { getResponsiveImageProps } from "../../lib/productImage";

const lead = {
  src: "/assets/Photos/story/terrace-family-table.webp",
  alt: "Family and friends sharing pasta on a terrace overlooking olive-covered hills.",
};

const supporting = [
  {
    src: "/assets/Photos/story/hillside-aperitivo.webp",
    alt: "Friends sharing an evening aperitivo on a hillside terrace.",
  },
  {
    src: "/assets/Photos/story/coastal-craftsperson-lead.webp",
    alt: "Craftsperson coiling rope beside blue fishing boats in a coastal Italian harbor.",
  },
];

export default function PhotoGallery() {
  return (
    <section
      id="table"
      className="bg-surface py-20 md:py-28 px-5 md:px-10 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] mb-10 md:mb-12">
          At the table
        </h2>
        <div className="grid gap-4 md:gap-5 md:grid-cols-3 md:grid-rows-2 md:h-[min(720px,80svh)]">
          <figure className="group relative overflow-hidden aspect-[4/3] md:aspect-auto md:col-span-2 md:row-span-2">
            <img
              {...getResponsiveImageProps(lead.src, "(min-width: 768px) 66vw, 100vw")}
              alt={lead.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03] motion-reduce:transform-none"
            />
          </figure>
          {supporting.map((photo) => (
            <figure
              key={photo.src}
              className="group relative overflow-hidden aspect-[4/3] md:aspect-auto"
            >
              <img
                {...getResponsiveImageProps(photo.src, "(min-width: 768px) 33vw, 100vw")}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[50%_45%] transition-transform duration-1000 group-hover:scale-[1.04] motion-reduce:transform-none"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
