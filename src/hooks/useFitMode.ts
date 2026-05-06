import { useEffect, useState } from "react";
import { safeGetStorage, safeSetStorage } from "@/lib/signage/storage";

export type FitMode = "fit" | "cover" | "100";

const STORAGE_KEY = "mm-fit";

export const useFitMode = () => {
  const [mode, setMode] = useState<FitMode>(
    () => (safeGetStorage(STORAGE_KEY) as FitMode) || "fit"
  );
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      if (mode === "fit") setScale(Math.min(sx, sy));
      else if (mode === "cover") setScale(Math.max(sx, sy));
      else setScale(1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [mode]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEY, mode);
  }, [mode]);

  return { mode, setMode, scale };
};
