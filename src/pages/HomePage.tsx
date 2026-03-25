import HeroSection from "../components/home/HeroSection";
import HeritageSection from "../components/home/HeritageSection";
import AdBannersSection from "../components/home/AdBannersSection";
import BrandBanner from "../components/home/BrandBanner";
import CollectionsGrid from "../components/home/CollectionsGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BeveragesBanner from "../components/home/BeveragesBanner";
import ItalianQuote from "../components/home/ItalianQuote";
import TrustBadges from "../components/home/TrustBadges";
import NewsletterSignup from "../components/home/NewsletterSignup";
import ClosingSection from "../components/home/ClosingSection";

export default function HomePage() {
  return (
    <div className="selection:bg-burnt-terracotta selection:text-white">
      <HeroSection />
      <HeritageSection />
      <AdBannersSection />
      <BrandBanner />
      <CollectionsGrid />
      <FeaturedProducts />
      <BeveragesBanner />
      <ItalianQuote />
      <TrustBadges />
      <NewsletterSignup />
      <ClosingSection />
    </div>
  );
}
