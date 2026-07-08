"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";

const PARTICLE_COUNT = 36;

export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; delay: number; scale: number }[]
  >([]);
  const setLoading = useAppStore((s) => s.setLoading);

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.8,
        scale: 0.4 + Math.random() * 1,
      }))
    );
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
      },
    });

    const counter = { value: 0 };
    tl.to(counter, {
      value: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
    });

    tl.to(
      ".loader-particle",
      {
        opacity: 1,
        scale: 1,
        stagger: { each: 0.015, from: "random" },
        duration: 0.6,
        ease: "power2.out",
      },
      0
    );

    tl.to(".loader-logo", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.3);

    tl.to(rootRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      pointerEvents: "none",
    });

    return () => {
      tl.kill();
    };
  }, [setLoading, particles.length]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal"
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="loader-particle absolute rounded-full opacity-0"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${2 + p.scale * 3}px`,
              height: `${2 + p.scale * 3}px`,
              background:
                "radial-gradient(circle, rgba(217,196,154,0.9) 0%, rgba(217,196,154,0) 70%)",
              transform: `scale(${p.scale})`,
              transitionDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="loader-logo relative z-10 flex flex-col items-center gap-6 opacity-0 translate-y-4">
        <Image
          src="/logo/dazzen-logo.png"
          alt="Dazzen"
          width={160}
          height={48}
          priority
          className="h-auto w-32 sm:w-40"
        />
        <span className="font-display text-sm tracking-[0.4em] text-champagne/80">
          {progress.toString().padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
