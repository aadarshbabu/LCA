import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

export function Player({
  url,
  title,
  thumbnail,
}: {
  url: string;
  title: string;
  thumbnail: string;
}) {
  console.log("url", url, title, thumbnail);
  return (
    <MediaPlayer
      title={title ?? "Sprite Fight"}
      src={url ?? "youtube/_cMxraX_5RE"}
    >
      <MediaProvider />
      <DefaultVideoLayout
        thumbnails={
          thumbnail ?? "https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        }
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
}
