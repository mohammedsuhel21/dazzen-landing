"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { scrollToWaitlist } from "@/lib/scrollTo";

export default function Navbar() {
  const navVisible = useAppStore((s) => s.navVisible);
  const setNavVisible = useAppStore((s) => s.setNavVisible);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current && y > 120;
      setNavVisible(!goingDown);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setNavVisible]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10 transition-transform duration-500 ease-out ${
        navVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <a href="#top" aria-label="Dazzen home" className="flex items-center">
        <Image
          src="/logo/dazzen-logo.png"
          alt="Dazzen"
          width={110}
          height={32}
          className="h-auto w-24 brightness-0 invert sm:w-28"
          priority
        />
      </a>

      <button
        type="button"
        onClick={scrollToWaitlist}
        className="glass-panel rounded-full px-5 py-2.5 text-xs font-medium tracking-[0.2em] text-ivory uppercase transition-all duration-300 hover:border-champagne/60 hover:shadow-[0_0_24px_rgba(217,196,154,0.35)]"
      >
        Join Waitlist
      </button>
    </header>
  );
}
