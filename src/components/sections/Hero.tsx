"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import CinematicSection from "./CinematicSection";
import { scrollToWaitlist } from "@/lib/scrollTo";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.6 });
    tl.fromTo(
      ".hero-logo",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
      .fromTo(
        ".hero-headline",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "-=0.6"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div id="top" ref={rootRef}>
      <CinematicSection id="hero" videoSrc="/videos/hero.mp4" overlay="dark">
        <div className="hero-logo opacity-0">
          <Image
            src="/logo/dazzen-logo.png"
            alt="Dazzen"
            width={220}
            height={64}
            priority
            className="mx-auto mb-8 h-auto w-40 brightness-0 invert sm:w-52"
          />
        </div>

        <h1 className="hero-headline font-display max-w-4xl text-balance text-4xl font-light leading-tight text-ivory opacity-0 text-glow sm:text-6xl md:text-7xl">
          The future of skincare begins with understanding.
        </h1>

        <p className="hero-sub mt-6 text-sm uppercase tracking-[0.5em] text-champagne/90 opacity-0 sm:text-base">
          Science. Simplicity. Precision.
        </p>

        <button
          type="button"
          onClick={scrollToWaitlist}
          className="hero-cta glass-panel mt-12 rounded-full px-8 py-4 text-xs font-medium uppercase tracking-[0.3em] text-ivory opacity-0 transition-all duration-300 hover:border-champagne/60 hover:shadow-[0_0_30px_rgba(217,196,154,0.4)] sm:text-sm"
        >
          Join the Waitlist
        </button>
      </CinematicSection>
    </div>
  );
}
