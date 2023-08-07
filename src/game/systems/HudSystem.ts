import { Container, Graphics, NineSlicePlane, Texture} from 'pixi.js';

import { designConfig } from '../designConfig';
import { Game } from '../Game';
import type { System } from '../SystemRunner';
import { BoatSystem } from './BoatSystem';

export class HudSystem implements System {
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
  /* The container instance that is used by the boat system to add the boat. */
  public readonly boatContainer = new Container();

  /** The container that hold all of the game hud. */
  private readonly _gameHudContainer = new Container();

  private _leftBorder!: NineSlicePlane;

  /** The mask is used to keep visual elements from rendering outside of the given game bounds */
  private _mask!: Graphics;

  /** Called when the system is added to the game. */
  public init() {
    this.view.addChild(this._gameHudContainer);
    this.game.stage.addChild(this.view);

    // left test
    this._leftBorder = new NineSlicePlane(Texture.from('game-side-border'));
    this._leftBorder.x = -(designConfig.content.width * 0.5) - this._leftBorder.width;

    // right test


    this._mask = new Graphics().beginFill(0xff0320).drawRect(
      -designConfig.content.width * 0.5,
      -designConfig.content.height,
      designConfig.content.width,
      designConfig.content.height,
    );

    this._gameHudContainer.addChild(
      this.boatContainer
    );

    // Designate the mask to the game hud
    this._gameHudContainer.mask = this._mask;

    // Connect to the boat system
    this.game.systems.get(BoatSystem).signals.onBoatMove.connect((isFirst) => {
      if (isFirst) {
        // On first move, hide popouts, start dropping
      }
    });
  }

  public awake() {
    this._gameHudContainer.visible = true;
  }

  public start() {
    // not displayed popup
    console.log('hud', this.game.systems.get(BoatSystem).boat.view.getGlobalPosition());
  }

  public resize(w: number, h: number) {
    this.view.x = w * 0.5;
    this.view.y = h;

    // Set the left visual wall to the left boundary
    this._leftBorder.y = -h;
    this._leftBorder.height = h;
    
  }
}