import gsap from 'gsap';
import { Container } from 'pixi.js';

import { Boat } from '../entities/Boat';
import { Game } from '../Game';
import { System } from '../SystemRunner';

export class TestSystem implements System {
  public static SYSTEM_ID = 'test';

  public game!: Game;
  public view = new Container;
  public readonly boatContainer = new Container();
  public boat!: Boat;

  private _left = false;
  private _right = false;

  public init() {
    this.game.stage.addChild(this.view);

    this.boat = new Boat();
    this.boat.view.scale.set(0.25);

    this.boatContainer.addChild(this.boat.view);
    this.view.addChild(this.boatContainer);
  }

  public awake() {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
  }

  public end() {
    window.removeEventListener('keydown', this._onKeyDown.bind(this));
    window.removeEventListener('keyup', this._onKeyUp.bind(this));
  }

  public update() {
    if (this._right) {
      gsap.to(this.boatContainer, {rotation: -0.1, ease: 'linear', duration: 0.1});
      this.boatContainer.x += 5;
    }
    if (this._left) {
      gsap.to(this.boatContainer, {rotation: 0.1, ease: 'linear', duration: 0.1});
      this.boatContainer.x -= 5;
    }
  }

  public resize(w: number, h: number) {
    this.view.x = w * 0.5;
    this.view.y = h - 120;
  }

  private _onKeyDown(evt: KeyboardEvent) {
    if (evt.key === 'ArrowRight') {
      this._right = true;
    }
    if (evt.key === 'ArrowLeft') {
      this._left = true;
    }
  }

  private _onKeyUp(evt: KeyboardEvent) {
    if (evt.key === 'ArrowRight') {
      this._right = false;
    }
    if (evt.key === 'ArrowLeft') {
      this._left = false;
    }
  }
}