import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useFitMode, type FitMode } from "@/hooks/useFitMode";
import { FixedTopBar } from "./layout/FixedTopBar";
import { CenterPanel } from "./layout/CenterPanel";

const FIT_OPTIONS: { k: FitMode; label: string; desc: string }[] = [
  { k: "fit", label: "Adapter", desc: "Aucun contenu coupé" },
  { k: "cover", label: "Remplir", desc: "Pleine surface, peut couper" },
  { k: "100", label: "100 %", desc: "Taille réelle 1920×1080" },
];

const SignageDisplay = () => {
  const weather = useWeather();
  const { mode, setMode, scale } = useFitMode();
  const [showCtrl, setShowCtrl] = useState(false);

  // Rechargement complet chaque nuit vers 4h30 : récupère la dernière version
  // publiée du site et évite que le navigateur de la TV s'encrasse.
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      if (d.getHours() === 4 && d.getMinutes() === 30) window.location.reload();
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // Show controls on mouse move, hide after 3s
  useEffect(() => {
    let t: number | undefined;
    const onMove = () => {
      setShowCtrl(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setShowCtrl(false), 3000);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onMove);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      className="mm-grain-global fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ cursor: showCtrl ? "default" : "none", background: "radial-gradient(ellipse at center, #46121F 0%, #2E0B14 100%)" }}
    >
      <div
        className="relative flex overflow-hidden"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          background: "radial-gradient(ellipse at center, #46121F 0%, #2E0B14 100%)",
        }}
      >
        <FixedTopBar weather={weather} />
        <CenterPanel weather={weather} />
      </div>

      {/* Mode d'affichage — visible au survol */}
      <div
        className="fixed top-4 right-4 z-[9999] flex gap-1 rounded-full p-1 transition-opacity duration-500"
        style={{
          opacity: showCtrl ? 1 : 0,
          backgroundColor: "rgba(46,11,20,0.92)",
          border: "1px solid rgba(232,201,169,0.4)",
          fontFamily: "Jost, sans-serif",
        }}
      >
        {FIT_OPTIONS.map((o) => (
          <button
            key={o.k}
            onClick={() => setMode(o.k)}
            title={o.desc}
            className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors"
            style={{
              backgroundColor: mode === o.k ? "hsl(var(--gold))" : "transparent",
              color: mode === o.k ? "#3A0F1A" : "rgba(244,240,231,0.8)",
              cursor: "pointer",
              border: "none",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SignageDisplay;
