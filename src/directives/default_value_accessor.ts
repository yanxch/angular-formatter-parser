import {Directive, ElementRef, Inject, Optional, Renderer2, Self} from '@angular/core';
import {COMPOSITION_BUFFER_MODE, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ɵgetDOM as getDOM} from '@angular/platform-browser';
import {IFormatterParser, NG_FORMATTER_PARSER} from './formatter-parser.directive';

/**
 * This is overriding Angulars DefaultValueAccessor with a custom value accessor that adds a formatting and parsing.
 * A custom value accessor always wins over a default one.
 * 
 */
@Directive({
  selector:
      `input:not([type=checkbox])[formControlName],
       textarea[formControlName],
       input:not([type=checkbox])[formControl],
       textarea[formControl],
       input:not([type=checkbox])[ngModel],
       textarea[ngModel],[ngDefaultControl]`,
  host: {
    '(input)': '$any(this)._handleInput($event.target.value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': '$any(this)._compositionStart()',
    '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DefaultValueAccessorFormatterParser,
    multi: true
  }]
})
export class DefaultValueAccessorFormatterParser implements ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = () => {};

  /** Whether the user is creating a composition string (IME events). */
  private _composing = false;

  constructor(
      private _renderer: Renderer2, private _elementRef: ElementRef,
      @Optional() @Self() @Inject(NG_FORMATTER_PARSER) formatterParsers: Array<IFormatterParser>,
      @Optional() @Inject(COMPOSITION_BUFFER_MODE) private _compositionMode: boolean) {
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
  }

  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  /** @internal */
  _handleInput(value: any): void {
    if (!this._compositionMode || (this._compositionMode && !this._composing)) {
      this.onChange(value);
    }
  }

  /** @internal */
  _compositionStart(): void { this._composing = true; }

  /** @internal */
  _compositionEnd(value: any): void {
    this._composing = false;
    this._compositionMode && this.onChange(value);
  }
}

function _isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}