import gsap from 'gsap';
import { Container, Sprite, utils } from 'pixi.js';

import { Boat } from '../entities/Boat';
import { Game } from '../Game';
import { System } from '../SystemRunner';
import { designConfig } from '../designConfig';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export class HudSystem implements System {
  public static SYSTEM_ID = 'hud';

  public game!: Game;
  public view = new Container();

  public readonly boatContainer = new Container();
  public boat!: Boat;

  private _left = false;
  private _right = false;

  // The container instance that will hold all the game hud.
  private readonly _gameHudContainer = new Container();
  private _background!: Sprite;

  public init() {
    this.view.addChild(this._gameHudContainer);
    this.game.stage.addChild(this.view);

    this.boat = new Boat();
    this.boat.view.scale.set(0.25);

    this.boatContainer.addChild(this.boat.view);
    this.view.addChild(this.boatContainer);

    this._background = Sprite.from('bg1');

    this._gameHudContainer.addChild(
      this._background,
    );
  }

  public async awake() {
    const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;
    const iOS = typeof requestPermission === 'function';
    if (iOS) {
        const response = await requestPermission();
        if (response === 'granted') {
          console.log(`granted!`);
        }
    }

    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
    if (utils.isMobile.phone) {
      window.addEventListener('devicemotion', this._onDeviceMotion.bind(this));
    }

    this._gameHudContainer.visible = true;
  }

  public end() {
    window.removeEventListener('keydown', this._onKeyDown.bind(this));
    window.removeEventListener('keyup', this._onKeyUp.bind(this));
    if (utils.isMobile.phone) {
      window.removeEventListener('devicemotion', this._onDeviceMotion.bind(this));
    }
  }

  public update() {
    if (this._right) {
      gsap.to(this.boatContainer, { rotation: -0.1, ease: 'linear', duration: 0.1 });
      this.boatContainer.x += 5;
    }
    if (this._left) {
      gsap.to(this.boatContainer, { rotation: 0.1, ease: 'linear', duration: 0.1 });
      this.boatContainer.x -= 5;
    }
  }

  public resize(w: number, h: number) {
    this.view.x = w * 0.5;
    this.view.y = h - 120;

    this._background.x = (w <= designConfig.content.width) ? -1920 * 0.5 : -w * 0.5;
    this._background.y = -h;

    this._background.width = (w <= designConfig.content.width) ? 1920 : w;
    this._background.height = h + 120;
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

  private _onDeviceMotion(event: DeviceMotionEvent) {
    let xMotion = event.accelerationIncludingGravity && event.accelerationIncludingGravity.x || 0;
    switch (screen.orientation.type) {
      case "portrait-primary":
        if (xMotion < -1) {
          this._left = true;
          this._right = false;
        } else if (xMotion > 1) {
          this._left = false;
          this._right = true;
        } else {
          this._left = false;
          this._right = false;
        }
        break;
    }
  }
}
