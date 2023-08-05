import { Application } from 'pixi.js';

export const app = new Application<HTMLCanvasElement>({
  resolution: Math.max(window.devicePixelRatio, 2),
  backgroundColor: 0xffffff,
});