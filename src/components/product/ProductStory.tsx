export default function ProductStory({
  productName,
  details,
}: {
  productName: string;
  details?: string;
}) {
  if (!details) return null;
  return (
    <section className="bg-olive-deep text-white py-12 px-5 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-7">
        <h2 className="font-headline text-3xl">
          A closer look at {productName}
        </h2>
        <p className="text-base leading-relaxed text-white/90 max-w-2xl">
          {details}
        </p>
      </div>
    </section>
  );
}
