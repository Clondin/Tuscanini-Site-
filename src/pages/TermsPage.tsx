export default function TermsPage() {
  return (
    <div className="min-h-screen bg-aged-cream px-6 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="uppercase tracking-[0.2em] text-[10px] text-on-surface/60 mb-4">Legal</p>
        <h1 className="font-headline text-3xl md:text-4xl text-heading italic mb-3">Terms &amp; Conditions</h1>
        <p className="text-xs text-on-surface/60 mb-12">Last updated October 14, 2026</p>

        <section className="mb-10">
          <h2 className="font-headline text-xl text-heading mb-3">Use of this site</h2>
          <p className="text-on-surface/75 leading-relaxed">
            This site shares information about Tuscanini products. Product details, images, packaging and
            availability are provided for general information and may change without notice. Always check the
            label on the package for the most current ingredient, allergen and kosher information.
          </p>
        </section>

        <section id="amazon-associates" className="mb-10 scroll-mt-28">
          <h2 className="font-headline text-xl text-heading mb-3">Amazon Associates</h2>
          <p className="text-on-surface/75 leading-relaxed">
            Some product pages link to Amazon. As an Amazon Associate, Tuscanini earns from qualifying purchases.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl text-heading mb-3">Other sites</h2>
          <p className="text-on-surface/75 leading-relaxed">
            Links to retailers and other websites are provided for convenience. Purchases made on those sites are
            governed by their own terms and policies.
          </p>
        </section>
      </div>
    </div>
  );
}
