import type { Scene, WeatherData } from "@/types/signage";
import { TextSlide } from "./TextSlide";
import { WeatherScene } from "./WeatherScene";
import { TeaScene } from "./TeaScene";
import { InstagramScene } from "./InstagramScene";
import { AnecdoteScene } from "./AnecdoteScene";
import { GoodNewsScene } from "./GoodNewsScene";
import { ProductsScene } from "./ProductsScene";
import { ReviewScene } from "./ReviewScene";
import { DoleScene } from "./DoleScene";
import { TvTonightScene } from "./TvTonightScene";
import { ChatPercheScene } from "./ChatPercheScene";

interface SceneRendererProps {
  scene: Scene;
  weather: WeatherData | null;
  active: boolean;
  now: Date;
}

export const SceneRenderer = ({ scene, weather, active, now }: SceneRendererProps) => {
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
      return <TextSlide bg="linear-gradient(135deg, #C0A8B0, #704050, #2A1020)" tag="Vins Naturels" titleStart="Le vin comme" titleItalic="il devrait être." body="Vignerons engagés — Marcel Lapierre, Jean Foillard, Overnoy-Houillon, Yvon Métras." />;
    case "weather":
      return <WeatherScene weather={weather} />;
    case "thé":
      return <TeaScene now={now} />;
    case "épicerie":
      return <TextSlide bg="linear-gradient(135deg, #D0C080, #907030, #382810)" tag="Épicerie Fine" titleStart="Bien manger," titleItalic="bien choisir." body="Conserves artisanales, chocolats, condiments — sélectionnés avec la même exigence." />;
    case "instagram":
      return <InstagramScene active={active} reelIndex={scene.reelIndex ?? 0} />;
    case "chatperche":
      return <ChatPercheScene />;
    case "review":
      return <ReviewScene />;
    case "tv":
      return <TvTonightScene />;
    case "dole":
      return <DoleScene />;
  }
};
