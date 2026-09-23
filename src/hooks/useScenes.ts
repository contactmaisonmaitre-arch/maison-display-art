import { useMemo } from "react";
import type { PlaylistEntry, Scene } from "@/types/signage";
import { DEFAULT_PLAYLIST, buildScenes } from "@/data/scenes";
import { useRemoteJson } from "./useRemoteJson";
import { useToday } from "./useToday";
import { useAnnonces } from "./useAnnonces";
import { ephemeresActive, type CarteJson } from "@/data/carte";

interface PlaylistJson {
  scenes: PlaylistEntry[];
}

/**
 * Scènes du jour : programmation de public/data/playlist.json (ou celle par
 * défaut), filtrée selon la date. Recalculée à minuit et quand le fichier
 * change sur GitHub.
 */
export const useScenes = (): Scene[] => {
  const json = useRemoteJson<PlaylistJson>("data/playlist.json", 15 * 60 * 1000);
  const today = useToday();
  const annonces = useAnnonces();
  const carte = useRemoteJson<CarteJson>("data/carte.json", 30 * 60 * 1000);
  // Tant que la carte n'est pas chargée, on suppose les éphémères actifs.
  const eph = carte ? ephemeresActive(carte) : true;
  const playlist = json?.scenes?.length ? json.scenes : DEFAULT_PLAYLIST;
  const key = JSON.stringify(playlist);
  return useMemo(
    () => buildScenes(playlist, today, { annonceCount: annonces.length, ephemeres: eph }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, today, annonces.length, eph],
  );
};
