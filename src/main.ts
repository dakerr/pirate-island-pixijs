import { Application, Assets } from 'pixi.js';

import { initAssets } from './assets';
import { designConfig } from './game/designConfig';
import { navigation } from './navigation';
import { GameScreen } from './screens/GameScreen';
import { LoadScreen } from './screens/LoadScreen';
import { TitleScreen } from './screens/TitleScreen';
import { getUrlParam } from './utils/utils';

export const app = new Application<HTMLCanvasElement>({
  resolution: Math.max(window.devicePixelRatio, 2),
  backgroundColor: 0xffffff,
});

function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const minWidth = designConfig.content.width;
  const minHeight = designConfig.content.height;

  // Calculate renderer and canvas sizes based on current dimensions
  const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
  const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
  const scale = scaleX > scaleY ? scaleX : scaleY;
  const width = windowWidth * scale;
  const height = windowHeight * scale;

  // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
  app.renderer.view.style.width = `${windowWidth}px`;
  app.renderer.view.style.height = `${windowHeight}px`;
  window.scrollTo(0, 0);

  // Update renderer  and navigation screens dimensions
  app.renderer.resize(width, height);
  navigation.init();
  navigation.resize(width, height);
}

/** Setup app and initialise assets */
async function init() {
  // Add pixi canvas element (app.view) to the document's body
  document.body.appendChild(app.view);

  // Whenever the window resizes, call the 'resize' function
  window.addEventListener('resize', resize);

  // Trigger the first resize
  resize();

  // Setup assets bundles (see assets.ts) and start up loading everything in background
  await initAssets();

  // Assign the universal loading screen
  navigation.setLoadScreen(LoadScreen);

  // Show first screen - go straight to game if '?play' param is present in url
  // This is used for debugging
  if (getUrlParam('play') !== null) {
    await Assets.loadBundle(TitleScreen.assetBundles);
    await navigation.goToScreen(GameScreen);
  } else if (getUrlParam('loading') !== null) {
    await navigation.goToScreen(LoadScreen);
  } else {
    await navigation.goToScreen(TitleScreen);
  }
}

// Init everything
init();