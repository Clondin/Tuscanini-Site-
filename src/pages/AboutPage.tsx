import AboutHero from "../components/about/AboutHero";
import OriginStory from "../components/about/OriginStory";
import AboutRange from "../components/about/AboutRange";
import CampaignReel from "../components/about/CampaignReel";
import SourcingJourney from "../components/about/SourcingJourney";
import PhotoGallery from "../components/about/PhotoGallery";
import AboutCTA from "../components/about/AboutCTA";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <AboutHero />
      <OriginStory />
      <AboutRange />
      <CampaignReel />
      <SourcingJourney />
      <PhotoGallery />
      <AboutCTA />
    </div>
  );
}
