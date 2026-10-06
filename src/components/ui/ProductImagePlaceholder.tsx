interface ProductImagePlaceholderProps {
  productName: string;
  className?: string;
}

export default function ProductImagePlaceholder({ productName, className = "" }: ProductImagePlaceholderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 bg-aged-cream p-4 text-center ${className}`}>
      <span className="font-headline text-heading/65">{productName}</span>
      <span className="text-[10px] uppercase tracking-[0.12em] text-on-surface/55">
        Product image unavailable
      </span>
    </div>
  );
}
