import CinematicSection from "./CinematicSection";
import GoldenParticles from "@/components/canvas/GoldenParticles";

export default function Belief() {
  return (
    <CinematicSection id="belief" videoSrc="/videos/belief.mp4" overlay="gold">
      <GoldenParticles className="pointer-events-none absolute inset-0 z-[1]" />
      <div className="relative z-10">
        <h2 className="font-display max-w-3xl text-3xl font-light leading-snug text-glow sm:text-5xl md:text-6xl">
          We believe skincare should make sense.
        </h2>
        <div className="mt-8 flex flex-col items-center gap-2 text-sm uppercase tracking-[0.35em] text-ivory/70 sm:flex-row sm:gap-6 sm:text-base">
          <span>No hype.</span>
          <span className="hidden sm:inline text-champagne/50">·</span>
          <span>No confusion.</span>
          <span className="hidden sm:inline text-champagne/50">·</span>
          <span className="text-champagne">Just science.</span>
        </div>
      </div>
    </CinematicSection>
  );
}
