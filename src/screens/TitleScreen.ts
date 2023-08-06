import { Container, Texture, TilingSprite } from 'pixi.js';

import { designConfig } from '../game/designConfig';
import type { AppScreen } from '../navigation';

/** The screen presented at the start, after loading. */
export class TitleScreen extends Container implements AppScreen {
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'title';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/title-screen'];
  /** A background visual element */
  private readonly _background: TilingSprite;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('background-tile'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this._background.interactive = true;
    this.addChild(this._background);
  }

  /**
   * Gets called every time the screen resizes.
   * @param w - width of the screen.
   * @param h - height of the screen.
   */
  public resize(w: number, h: number) {
    // Fit background to screen
    this._background.width = w;
    this._background.height = h;
  }
}
