import { Container } from 'pixi.js';

import { Game } from '../Game';

export class TimerSystem {
  /**
   * A unique identifier used by the system runner.
   * The identifier is used by the runner to differentiate between different systems.
   */
  public static SYSTEM_ID = 'hud';
  /**
   * The instance of the game the system is attached to.
   * This is automatically set by the system runner when the system is added to the game.
   */
  public game!: Game;
  /* The container instance that is the root of all visuals in this class. */
  public view = new Container();
  
  private _time = 0;
  private _paused = false;
  private _running = false;
  private _duration = 60 * 60;

  public init() {
    console.log('init timer');
  }

  public awake() {
    this._paused = true;
  }

  public update(delta: number) {
    if (this._running && !this._paused) {
      this._time += delta;
    }

    if (this._time > this._duration) {
      console.log('Game over');
      this.game.gameOver();
    }
  }

  public start() {
    this._running = true;
    this._paused = false;
  }

  public reset() {
    this._time = 0;
    this._running = false;
    this._paused = false;
  }

}