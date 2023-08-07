import { Container } from 'pixi.js';
import { Signal } from 'typed-signals';

import { Boat } from '../entities/Boat';
import type { Game } from '../Game';
import type { System } from '../SystemRunner';
import { HudSystem } from './HudSystem';

/** A system that handles the boat interactions in the game. */
export class BoatSystem implements System {

  /**
   * A unique identifier used by the system runner.
   * The identifier is used by the runner to differentiate between different systems.
   */
  public static SYSTEM_ID = 'boat';
  
  /**
   * The instance of the game the system is attached to.
   * This is automatically set by the system runner when the system is added to the game.
   */
  public game!: Game;
  /* The container instance that is the root of all visuals in this class. */
  public view = new Container();
  /** The game's main boat instance. */
  public boat!: Boat;
  
  /** A set of signals that other systems can access. */
  public signals = {
    onBoatMove: new Signal<(isFirst: boolean) => void>(),
  };

  public init() {
    // Add the view container to the HudSystem's boat container
    this.game.systems.get(HudSystem).boatContainer.addChild(this.view);

    // Create the main boat instance
    this.boat = new Boat();
    this.boat.view.scale.set(0.5);
    this.view.addChild(this.boat.view);

    // Set the boat position to a pre-defined line
    this.boat.view.x = 0;
    this.boat.view.y = 0; // boardConfig.floatLine + 75;
  }

  public start() {
    this.boat.view.x = 0;
    this.boat.view.y = 0;
    console.log('boat',this.boat.view.getGlobalPosition());
  }

  public reset() {
    this.boat.position = 0;
  }
}
