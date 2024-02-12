import gsap from 'gsap';
import type { DisplayObject } from 'pixi.js';
import { Container, Rectangle } from 'pixi.js';
import { throttle } from 'lodash';

import { authenticateAnonymously, FirestoreConfig, addScoreboardItem } from '../firestore';
import { navigation } from '../navigation';
import { ResultScreen } from '../screens/ResultScreen';
import { boardConfig } from './boardConfig';
import { Stats } from './Stats';
import { SystemRunner } from './SystemRunner';
import { FobSystem } from './systems/FobSystem';
import { HudSystem } from './systems/HudSystem';
import { TimerSystem } from './systems/TimerSystem';
import { updateDoc } from 'firebase/firestore';

/** A class that handles all of gameplay based features. */
export class Game {
  /** Container to hold all game visuals. */
  public stage = new Container();
  /** Container to hold gameplay elements. */
  public gameContainer = new Container();
  /** Container to handle user interaction. */
  public hitContainer = new Container();
  /** A system manager to handle the common functions found in systems. */
  public systems: SystemRunner;
  /** A class that deals with user specific stats. */
  public stats: Stats;
  /** A flag to determine if the game has reached the "GAMEOVER" state */
  public isGameOver = false;
  /** The user id for the firestore database */
  public firestoreConfig: FirestoreConfig = {
    userId: '',
    docRef: '',
  };

  /** The hit area to be used by the `hitContainer`. */
  private readonly _hitArea: Rectangle;

  private _throttledFn: any;
  private _scoreRef: any = null;
  private _playerName!: string;

  constructor() {
    this.stage.addChild(this.gameContainer);

    // Prepare the container for interaction
    this._hitArea = new Rectangle();

    this.hitContainer.interactive = true;
    this.hitContainer.hitArea = this._hitArea;
    this.gameContainer.addChild(this.hitContainer);

    // Instantiate system runner and pass `this`
    this.systems = new SystemRunner(this);

    this.stats = new Stats();

    this._throttledFn = throttle(async () => { this.sendScore() }, 1000);
  }

  /**
   * Adds `DisplayObject`s to the game container.
   * @param displayObjects - The `DisplayObject`s to add to the game container.
   */
  public addToGame(...displayObjects: DisplayObject[]) {
    displayObjects.forEach((displayObject) => {
      this.gameContainer.addChild(displayObject);
    });
  }

  /**
   * Removes `DisplayObject`s from the game container.
   * @param displayObjects - The `DisplayObject`s to remove from the game container.
   */
  public removeFromGame(...displayObjects: DisplayObject[]) {
    displayObjects.forEach((displayObject) => {
      displayObject.removeFromParent();
    });
  }

  /** Initialisation point of the Game, used to add systems to the game. */
  public init() {
    this.systems.add(HudSystem);
    this.systems.add(TimerSystem);
    this.systems.add(FobSystem);

    this.systems.init();
  }

  /** Performs initial setup for the game. */
  public async awake() {
    this.systems.awake();
    this.gameContainer.visible = true;

    // connect to the firestore
    const firestoreUser = await authenticateAnonymously();

    // add the firestore document reference for the scoreboard
    Object.assign(this.firestoreConfig, {
      userId: firestoreUser.user.uid,
      docRef: 'gVnOkIA68OF0zpu8f2IA',
    });
  }

  /** Starts the game logic. */
  public async start(name: string) {
    console.log(`game start: ${name}`)
    this._playerName = name;
    this.systems.start();
  }

  /** Handles the end of the game. */
  public async gameOver() {
    this.isGameOver = true;
    this.gameContainer.visible = false;
    gsap.delayedCall(1, () => {
      // Navigate to the ResultScreen after a 1 second delay
      // Send all relevant user stats
      navigation.goToScreen(ResultScreen, {
        score: this.stats.get('score'),
        caught: this.stats.get('objectsCaught'),
        highscore: this.stats.get('highscore'),
        config: this.firestoreConfig,
      });
    });
  }

  /** Ends the game logic. */
  public async end() {
    this.hitContainer.removeAllListeners();
    this.systems.end();
  }

  /**
   * Called every frame to update the game state
   * This includes updating the systems if the game is not paused or over.
   * @param delta - The time elapsed since the last update.
   */
  public update(delta: number) {
    if (this.isGameOver) return;
    this.systems.update(delta);
    this._throttledFn();
  }

  /** Resets the game to its initial state. */
  public reset() {
    this.isGameOver = false;
    this.stats.reset();
    this.systems.reset();
  }

  /**
   * Gets called every time the screen resizes.
   * @param w - width of the screen.
   * @param h - height of the screen.
   */
  public resize(w: number, h: number) {
    // Sets game container to the bottom of the screen,
    // since the game should be anchor there
    this.gameContainer.x = w * 0.5;
    this.gameContainer.y = h;

    this._hitArea.x = -w / 2;
    this._hitArea.y = -h;
    this._hitArea.width = w;
    this._hitArea.height = h - boardConfig.floatLine * 0.75;

    this.systems.resize(w, h);
  }

  private async sendScore() {
    const score = this.stats.get('score');
    if (this._scoreRef === null) {
      console.log(`add score: ${score}`);
      this._scoreRef = await addScoreboardItem(
        {
          name: this._playerName,
          score: score,
        },
        this.firestoreConfig.docRef,
        this.firestoreConfig.userId
      )
    } else {
      console.log(`update score: ${score}`);
      await updateDoc(this._scoreRef, {
        score: score
      })
    } 
  }
}
