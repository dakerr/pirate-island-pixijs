import { Input } from '@pixi/ui';
import gsap from 'gsap';
import { Container, Sprite, Text, Texture, TilingSprite } from 'pixi.js';

import { addScoreboardItem, FirestoreConfig } from '../firestore';
import { designConfig } from '../game/designConfig';
import { AppScreen, navigation } from '../navigation';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import { GameScreen } from './GameScreen';

export interface ResultsData {
  score: number;
  caught: number;
  highscore: number;
  config: FirestoreConfig;
}

const INPUT_PROMPT = 'Add your name to the scoreboard!';

export class ResultScreen extends Container implements AppScreen {
  /** A unique identifier for the screen. */
  public static SCREEN_ID = 'result';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/title-screen'];

  private _background: TilingSprite;
  private _playBtn!: PrimaryButton;
  private _playerInput!: Input;
  private _inputLabel!: Text;
  private _resultsView: Container = new Container();
  private _scoreText!: Text;
  private _results!: ResultsData;

  constructor() {
    super();

    // Create the background
    this._background = new TilingSprite(Texture.from('bg2'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this._background.interactive = true;
    this.addChild(this._background);

    this._clearResults();

    this._buildInputLabel();
    this._buildButtons();

    this._buildInput();
  }

  /**
   * Called before `show` function.
   * @param data - An object containing data specific to this screen.
   */
  public prepare(data: ResultsData) {
    this._buildResultsText(data.score);
    this._updateResultsData(data);
  }

  /** Called when the screen is being shown. */
  public async show() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    this.alpha = 0;

    // Tween screen into being visible
    await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });

    // this was hidden after accepting input
    this._playerInput.visible = true;
    this._playerInput.interactive = true;
    this._inputLabel.text = INPUT_PROMPT;
  }

  /** Called when the screen is being hidden. */
  public async hide() {
    // Kill tweens of the screen container
    gsap.killTweensOf(this);

    // Tween screen into being invisible
    await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });

    this._resultsView.removeChild(this._scoreText);
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

    this._inputLabel.x = w * 0.5;
    this._inputLabel.y = h * 0.5 - 10;

    this._playerInput.x = w * 0.5;
    this._playerInput.y = this._resultsView.y + 150;

    this._playBtn.x = w * 0.5;
    this._playBtn.y = this._playerInput.y + this._resultsView.height + 150;
  }

  private _updateResultsData(data: ResultsData) {
    if (data) {
      this._results.score = data.score;
      this._results.caught = data.caught;
      this._results.highscore = data.highscore;
      this._results.config.userId = data.config.userId;
      this._results.config.docRef = data.config.docRef;
    }
  }

  private _buildResultsText(score: number) {
    this._scoreText = new Text(`Score: ${score}`, {
      fontFamily: 'PirateJack lglRX',
      fontSize: 70,
      align: 'center',
      fill: 'white',
    });
    this._resultsView.addChild(this._scoreText);
    this._resultsView.pivot.x = this._resultsView.width / 2;
    this._resultsView.pivot.y = this._resultsView.height / 2;
    this.addChild(this._resultsView);
  }

  private _clearResults() {
    this._results = {
      score: 0,
      caught: 0,
      highscore: 0,
      config: {
        userId: '',
        docRef: '',
      },
    };
  }

  private _buildButtons() {
    this._playBtn = new PrimaryButton({
      text: 'Play Again?',
    });

    this._playBtn.onPress.connect(() => {
      navigation.goToScreen(GameScreen);
    });

    this.addChild(this._playBtn);
  }

  private _buildInputLabel() {
    const label = INPUT_PROMPT;

    this._inputLabel = new Text(label, {
      fontFamily: 'PirateJack lglRX',
      fontSize: 30,
      align: 'center',
      fill: 'white',
    });
    this._inputLabel.anchor.set(0.5);
    this.addChild(this._inputLabel);
  }

  private _buildInput() {
    const bg = Sprite.from('info-bg');

    this._playerInput = new Input({
      bg,
      placeholder: 'Enter name',
      textStyle: {
        fill: 0x49c8ff,
        fontFamily: 'PirateJack lglRX',
        fontWeight: 'normal',
      },
      padding: 0,
      align: 'center',
    });
    this._playerInput.pivot.x = this._playerInput.width / 2;
    this._playerInput.pivot.y = this._playerInput.height / 2;
    this._playerInput.scale.set(1.5);
    this._playerInput.onEnter.connect((val) => {
      if (this._results.config.userId && val.length > 0) {
        addScoreboardItem(
          {
            name: val,
            score: this._results.score,
          },
          this._results.config.docRef,
          this._results.config.userId,
        );
        // clear the name before the next game
        this._playerInput.value = '';
        this._playerInput.visible = false;
        this._playerInput.interactive = false;
        this._inputLabel.text = 'Thank-you!';
      }
    });
    this.addChild(this._playerInput);
  }
}
