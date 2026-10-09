import HeroSection from "../components/home/HeroSection";
import CollectionsGrid from "../components/home/CollectionsGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CampaignPoster from "../components/home/CampaignPoster";
import ServingIdeas from "../components/home/ServingIdeas";
import HeritageSection from "../components/home/HeritageSection";
import NewsletterSignup from "../components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <div className="selection:bg-tomato selection:text-paper">
      <HeroSection />
      <CollectionsGrid />
      <FeaturedProducts />
      <CampaignPoster />
      <ServingIdeas />
      <HeritageSection />
      <NewsletterSignup />
    </div>
  );
}
