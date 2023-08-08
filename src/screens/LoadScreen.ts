import gsap from 'gsap';
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

  public async show() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Reset screen data
    this.alpha = 0;

    // Tween screen into being visible
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });
  }

  public async hide() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Tween screen into being invisible
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;
  }
}
