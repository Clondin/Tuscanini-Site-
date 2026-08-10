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
          <span className="font-headline italic text-lg md:text-[19px] text-aged-cream/85 whitespace-nowrap">
            {phrase}
          </span>
          <span aria-hidden className="w-[5px] h-[5px] rounded-full bg-gold/60 shrink-0" />
        </span>
      ))}
    </>
  );
}

export default function MarqueeStrip() {
  return (
    <div className="bg-dark border-y border-gold/20 overflow-hidden py-[15px]" aria-hidden>
      <div className="flex w-max gap-8 md:gap-12 animate-marquee">
        <PhraseRun />
        <PhraseRun />
      </div>
    </div>
  );
}
