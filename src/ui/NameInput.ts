import { Input, InputOptions } from "@pixi/ui";
import { Container, Sprite, Text } from "pixi.js";
import { PrimaryButton } from "./buttons/PrimaryButton";

export interface NameInputOptions extends InputOptions {
  label: string;
  onEnterFn: (value: string) => void;
  
}

// const DEFAULT_SCALE = 0.6;

export class NameInput extends Container {
  /**
   * @param options - Options for the name input
   */

  private _inputLabel: Text;
  private _nameInput: Input;
  private _playBtn: PrimaryButton;

  constructor(options: NameInputOptions) {
    super();

    this._inputLabel = new Text(options.label, {
      fontFamily: 'PirateJack lglRX',
      fontSize: 30,
      align: 'center',
      fill: 'white',
    });

    this._nameInput = new Input({
        bg: Sprite.from('info-bg'),
        placeholder: 'Enter name',
        textStyle: {
          fill: 0x49c8ff,
          fontFamily: 'PirateJack lglRX',
          fontWeight: 'normal',
        },
        padding: 0,
        align: 'center',
        ...options
    });

    this._playBtn = new PrimaryButton({
      text: 'Play',
      buttonOptions: {
        defaultView: 'play-btn-up',
        disabledView: 'play-btn-disabled',
        
        scale: 0.33
      }
    });
    this._playBtn.enabled = false;
    this._playBtn.onPress.connect(() => options.onEnterFn(this._nameInput.value));
    this.addChild(this._inputLabel, this._nameInput, this._playBtn);

    this.pivot.x = this.width * 0.43;
    
    this._nameInput.x = this.width * 0.25;
    this._nameInput.y = this._inputLabel.y + 50; 
    this._nameInput.onChange.connect((val) => {
      if (val.length >= 1) {
        this._playBtn.enabled = true;
      } else {
        this._playBtn.enabled = false;
      }
    })

    // this._playBtn.pivot.x = -this._inputLabel.width;
    this._playBtn.x = this.width * 0.43;
    this._playBtn.y = this._nameInput.y + 125;
    
    this.scale.set(1.5);

    // this._enterBtn.onPress.connect(() => options.onEnterFn(this._nameInput.value));
  }
}