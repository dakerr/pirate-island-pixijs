import { Game } from '../Game';
import { System } from '../SystemRunner';

export class ScoreSystem implements System {
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

  public init() {
    
  }
}