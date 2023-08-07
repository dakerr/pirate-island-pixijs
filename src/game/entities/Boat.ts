import { Container, Sprite } from 'pixi.js';

/** A class representing the boat. */
export class Boat {
  /** The Container instance which contains all the visual elements for this class. */
  public view = new Container();
  
  /** Holds the references to the various cannon parts as Sprite objects. */
  private _parts: Record<string, Sprite> = {};

  constructor() {
    // Use a helper function to simplify building the boat
    this._build();
  }
  
  /**
   * Helper function to build the boat. For future use.
   */
  private _build() {
    const create = (...ids: string[]) => {
      ids.forEach((id: string) => {
        const element = Sprite.from(id);

        element.anchor.set(0.5);
        this._parts[id] = element;
        this.view.addChild(element);
      });
    };

    // Call the create function with ids of the boat parts.  (For Future)
    create('boat');
  }

}
 