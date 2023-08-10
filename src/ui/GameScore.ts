import { Container, Text } from "pixi.js";

export class GameScore extends Container {
  private readonly _score: Text;

  constructor() {
    super();

    this._score = new Text('0', {
      fontFamily: 'PirateJack lglRX',
      fontSize: 100,
      align: 'right',
      fill: 0x49c8ff,
      dropShadow: true,
      dropShadowBlur: 10,
      dropShadowAlpha: 0.5,
      dropShadowColor: 'white',     
    });
    this._score.anchor.set(0.5, 0);
    this.addChild(this._score);
  }

  public updateScore(newScore: number) {
    this._score.text = String(newScore);
  }
}