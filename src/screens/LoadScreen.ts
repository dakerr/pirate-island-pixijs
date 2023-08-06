import { Container } from 'pixi.js';

/** The default load screen for the game. */
export class LoadScreen extends Container
{
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'loader';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/preload'];
}