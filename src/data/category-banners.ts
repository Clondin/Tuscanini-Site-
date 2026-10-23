// Lifestyle photography from Tuscanini's own photo library, shown as a band under the category header.
export interface CategoryBanner { src: string; alt: string; width: number; height: number; position: string }

export const categoryBanners: Record<string, CategoryBanner> = {
  "potato-chips": { src: "/assets/brand-banners/potato-chips-1e6edf7f5f.webp", alt: "Tuscanini Classic Potato Chips made with olive oil, spilling from the bag onto parchment", width: 1600, height: 1600, position: "50% 55%" },
  "canned-tomatoes": { src: "/assets/brand-banners/canned-tomatoes-410858dc00.webp", alt: "Fresh Italian tomatoes, garlic, onion and basil laid out on a dark board", width: 1400, height: 1400, position: "50% 50%" },
  "cooking-wines-citrus": { src: "/assets/brand-banners/cooking-wines-citrus-ce9ea5be03.webp", alt: "A lemon cake topped with lemon slices and mint, with Tuscanini Sicilian lemon juice", width: 1400, height: 1400, position: "50% 60%" },
};
