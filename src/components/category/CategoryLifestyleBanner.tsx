import { categoryBanners } from "../../data/category-banners";

/** A full-bleed lifestyle photo for categories that have real Tuscanini photography. */
export default function CategoryLifestyleBanner({ slug }: { slug: string }) {
  const banner = categoryBanners[slug];
  if (!banner) return null;
  return (
    <figure className="relative w-full overflow-hidden bg-ink">
      <img
        src={banner.src}
        alt={banner.alt}
        width={banner.width}
        height={banner.height}
        loading="lazy"
        decoding="async"
        className="block w-full aspect-[4/3] sm:aspect-[16/7] lg:aspect-[21/8] object-cover"
        style={{ objectPosition: banner.position }}
      />
    </figure>
  );
}
