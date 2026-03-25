import AboutHero from "../components/about/AboutHero";
import OriginStory from "../components/about/OriginStory";
import ValuesPillars from "../components/about/ValuesPillars";
import SourcingJourney from "../components/about/SourcingJourney";
import PhotoGallery from "../components/about/PhotoGallery";
import AboutCTA from "../components/about/AboutCTA";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <AboutHero />
      <OriginStory />
      <ValuesPillars />
      <SourcingJourney />
      <PhotoGallery />
      <AboutCTA />
    </div>
  );
}
