import { useEffect, useState } from "react";
import { fetchDataJson } from "@/lib/signage/remote";

/**
 * Charge un JSON de /public/data (GitHub d'abord, copie locale en secours)
 * et le recharge périodiquement. Garde la dernière valeur valide si un
 * rechargement échoue.
 */
export function useRemoteJson<T>(path: string, refreshMs = 30 * 60 * 1000): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const json = await fetchDataJson<T>(path);
      if (!cancelled && json) setData(json);
    };
    load();
    const id = setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [path, refreshMs]);

  return data;
}
