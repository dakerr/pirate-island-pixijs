import { Container, Sprite, Texture } from 'pixi.js';

import { FallingObject, MAX_FALLING_OBJECT } from '../entities/FallingObject';
import { Game } from '../Game';
import { pool } from '../Pool';
import { System } from '../SystemRunner';
import { TestSystem } from './TestSystem';

export class FobSystem implements System {
  /**
   * A unique identifier used by the system runner.
   * The identifier is used by the runner to differentiate between different systems.
   */
  public static SYSTEM_ID = 'falling_objects';
  /**
   * The instance of the game the system is attached to.
   * This is automatically set by the system runner when the system is added to the game.
   */
  public game!: Game;
  /* The container instance that is the root of all visuals in this class. */
  public view = new Container();

  private _width = 0;
  private _height = 0;

  private _dropper = new Container();
  private _player!: Container;

  private _e1: Sprite = new Sprite(Texture.from('e1'));  private _updateCount = 0;

  private _movingRight = true;
  private _fobEntities: FallingObject[] = [];
  private _randoArray: number[] = Array.from(Array(Math.floor(100)).keys());

  public init() {
    this.game.stage.addChild(this.view);
    this._e1.scale.set(0.25);
    this._dropper.addChild(this._e1);
    this.view.addChild(this._dropper);
    this._player = this.game.systems.get(TestSystem).boatContainer;
  }

  public awake() {
    this._dropper.position = {x: 0, y: -200};
    this._dropper.visible = false;
  }

  public update(delta: number) {
    this._updateDropper();
    this._updateFallingEntities(delta);
    this._testForCollision();
  }

  public reset() {
    this._removeAllFobs();
  }

  public resize(w: number, h: number) {
    this.view.x = w * 0.5;
    this.view.y = 120;

    this._width = w;
    this._height = h;
  }

  private _updateDropper() {
    const pos = this._dropper.getGlobalPosition();
    
    if (pos.x < 0 || pos.x > this._width) {
      this._movingRight = !this._movingRight;
    }

    if (this._movingRight) {
      this._dropper.x += 10;
    } else {
      this._dropper.x -= 10;
    }
  }

  private _updateFallingEntities(delta: number) {
    this._updateCount += delta;
    if (this._updateCount > 1000) {
      this._updateCount = 0;
    }

    this._fobEntities.forEach(item => item.updatePositionY());

    // randomly create falling objects
    const drop = this._randoArray[~~(Math.random() * this._randoArray.length)];

    if ([1, 42, 51, 99].includes(drop)) {
      this._createFallingObject();
    }

    this._fobEntities.forEach((fob, index) => {
      if (fob.view.y > this._height) {
        this._removeFob(fob, index);
      }
    });
  }

  private _removeFob(item: FallingObject, index: number) {
    pool.return(item);
    item.view.removeFromParent();
    this._fobEntities = this._fobEntities.filter((_, i) => i !== index);
  }

  private _removeAllFobs() {
    this._fobEntities.forEach(item => {
      item.view.removeFromParent();
      pool.return(item);
    });
    this._fobEntities = [];
  }

  private _testForCollision() {
    const lowEntities = this._fobEntities.filter(x => x.view.y > this._height - 200);

    lowEntities.forEach((item, index) => {
      if (this._collision(this._player, item.view)) {
        this._setScore(item.fobType);
        this._removeFob(item, index);
      }
    });
  }

  private _setScore(type: string) {
    if (type === 'e1' || type === 'e2') {
      this.game.stats.increment('score', -100);
    } else {
      this.game.stats.increment('score', 50);
    }
    this.game.stats.increment('objectsCaught');
  }

  private _collision(player: Container, object: Container) {
    const bounds1 = player.getBounds();
    const bounds2 = object.getBounds();

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
  }

  private _createFallingObject() {
    // max entities on screen?
    if (this._fobEntities.length < MAX_FALLING_OBJECT) {
      const dropperPos = this._dropper.getGlobalPosition();
      const fob = pool.get(FallingObject);
      
      fob.init(dropperPos.x, dropperPos.y);
      this._fobEntities.push(fob);

      this.game.stage.addChild(fob.view);
    }
  }
}