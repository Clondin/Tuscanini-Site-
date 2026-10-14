/** The one Amazon Associates disclosure a page shows near its "Buy on Amazon" links. */
export default function AmazonDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] leading-relaxed text-on-surface/50 ${className}`}>
      As an Amazon Associate, Tuscanini earns from qualifying purchases.
    </p>
  );
}
