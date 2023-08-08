import gsap from 'gsap';
import { Container, Rectangle, Texture, TilingSprite } from 'pixi.js';

import { designConfig } from '../game/designConfig';
import { AppScreen, navigation } from '../navigation';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import { GameScreen } from './GameScreen';

/** The screen presented at the start, after loading. */
export class TitleScreen extends Container implements AppScreen {
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'title';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/title-screen'];

  /** A container to assign user interaction to */
  private readonly _hitContainer = new Container();
  /** The hit area to be used by the cannon */
  private readonly _hitArea: Rectangle;
  /** A background visual element */
  private readonly _background: TilingSprite;

  private _playBtn!: PrimaryButton;

  private _topAnimContainer = new Container();
  /** A container to group visual elements for easier animation */
  private _midAnimContainer = new Container();
  /** A container to group visual elements for easier animation */
  private _bottomAnimContainer = new Container();

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('bg2'), 240, 240);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this._background.interactive = true;
    this.addChild(this._background);

    // Create the hit area
    this._hitArea = new Rectangle();

    // Prepare the container for interaction
    this._hitContainer.interactive = true;
    this._hitContainer.hitArea = this._hitArea;
    this.addChild(this._hitContainer);

    // Add buttons like the play button and audio button
    this._buildButtons();

    // Add all parent containers to screen
    this.addChild(this._topAnimContainer, this._midAnimContainer, this._bottomAnimContainer);
  }

  /** Called before `show` function, can receive `data` */
  public prepare() {
    // Reset the positions of the group containers
    gsap.set(this._topAnimContainer, { y: -350 });
    gsap.set(this._midAnimContainer, { x: 200 });
    gsap.set(this._bottomAnimContainer, { y: 350 });
  }

  /** Called when the screen is being shown. */
  public async show() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Reset screen data
    this.alpha = 0;

    // Tween screen into being visible
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });

    // The data to be used in the upcoming tweens
    const endData = {
      x: 0,
      y: 0,
      duration: 0.75,
      ease: 'elastic.out(1, 0.5)',
    };

    // Tween the containers back to their original position
    gsap.to(this._topAnimContainer, endData);
    gsap.to(this._midAnimContainer, endData);
    gsap.to(this._bottomAnimContainer, endData);
  }

  public async hide() {
    // Remove all listeners on the hit container so they don't get triggered outside of the title screen
    this._hitContainer.removeAllListeners();

    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Tween screen into being invisible
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });
  }

  /** Add buttons to screen. */
  private _buildButtons() {
    this._playBtn = new PrimaryButton({
      text: 'Play',
    });

    this._playBtn.onPress.connect(() => {
      navigation.goToScreen(GameScreen);
    });

    this._bottomAnimContainer.addChild(this._playBtn);
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

    this._playBtn.x = w * 0.5;
    this._playBtn.y = h * 0.5;
  }
}
