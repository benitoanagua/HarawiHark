import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
  HostListener,
  signal,
  computed,
  OnInit,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RitaService } from '../../../services/poetry/rita.service';

export interface LineData {
  text: string;
  number: number;
  focused: boolean;
  syllables: number;
  expectedSyllables: number;
  isCorrect: boolean;
  isOver: boolean;
}

export interface SyllableSegment {
  index: number;
  filled: boolean;
}

@Component({
  selector: 'app-multiline-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiline-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultilineInputComponent),
      multi: true,
    },
  ],
})
export class MultilineInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild('linesContainer') linesContainer!: ElementRef<HTMLDivElement>;

  @Input() label = '';
  @Input() placeholder = 'Write your poem line by line...';
  @Input() error = '';
  @Input() disabled = false;
  @Input() rows = 12;
  @Input() id = 'multiline-input';
  @Input() showLineNumbers = true;
  @Input() showLineValidation = false;
  @Input() expectedPattern: number[] = [];
  @Input() fontSizeClass = 'text-base';

  private readonly rita = inject(RitaService);

  readonly lines = signal<LineData[]>([]);
  readonly focusedLineIndex = signal<number | null>(null);

  readonly poemText = computed(() =>
    this.lines()
      .map((l) => l.text)
      .join('\n')
  );

  @Input()
  get value(): string {
    return this.poemText();
  }
  set value(val: string) {
    this.initializeLines(val || '');
    this.onChange(this.poemText());
  }

  @Output() valueChange = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<void>();
  @Output() lineFocus = new EventEmitter<{ index: number; text: string }>();
  @Output() lineValidationChange = new EventEmitter<LineData[]>();

  private onChange: (value: string) => void = () => {
    // Placeholder for ControlValueAccessor
  };
  private onTouched: () => void = () => {
    // Placeholder for ControlValueAccessor
  };

  ngOnInit() {
    this.initializeLines('');
  }

  private initializeLines(text: string): void {
    const linesArray = text.split('\n');
    const total = this.rows; // Número fijo de líneas
    const result: LineData[] = [];

    for (let i = 0; i < total; i++) {
      const expectedSyllables = this.expectedPattern[i] || 0;
      result.push({
        text: linesArray[i] || '',
        number: i + 1,
        focused: false,
        syllables: 0,
        expectedSyllables,
        isCorrect: false,
        isOver: false,
      });
    }
    this.lines.set(result);
    this.updateLineValidation();
  }

  writeValue(value: string): void {
    this.initializeLines(value || '');
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

  onLineInput(index: number, text: string): void {
    const updated = [...this.lines()];
    updated[index].text = text;

    // Actualizar validación de sílabas usando RiTa
    if (this.showLineValidation) {
      this.updateLineSyllables(updated[index]);
    }

    this.lines.set(updated);
    this.emitChanges();
    this.updateLineValidation();
  }

  onLineFocus(index: number): void {
    this.focusedLineIndex.set(index);
    this.lineFocus.emit({ index, text: this.lines()[index].text });
  }

  onLineBlur(): void {
    this.focusedLineIndex.set(null);
    this.onTouched();
    this.inputBlur.emit();
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent): void {
    const current = this.focusedLineIndex();
    if (current === null) return;

    const lines = this.lines();

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (current > 0) this.focusLine(current - 1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (current < lines.length - 1) this.focusLine(current + 1);
        break;

      case 'Enter':
        if (!event.shiftKey) {
          event.preventDefault();
          // No agregar nuevas líneas automáticamente
          if (current < lines.length - 1) {
            this.focusLine(current + 1);
          }
        }
        break;

      case 'Tab':
        event.preventDefault();
        this.insertTextAtCursor('  ');
        break;
    }
  }

  private focusLine(index: number): void {
    const input = document.getElementById(`${this.id}-line-${index}`) as HTMLInputElement;
    if (!input) return;

    input.focus();
    this.focusedLineIndex.set(index);
  }

  private insertTextAtCursor(text: string): void {
    const current = this.focusedLineIndex();
    if (current === null) return;

    const input = document.getElementById(`${this.id}-line-${current}`) as HTMLInputElement;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentText = this.lines()[current].text;

    const newText = currentText.substring(0, start) + text + currentText.substring(end);

    const updated = [...this.lines()];
    updated[current].text = newText;

    if (this.showLineValidation) {
      this.updateLineSyllables(updated[current]);
    }

    this.lines.set(updated);
    this.emitChanges();
    this.updateLineValidation();

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + text.length, start + text.length);
    });
  }

  private updateLineSyllables(line: LineData): void {
    if (!line.text.trim()) {
      line.syllables = 0;
      line.isCorrect = false;
      line.isOver = false;
      return;
    }

    // Usar RiTa para análisis real de sílabas
    const analysis = this.rita.analyzeLine(line.text);
    line.syllables = analysis.syllables;
    line.isCorrect = line.syllables === line.expectedSyllables;
    line.isOver = line.syllables > line.expectedSyllables;
  }

  private updateLineValidation(): void {
    if (this.showLineValidation) {
      const lines = this.lines();
      lines.forEach((line) => {
        if (line.text.trim()) {
          this.updateLineSyllables(line);
        }
      });
      this.lineValidationChange.emit(lines);
    }
  }

  private emitChanges(): void {
    this.onChange(this.poemText());
    this.valueChange.emit(this.poemText());
  }

  // Método para generar segmentos de sílabas
  getSyllableSegments(line: LineData): SyllableSegment[] {
    const segments: SyllableSegment[] = [];
    const expected = line.expectedSyllables;
    const current = line.syllables;

    for (let i = 0; i < expected; i++) {
      segments.push({
        index: i,
        filled: i < current,
      });
    }

    return segments;
  }

  getSyllableCountClass(line: LineData): string {
    if (line.syllables === 0) return 'syllable-count-empty';
    if (line.syllables === line.expectedSyllables) return 'syllable-count-perfect';
    if (line.syllables > line.expectedSyllables) return 'syllable-count-over';

    const progress = (line.syllables / line.expectedSyllables) * 100;
    if (progress >= 75) return 'syllable-count-close';
    if (progress >= 50) return 'syllable-count-medium';
    return 'syllable-count-low';
  }

  clear(): void {
    this.initializeLines('');
    this.emitChanges();
    this.focusLine(0);
  }

  focus(): void {
    this.focusLine(0);
  }
}
