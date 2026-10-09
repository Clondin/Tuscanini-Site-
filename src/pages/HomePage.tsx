import { Link, useSearchParams } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import CollectionsGrid from "../components/home/CollectionsGrid";
import AisleIndex from "../components/home/AisleIndex";
import AisleRail from "../components/home/AisleRail";
import AisleExplorer from "../components/home/AisleExplorer";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CampaignPoster from "../components/home/CampaignPoster";
import ServingIdeas from "../components/home/ServingIdeas";
import HeritageSection from "../components/home/HeritageSection";
import NewsletterSignup from "../components/home/NewsletterSignup";

/**
 * Design review only: ?aisles=index|rail|explorer previews alternative
 * homepage aisle sections. Without the parameter the current grid renders
 * and no switcher appears. Remove once an option is chosen.
 */
const aisleOptions = {
  bento: { label: "Current", Component: CollectionsGrid },
  index: { label: "B · Index", Component: AisleIndex },
  rail: { label: "C · Poster rail", Component: AisleRail },
  explorer: { label: "D · Explorer", Component: AisleExplorer },
} as const;
type AisleKey = keyof typeof aisleOptions;

export default function HomePage() {
  const [params] = useSearchParams();
  const requested = params.get("aisles");
  const choice: AisleKey =
    requested && requested in aisleOptions ? (requested as AisleKey) : "bento";
  const { Component: Aisles } = aisleOptions[choice];
  return (
    <div className="selection:bg-tomato selection:text-paper">
      <HeroSection />
      <Aisles />
      <FeaturedProducts />
      <CampaignPoster />
      <ServingIdeas />
      <HeritageSection />
      <NewsletterSignup />
      {requested !== null && (
        <nav
          aria-label="Aisle section options"
          className="fixed z-40 left-1/2 -translate-x-1/2 bottom-6 flex gap-1 rounded-full bg-ink/90 p-1 shadow-2xl backdrop-blur"
        >
          {(Object.keys(aisleOptions) as AisleKey[]).map((key) => (
            <Link
              key={key}
              to={`?aisles=${key}#collections`}
              replace
              aria-current={key === choice ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-2 text-xs font-semibold ${
                key === choice ? "bg-paper text-ink" : "text-paper/85 hover:text-paper"
              }`}
            >
              {aisleOptions[key].label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
