import { Container } from 'pixi.js';

import type { AppScreen } from '../navigation';

/** The screen presented at the start, after loading. */
export class TitleScreen extends Container implements AppScreen
{
  /** A unique identifier for the screen */
  public static SCREEN_ID = 'title';
  /** An array of bundle IDs for dynamic asset loading. */
  public static assetBundles = ['images/title-screen'];
}