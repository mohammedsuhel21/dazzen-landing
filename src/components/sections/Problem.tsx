"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicSection from "./CinematicSection";

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 65%",
          end: "top 20%",
          scrub: false,
          toggleActions: "play none none reverse",
        },
      });
      tl.fromTo(
        ".problem-line-1",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      ).fromTo(
        ".problem-line-2",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "+=0.3"
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <CinematicSection id="problem" videoSrc="/videos/problem.mp4" overlay="dark">
        <h2 className="font-display max-w-3xl text-3xl font-light leading-snug sm:text-5xl md:text-6xl">
          <span className="problem-line-1 block opacity-0 text-glow">
            The problem isn&apos;t your skin.
          </span>
          <span className="problem-line-2 mt-4 block italic text-champagne opacity-0">
            It&apos;s the information.
          </span>
        </h2>
      </CinematicSection>
    </div>
  );
}
