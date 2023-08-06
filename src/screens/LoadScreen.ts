import { Container, Texture, TilingSprite } from 'pixi.js';

import { designConfig } from '../game/designConfig';

/** The default load screen for the game. */
export class LoadScreen extends Container {
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'loader';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/preload'];

  private readonly _background: TilingSprite;

  constructor() {
    super();

    // Create the visual aspects of the load screen
    this._background = new TilingSprite(Texture.from('background-tile'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this.addChild(this._background);
  }
}
