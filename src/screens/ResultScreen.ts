import gsap from 'gsap';
import { Container, Texture, TilingSprite, Sprite, Text } from 'pixi.js';
import { Input } from '@pixi/ui';

import { designConfig } from '../game/designConfig';
import { AppScreen, navigation } from '../navigation';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import { GameScreen } from './GameScreen';

export interface ResultsData {
  score: number;
  caught: number;
  highscore: number;
}

export class ResultScreen extends Container implements AppScreen {
  /** A unique identifier for the screen. */
  public static SCREEN_ID = 'result';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/title-screen'];

  private _background: TilingSprite;
  private _playBtn!: PrimaryButton;
  private _playerInput!: Input;
  // private _results!: ResultsData;
  private _resultsView!: Container;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('bg2'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this._background.interactive = true;
    this.addChild(this._background);

    this._buildButtons();

    this._buildInput();
  }

  /**
   * Called before `show` function.
   * @param data - An object containing data specific to this screen.
   */
  public prepare(data: ResultsData) {
    this._buildResultsText(data);
  }

  /** Called when the screen is being shown. */
  public async show() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);
    
    this.alpha = 0;

    // Tween screen into being visible
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });
  }

  /** Called when the screen is being hidden. */
  public async hide() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Tween screen into being invisible
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });
  }

  /**
   * Gets called every time the screen resizes.
   * @param w - width of the screen.
   * @param h - height of the screen.
   */
  public resize(w: number, h: number) {
    // Fit background to screen
    this._background.width = w;
    this._background.height = h;

    this._resultsView.x = w * 0.5;
    this._resultsView.y = h * 0.4;

    this._playerInput.x = w * 0.5;
    this._playerInput.y = this._resultsView.y + 100;

    this._playBtn.x = w * 0.5;
    this._playBtn.y = this._playerInput.y + this._resultsView.height + 200;

  }

  private _buildResultsText(data: ResultsData) {
    const score = new Text(`Score: ${(data) ? data.score : 0}`, {
      fontFamily: 'PirateJack lglRX',
      fontSize: 70,
      align: 'center',
      fill: 'white'
    });
    // this._results = data;

    this._resultsView = new Container();
    this._resultsView.addChild(score);
    this._resultsView.pivot.x = this._resultsView.width/2;
    this._resultsView.pivot.y = this._resultsView.height/2;
    this.addChild(this._resultsView);
  }

  private _buildButtons() {
    this._playBtn = new PrimaryButton({
      text: 'Play Again?'
    });

    this._playBtn.onPress.connect(() => {
      navigation.goToScreen(GameScreen);
    });

    this.addChild(this._playBtn);
  }

  private _buildInput() {
    const bg = Sprite.from('info-bg');

    this._playerInput = new Input({
      bg,
      placeholder: 'Enter name',
      textStyle: {
        fill: 0x49C8FF,
        fontFamily: 'PirateJack lglRX',
        fontWeight: 'normal',
      },
      padding: 0,
      align: 'center'
    });
    this._playerInput.pivot.x = this._playerInput.width/2;
    this._playerInput.pivot.y = this._playerInput.height/2;
    this._playerInput.scale.set(1.5);
    this._playerInput.onEnter.connect((val) => { console.log(val)});
    this.addChild(this._playerInput);
  }
}
