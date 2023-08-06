import { Container, Texture, TilingSprite } from 'pixi.js';

import type { AppScreen } from '../navigation';
import { designConfig } from '../game/designConfig';

/** The screen that contains all the gameplay */
export class GameScreen extends Container implements AppScreen {
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'game';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/game-screen'];

  private readonly _background: TilingSprite;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('bg1'), 1920, 1080);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    // this._background.anchor.x = 0;
    // this._background.anchor.y = 0;
    this.addChild(this._background);
  }
}
