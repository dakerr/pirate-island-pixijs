import { Container } from 'pixi.js';

import type { AppScreen } from '../navigation';

/** The screen that contains all the gameplay */
export class GameScreen extends Container implements AppScreen
{
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'game';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/game-screen'];
}