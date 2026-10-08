export default function ProductStory({ details }: { details?: string }) {
  if (!details) return null;
  return (
    <section className="bg-olive-deep text-white py-12 px-5 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-7">
        <h2 className="font-headline text-3xl">About this product</h2>
        <p className="text-base leading-relaxed text-white/90 max-w-2xl">
          {details}
        </p>
      </div>
    </section>
  );
}
