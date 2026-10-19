import { useState } from 'react';
import { Expand } from 'lucide-react';
import type { Product } from '../../data/products';
import ImageLightbox from '../ui/ImageLightbox';
import { ProductImage } from './ProductParts';
import type { ProductDossierState } from './useProductDossier';
import { getResponsiveImageProps } from '../../lib/productImage';

export default function ProductGallery({ product, state }: { product: Product; state: ProductDossierState }) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const images = product.imageGallery;
  if (!images?.length) {
    return <ProductImage product={product} state={state} className="w-full h-[320px] sm:h-[420px] lg:h-[520px]" />;
  }
  const image = images[selected] ?? images[0];
  return (
    <div className="w-full min-w-0">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label={`Enlarge ${image.label.toLowerCase()} image of ${product.name}`}
        className="group relative block w-full aspect-square overflow-hidden cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <img {...getResponsiveImageProps(image.src)} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" className="w-full h-full object-contain" />
        <span className="absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-paper/95 px-3 py-2 text-xs text-ink shadow-sm">
          <Expand size={14} /> Enlarge
        </span>
      </button>
      <div className="grid grid-cols-4 gap-2 mt-3" role="group" aria-label={`Images of ${product.name}`}>
        {images.map((entry, index) => (
          <button
            key={entry.src}
            type="button"
            aria-label={`Show ${entry.label.toLowerCase()} image of ${product.name}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            className={`min-w-0 overflow-hidden border-2 bg-paper transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${selected === index ? 'border-ink' : 'border-transparent hover:border-ink/40'}`}
          >
            <img src={entry.thumbnail} alt="" width={160} height={160} loading="lazy" className="aspect-square w-full object-contain" />
            <span className="block px-1 py-2 text-[10px] sm:text-xs text-ink">{entry.label}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{image.label}, image {selected + 1} of {images.length}</p>
      {expanded && <ImageLightbox key={image.src} src={image.src} alt={image.alt} isOpen onClose={() => setExpanded(false)} />}
    </div>
  );
}
