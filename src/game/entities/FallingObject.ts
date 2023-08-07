import { Container, Sprite } from "pixi.js";
import { Game } from "../Game";

export const MAX_FALLING_OBJECT = 5;


export class FallingObject {

  public game!: Game;
  public view = new Container;
  public fobType!: string;

  private _fobs = ['p1', 'p2', 'p3', 'p4', 'e1', 'e2'];
  private _weight = [ 6, 5, 4, 3, 2, 1 ];

  public init(x: number, y: number) {
    // randomly choose a type
    this.fobType = this._randomTypePicker();

    const element = Sprite.from(this.fobType);
    element.anchor.set(0.5);
    
    
    this.view.addChild(element);
    this.view.scale.set(0.2);
    this.view.x = x;
    this.view.y = y;

    console.log(x, y, this.fobType);
  }

  public updatePositionY() {
    this.view.y += 5;
  }

  private _randomTypePicker() {
    let random: string[] = [];
    this._fobs.forEach((item, ndx) => {
      let clone = Array(this._weight[ndx]).fill(item);
      random.push(...clone);
    });

    return random[~~(Math.random() * random.length)];
  }
}