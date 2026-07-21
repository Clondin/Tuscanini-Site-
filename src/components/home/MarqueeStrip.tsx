const phrases = [
  "Autentico Italiano",
  "Made in Italy",
  "Certified Kosher",
  "Bronze-Cut Pasta",
  "Sun-Ripened Tomatoes",
  "First-Press Olive Oil",
  "Benvenuti alla Tavola",
];

function PhraseRun() {
  return (
    <>
      {phrases.map((phrase) => (
        <span key={phrase} className="inline-flex items-center gap-8 md:gap-12 shrink-0">
          <span className="font-headline italic text-lg md:text-xl text-aged-cream/90 whitespace-nowrap">
            {phrase}
          </span>
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
        </span>
      ))}
    </>
  );
}

export default function MarqueeStrip() {
  return (
    <div className="dark-section border-y border-gold/15 overflow-hidden py-4" aria-hidden>
      <div className="flex w-max gap-8 md:gap-12 animate-marquee">
        <PhraseRun />
        <PhraseRun />
      </div>
    </div>
  );
}
