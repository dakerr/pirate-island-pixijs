import gsap from 'gsap';
import { Container, Texture, TilingSprite } from 'pixi.js';

import { designConfig } from '../game/designConfig';
import { Game } from '../game/Game';
import { TimerSystem } from '../game/systems/TimerSystem';
import type { AppScreen } from '../navigation';
import { GameTimer } from '../ui/GameTimer';
import { GameScore } from '../ui/GameScore';

export interface GameData {
  name: string;
}

/** The screen that contains all the gameplay */
export class GameScreen extends Container implements AppScreen {
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'game';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/game-screen'];

  public readonly timer: GameTimer;
  public readonly score: GameScore;

  private readonly _background: TilingSprite;
  private readonly _game: Game;

  private _gameData!: GameData;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('s2_water_blue'), 256, 256);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this.addChild(this._background);

    this._game = new Game();
    this._game.init();
    this.addChild(this._game.stage);

    this.timer = new GameTimer();
    this.addChild(this.timer);

    this.score = new GameScore();
    this.addChild(this.score);
  }

  public prepare(data: GameData) {
    if (data) {
      this._gameData = {
        name: data.name
      };
      console.log(`gamescreen: ${data.name} data: ${this._gameData}`)
    }
  }

  public async show() {
    gsap.killTweensOf(this);
    this.alpha = 0;

    this._game.awake();
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });
    this._game.start(this._gameData.name);
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

    this.score.updateScore(this._game.stats.get('score'));
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._game.resize(w, h);

    this.timer.x = 10;
    this.timer.y = 10;

    this.score.x = w - this.score.width - 50;
    this.score.y = 10;
  }
}
