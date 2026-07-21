import HeroSection from "../components/home/HeroSection";
import MarqueeStrip from "../components/home/MarqueeStrip";
import HeritageSection from "../components/home/HeritageSection";
import CollectionsGrid from "../components/home/CollectionsGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrustBadges from "../components/home/TrustBadges";
import NewsletterSignup from "../components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <div className="selection:bg-burnt-terracotta selection:text-white">
      <HeroSection />
      <MarqueeStrip />
      <HeritageSection />
      <CollectionsGrid />
      <FeaturedProducts />
      <TrustBadges />
      <NewsletterSignup />
    </div>
  );
}
