"use client";

import CinematicSection from "./CinematicSection";
import GoldenParticles from "@/components/canvas/GoldenParticles";
import { scrollToWaitlist } from "@/lib/scrollTo";

export default function Beginning() {
  return (
    <CinematicSection id="beginning" videoSrc="/videos/beginning.mp4" overlay="light">
      <GoldenParticles className="pointer-events-none absolute inset-0 z-[1]" />
      <div className="relative z-10">
        <h2 className="font-display max-w-3xl text-3xl font-light leading-snug text-charcoal text-glow sm:text-5xl md:text-6xl">
          This is only the beginning.
        </h2>
        <p className="mt-6 text-sm uppercase tracking-[0.4em] text-charcoal/70 sm:text-base">
          Be among the first to experience Dazzen.
        </p>
        <button
          type="button"
          onClick={scrollToWaitlist}
          className="glass-panel mt-12 rounded-full px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-charcoal transition-all duration-300 hover:border-bronze/60 hover:shadow-[0_0_30px_rgba(173,138,92,0.35)] sm:text-sm"
        >
          Join the Waitlist
        </button>
      </div>
    </CinematicSection>
  );
}
