export const PaperGrain = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.022, mixBlendMode: "multiply" }} aria-hidden>
    <filter id="mm-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#mm-grain)" />
  </svg>
);
