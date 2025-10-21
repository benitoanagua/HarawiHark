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
    // Sincronizar con el estado SOLO para poetry-form
    effect(() => {
      if (this.id === 'poetry-form') {
        const selectedForm = this.stateService.selectedForm();

        if (this._value !== selectedForm && !this.isInternalUpdate) {
          console.log('🔴 Select effect - updating from state:', {
            old: this._value,
            new: selectedForm,
          });
          this._value = selectedForm;
          this.cdr.markForCheck();
        }
      }
    });
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

    console.log('🔴 Select changed:', { old: this._value, new: newValue });

    // Prevenir loop infinito
    if (this._value === newValue) {
      console.log('🔴 Same value, ignoring');
      return;
    }

    this.isInternalUpdate = true;
    this._value = newValue;
    this.onChange(this._value);
    this.selectChange.emit(this._value);

    // Solo actualizar estado si es el select de poetry-form
    if (this.id === 'poetry-form') {
      console.log('🔴 Updating state service');
      this.stateService.setSelectedForm(this._value);
    }

    setTimeout(() => {
      this.isInternalUpdate = false;
    }, 50);
  }

  onBlur(): void {
    this.onTouched();
  }
}
