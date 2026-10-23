import { VideoLoop } from "@/components/signage/media/VideoLoop";

/**
 * Vidéo plein écran (playlist.json → { "type": "video", "src": "/videos/xxx.mp4" }).
 * Mettre les vidéos dans public/videos/ (servies par le site publié) après
 * passage dans scripts/convert-video.sh.
 */
export const VideoScene = ({ active, src, poster }: { active: boolean; src?: string; poster?: string }) => {
  if (!src) return <div className="absolute inset-0" style={{ background: "#46121F" }} />;
  return <VideoLoop src={src} poster={poster} active={active} />;
};
