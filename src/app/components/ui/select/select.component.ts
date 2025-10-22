import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  inject,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() options: SelectOption[] = [];
  @Input() label = '';
  @Input() disabled = false;
  @Input() id = '';

  @Input()
  get value(): string {
    return this._value;
  }
  set value(val: string) {
    if (this._value !== val) {
      this._value = val || '';
      this.onChange(this._value);
      this.cdr.markForCheck();
    }
  }

  _value = '';

  @Output() selectChange = new EventEmitter<string>();

  private onChange: (value: string) => void = () => {
    // Placeholder for ControlValueAccessor
  };
  private onTouched: () => void = () => {
    // Placeholder for ControlValueAccessor
  };
  private isInternalUpdate = false;

  constructor() {
    if (this.id === 'poetry-form-selector') {
      effect(() => {
        const selectedForm = this.stateService.selectedForm();

        if (this._value !== selectedForm && !this.isInternalUpdate) {
          this._value = selectedForm;
          this.cdr.detectChanges();
        }
      });
    }
  }

  writeValue(value: string): void {
    if (!this.isInternalUpdate) {
      this._value = value || '';
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;

    if (this._value === newValue) {
      return;
    }

    this.isInternalUpdate = true;
    this._value = newValue;
    this.onChange(this._value);
    this.selectChange.emit(this._value);

    if (this.id === 'poetry-form-selector') {
      this.stateService.setSelectedForm(this._value);
    }

    setTimeout(() => {
      this.isInternalUpdate = false;
    }, 0);
  }

  onBlur(): void {
    this.onTouched();
  }
}
