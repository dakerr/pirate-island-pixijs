import gsap from 'gsap';
import { Container, Texture, TilingSprite } from 'pixi.js';

import { designConfig } from '../game/designConfig';
import { Game } from '../game/Game';
import { TimerSystem } from '../game/systems/TimerSystem';
import type { AppScreen } from '../navigation';
import { GameTimer } from '../ui/GameTimer';

/** The screen that contains all the gameplay */
export class GameScreen extends Container implements AppScreen {
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'game';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/game-screen'];

  public readonly timer: GameTimer;

  private readonly _background: TilingSprite;
  private readonly _game: Game;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('bg1'), 1920, 1080);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this.addChild(this._background);

    this._game = new Game();
    this._game.init();
    this.addChild(this._game.stage);

    this.timer = new GameTimer();
    this.addChild(this.timer);
  }

  public async show() {
    gsap.killTweensOf(this);
    this.alpha = 0;

    this._game.awake();
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });
    this._game.start();
  }

  public async hide() {
    gsap.killTweensOf(this);
    this._game.end();
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });
    this._game.reset();
  }

  public update(delta: number) {
    this._game.update(delta);
    const remaining = this._game.systems.get(TimerSystem).getTimeRemaining();

    if (remaining >= 0) {
      this.timer.updateTime(remaining);
    }
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._game.resize(w, h);

    this.timer.x = 10;
    this.timer.y = 10;
  }
}
