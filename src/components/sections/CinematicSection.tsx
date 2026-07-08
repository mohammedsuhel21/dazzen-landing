"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicSectionProps {
  id: string;
  videoSrc: string;
  poster?: string;
  overlay?: "dark" | "light" | "gold";
  children: ReactNode;
}

const overlays = {
  dark: "bg-charcoal/55",
  light: "bg-ivory/10",
  gold: "bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent",
};

export default function CinematicSection({
  id,
  videoSrc,
  poster,
  overlay = "dark",
  children,
}: CinematicSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoWrapRef.current,
        { scale: 1, filter: "blur(0px)", opacity: 1 },
        {
          scale: 1.18,
          filter: "blur(6px)",
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={sectionRef} className="relative h-screen w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={videoWrapRef} className="absolute inset-0 h-full w-full">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
        <div className={`absolute inset-0 ${overlays[overlay]}`} />

        <div
          ref={contentRef}
          className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
