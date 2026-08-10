import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Pause, Play } from "lucide-react";
import TextReveal from "../ui/TextReveal";
import MagneticButton from "../ui/MagneticButton";
import { getCmsData } from "../../data/cms";

export default function HeroSection() {
  const cms = getCmsData("page", "home");
  const headline = typeof cms?.headline === "string" ? cms.headline : "Italy at Your Table";
  const body = typeof cms?.body === "string"
    ? cms.body
    : "Authentic flavors, sourced from the heart of Italy — crafted for your home kitchen.";
  const buttonLabel = typeof cms?.cta_label === "string" ? cms.cta_label : "Enter the pantry";
  const buttonUrl = typeof cms?.cta_url === "string" && cms.cta_url.trim()
    ? cms.cta_url
    : "/#collections";
  const heroImage = typeof cms?.hero_image === "string" ? cms.hero_image : "";
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const smoothScrollTo = (e: MouseEvent<HTMLAnchorElement>, url: string) => {
    const hashIndex = url.indexOf("#");
    if (hashIndex < 0) return;

    const targetPath = url.slice(0, hashIndex);
    const targetId = url.slice(hashIndex + 1);
    if (!targetId || (targetPath && targetPath !== "/" && targetPath !== window.location.pathname)) return;

    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const toggleVideo = () => {
    if (!videoEnabled) {
      setVideoEnabled(true);
      setVideoPaused(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[calc(100svh-72px)] min-h-[620px] flex items-center justify-center overflow-hidden bg-dark"
    >
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-[120%] object-cover opacity-90"
          />
        ) : videoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/assets/Photos/backgrounds/italian-coast-hero.webp"
            onPlay={() => setVideoPaused(false)}
            onPause={() => setVideoPaused(true)}
            className="w-full h-[120%] object-cover opacity-90"
            src="/assets/Trailer/Tuscanini_Trailer_Screens_Final.mp4"
          />
        ) : (
          <img
            src="/assets/Photos/backgrounds/italian-coast-hero.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-[120%] object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 film-grain opacity-[0.07] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/25 to-dark/40" />
      </motion.div>

      {!heroImage && (
        <button
          type="button"
          onClick={toggleVideo}
          aria-pressed={videoEnabled && !videoPaused}
          aria-label={videoEnabled && !videoPaused ? "Pause background film" : "Play background film"}
          className="absolute bottom-5 right-5 z-30 hidden min-h-11 items-center gap-2 border border-white/30 bg-dark/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-dark/75 md:inline-flex"
        >
          {videoEnabled && !videoPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {videoEnabled && !videoPaused ? "Pause film" : "Play film"}
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[1000px] mx-auto px-6 md:px-10 text-center"
      >
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
          Taste Tuscanini. Know Italy.
        </p>

        <TextReveal
          text={headline}
          as="h1"
          mode="word"
          delay={0.35}
          className="font-headline font-normal text-italia-white text-[clamp(3.5rem,8vw,6.5rem)] leading-none"
        />

        <div className="w-20 h-px bg-gold/60 mx-auto my-[34px]" />

        <p className="font-script italic text-italia-white/88 text-[clamp(1.25rem,2.2vw,1.625rem)] leading-relaxed max-w-[560px] mx-auto">
          {body}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <MagneticButton className="inline-block">
            <motion.a
              href={buttonUrl}
              onClick={(e) => smoothScrollTo(e, buttonUrl)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-[34px] py-[17px] bg-gold text-dark text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
            >
              {buttonLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </MagneticButton>
          <a
            href="#heritage"
            onClick={(e) => smoothScrollTo(e, "#heritage")}
            className="inline-flex items-center gap-2.5 px-[34px] py-[17px] border border-italia-white/35 text-italia-white/90 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-colors"
          >
            Our story
          </a>
        </div>
      </motion.div>
    </section>
  );
}
