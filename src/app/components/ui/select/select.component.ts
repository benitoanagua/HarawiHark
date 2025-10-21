import { Component, Input, Output, EventEmitter, forwardRef, inject, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StateService } from '../../../services/';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  private readonly stateService = inject(StateService);

  @Input() options: SelectOption[] = [];
  @Input() label = '';
  @Input() disabled = false;
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

  @Output() selectChange = new EventEmitter<string>();

  private onChange: (value: string) => void = () => {
    // Placeholder for ControlValueAccessor
  };
  private onTouched: () => void = () => {
    // Placeholder for ControlValueAccessor
  };

  constructor() {
    effect(() => {
      if (this.id === 'poetry-form') {
        const selectedForm = this.stateService.selectedForm();
        if (this._value !== selectedForm) {
          this._value = selectedForm;
        }
      }
    });
  }

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

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this._value = target.value;
    this.onChange(this._value);
    this.selectChange.emit(this._value);

    if (this.id === 'poetry-form') {
      this.stateService.setSelectedForm(this._value);
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
