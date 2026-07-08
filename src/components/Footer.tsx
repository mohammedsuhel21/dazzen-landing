import Image from "next/image";

const socials = ["Instagram", "Facebook"];

export default function Footer() {
  return (
    <footer className="relative z-10 flex flex-col items-center gap-6 border-t border-champagne/15 bg-charcoal px-6 py-16 text-center">
      <Image
        src="/logo/dazzen-logo.png"
        alt="Dazzen"
        width={90}
        height={26}
        className="h-auto w-20 brightness-0 invert opacity-80"
      />
      <p className="font-display text-lg italic text-ivory/70">
        Built with science. Crafted with intention.
      </p>
      <div className="flex gap-6 text-xs uppercase tracking-[0.3em] text-ivory/40">
        {socials.map((s) => (
          <span key={s} className="cursor-default transition-colors hover:text-champagne">
            {s}
          </span>
        ))}
      </div>
      <p className="text-xs text-ivory/30">
        &copy; {new Date().getFullYear()} Dazzen. All rights reserved.
      </p>
    </footer>
  );
}
