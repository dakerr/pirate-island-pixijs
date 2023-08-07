import gsap from 'gsap';

import { Container } from "pixi.js";
import { Game } from "../Game";
import { System } from "../SystemRunner";
import { Boat } from "../entities/Boat";

export class TestSystem implements System {
  public static SYSTEM_ID = 'test';

  public game!: Game;
  public view = new Container;
  public readonly boatContainer = new Container();
  public boat!: Boat;

  public init() {
    this.game.stage.addChild(this.view);

    this.boat = new Boat();
    this.boat.view.scale.set(0.25);

    this.boatContainer.addChild(this.boat.view);
    this.view.addChild(this.boatContainer);
  
    window.addEventListener('keydown', this._onKeyDown.bind(this));
  
  }

  public awake() {
  }

  public end() {
    window.removeEventListener('keydown', this._onKeyDown.bind(this));
  }

  public resize(w: number, h: number) {
    this.view.x = w * 0.5;
    this.view.y = h - 120;
  }

  private _onKeyDown(evt: KeyboardEvent) {
    if (evt.key === "ArrowRight") {
      gsap.to(this.boatContainer, {rotation: -0.1, x: this.boatContainer.x += 10, ease: 'linear', duration: 0.1});
    }
    if (evt.key === "ArrowLeft") {
      gsap.to(this.boatContainer, {rotation: 0.1, x: this.boatContainer.x -= 10, ease: 'linear', duration: 0.1});
    }
    console.log(evt);
  }
}