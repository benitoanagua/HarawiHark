import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'textarea' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() error = '';
  @Input() disabled = false;
  @Input() rows = 6;
  @Input() id = '';

  @Input()
  get value(): string {
    return this._value;
  }
  set value(val: string) {
    this._value = val || '';
    this.onChange(this._value);
  }

  _value = '';

  @Output() inputChange = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<void>();

  private onChange: (value: string) => void = () => {
    // Placeholder for ControlValueAccessor
  };
  private onTouched: () => void = () => {
    // Placeholder for ControlValueAccessor
  };

  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this._value = target.value;
    this.onChange(this._value);
    this.inputChange.emit(this._value);
  }

  onBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
  }
}
