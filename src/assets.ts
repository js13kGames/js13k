import floor from "../assets/floor.png";
import robotArms from "../assets/arms.png";
import robotBody from "../assets/robot.png";
import painter from "../assets/painter.png";
import storage from "../assets/storage.png";
import provider from "../assets/provider.png";

const images = {
  floor: new Image(),
  storage: new Image(),
  painter: new Image(),
  provider: new Image(),
  player: new Image(),
  playerArms: new Image(),
};

let totalImages = Object.keys(images).length,
  imagesLoaded = 0;

export function loadAssets(): Promise<Record<string, HTMLImageElement>> {
  return new Promise((resolve, reject) => {
    for (let key in images) {
      images[key].onload = () =>
        ++imagesLoaded === totalImages && resolve(images);

      images[key].onerror = reject;
    }

    images.floor.src = floor;
    images.storage.src = storage;
    images.painter.src = painter;
    images.provider.src = provider;
    images.playerArms.src = robotArms;
    images.player.src = robotBody;
  });
}

export default images;
