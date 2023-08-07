import { Container, Texture, TilingSprite } from 'pixi.js';

import { designConfig } from '../game/designConfig';
import { AppScreen } from '../navigation';

export class ResultScreen extends Container implements AppScreen {
  /** A unique identifier for the screen. */
  public static SCREEN_ID = 'result';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/results-screen'];

  private _background: TilingSprite;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('bg2'), 260, 240);
    this._background.tileScale.set(designConfig.backgroundTileScale);

    this.addChild(this._background);
  }

  /**
   * Called before `show` function.
   * @param data - An object containing data specific to this screen.
   */
  public prepare() {
    // todo update the results
  }

  /** Called when the screen is being shown. */
  public async show() {
    this.alpha = 0;
  }

  /** Called when the screen is being hidden. */
  public async hide() {
    // todo
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
