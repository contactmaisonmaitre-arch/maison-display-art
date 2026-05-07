import { memo } from "react";
import type { Scene, WeatherData } from "@/types/signage";
import { TextSlide } from "./TextSlide";
import { WeatherScene } from "./WeatherScene";
import { WineScene } from "./WineScene";
import { WineMapScene } from "./WineMapScene";
import { TeaScene } from "./TeaScene";
import { InstagramScene } from "./InstagramScene";
import { AnecdoteScene } from "./AnecdoteScene";
import { GoodNewsScene } from "./GoodNewsScene";
import { ProductsScene } from "./ProductsScene";
import { ReviewScene } from "./ReviewScene";
import { DoleScene } from "./DoleScene";
import { TvTonightScene } from "./TvTonightScene";
import { ChatPercheIntroScene } from "./ChatPercheIntroScene";
import { ChatPercheProgramScene } from "./ChatPercheProgramScene";

interface SceneRendererProps {
  scene: Scene;
  weather: WeatherData | null;
  active: boolean;
}

export const SceneRenderer = memo(({ scene, weather, active }: SceneRendererProps) => {
  switch (scene.type) {
    case "café":
      return <TextSlide bg="linear-gradient(135deg, #C4A882, #7A5030, #3A1A08)" tag="Café de Spécialité" titleStart="Origine, terroir," titleItalic="précision." body="Des cafés sélectionnés parmi les meilleurs producteurs du monde — torréfiés artisanalement, extraits avec soin." />;
    case "anecdote":
      return <AnecdoteScene anecdoteIndex={scene.anecdoteIndex ?? 0} />;
    case "goodnews":
      return <GoodNewsScene newsOffset={scene.newsOffset ?? 0} />;
    case "produits":
      return <ProductsScene productOffset={scene.productOffset ?? 0} />;
    case "vin":
      return <WineScene />;
    case "winemap":
      return <WineMapScene />;
    case "weather":
      return <WeatherScene weather={weather} />;
    case "thé":
      return <TeaScene />;
    case "épicerie":
      return <TextSlide bg="linear-gradient(135deg, #D0C080, #907030, #382810)" tag="Épicerie Fine" titleStart="Bien manger," titleItalic="bien choisir." body="Conserves artisanales, chocolats, condiments — sélectionnés avec la même exigence." />;
    case "instagram":
      return <InstagramScene active={active} reelIndex={scene.reelIndex ?? 0} />;
    case "chatperche-intro":
      return <ChatPercheIntroScene />;
    case "chatperche-program":
      return <ChatPercheProgramScene />;
    case "review":
      return <ReviewScene />;
    case "tv":
      return <TvTonightScene />;
    case "dole":
      return <DoleScene />;
  }
});
SceneRenderer.displayName = "SceneRenderer";
