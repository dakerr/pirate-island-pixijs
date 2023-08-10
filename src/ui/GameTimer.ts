import { Container, Text } from 'pixi.js';

export class GameTimer extends Container {
  private readonly _time:Text;

  constructor() {
    super();

    this._time = new Text('60', {
      fontFamily: 'PirateJack lglRX',
      fontSize: 100,
      align: 'center',
      fill: 0x49c8ff,
      dropShadow: true,
      dropShadowBlur: 10,
      dropShadowAlpha: 0.5,
      dropShadowColor: 'white',     
    });
    this.addChild(this._time);
  }

  public updateTime(remaining: number) {
    const seconds = Math.floor(remaining/60) % 60;

    this._time.text = String(seconds).padStart(2, '0');
  }
}