interface CategoryDescriptionProps {
  description: string;
}

export default function CategoryDescription({ description }: CategoryDescriptionProps) {
  return (
    <section className="py-12 md:py-14 px-6 md:px-10 bg-earth-dark relative">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03] pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-16 h-px bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-16 h-px bg-primary/30" />
        </div>
        <p className="font-serif-alt text-on-surface/80 text-base md:text-lg leading-relaxed italic">
          {description}
        </p>
        <div className="flex justify-center items-center gap-4 mt-6">
          <div className="w-16 h-px bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-16 h-px bg-primary/30" />
        </div>
      </div>
    </section>
  );
}
