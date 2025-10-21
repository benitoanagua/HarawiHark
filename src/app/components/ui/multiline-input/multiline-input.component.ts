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
  inject,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RitaService, StateService } from '../../../services/';

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
export class MultilineInputComponent implements ControlValueAccessor {
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
  private readonly stateService = inject(StateService);

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
  private isInternalUpdate = false;

  constructor() {
    this.initializeLines('');

    // ✅ Effect para sincronizar con el estado
    effect(() => {
      const pattern = this.stateService.currentPattern();
      const newRows = this.stateService.expectedLines();
      const sharedText = this.stateService.poemText();
      const shouldLoadExample = this.stateService.shouldLoadExample();

      console.log('🟣 MultilineInput effect:', {
        pattern,
        rows: newRows,
        textLength: sharedText.length,
        shouldLoadExample,
        currentRows: this.rows,
        currentPattern: this.expectedPattern,
      });

      // Actualizar patrón y número de líneas SIEMPRE que cambie el formulario
      if (pattern.length > 0) {
        this.expectedPattern = pattern;
        this.rows = newRows;

        // Si debemos cargar ejemplo
        if (shouldLoadExample) {
          console.log('🟣 Loading example...');
          this.stateService.loadExample();
          this.stateService.consumeLoadExample();
          return;
        }

        // Sincronizar con el texto compartido solo si cambió externamente
        if (!this.isInternalUpdate && sharedText !== this.poemText()) {
          console.log('🟣 Syncing text from state');
          this.initializeLines(sharedText);
        } else {
          // Si el texto no cambió pero el patrón sí, re-inicializar líneas
          console.log('🟣 Reinitializing lines with new pattern');
          this.initializeLines(sharedText);
        }
      }
    });
  }

  private initializeLines(text: string): void {
    const linesArray = text.split('\n');
    const total = this.rows;
    const result: LineData[] = [];

    for (let i = 0; i < total; i++) {
      const expectedSyllables = this.expectedPattern[i] || 0;
      const lineText = linesArray[i] || '';
      const syllables = lineText ? this.rita.analyzeLine(lineText).syllables : 0;

      result.push({
        text: lineText,
        number: i + 1,
        focused: false,
        syllables,
        expectedSyllables,
        isCorrect: syllables === expectedSyllables && syllables > 0,
        isOver: syllables > expectedSyllables,
      });
    }

    this.lines.set(result);
    this.updateLineValidation();
  }

  writeValue(value: string): void {
    if (!this.isInternalUpdate) {
      this.initializeLines(value || '');
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
  }

  onLineInput(index: number, text: string): void {
    this.isInternalUpdate = true;

    const updated = [...this.lines()];
    updated[index].text = text;

    if (this.showLineValidation) {
      this.updateLineSyllables(updated[index]);
    }

    this.lines.set(updated);
    this.emitChanges();
    this.updateLineValidation();

    // Actualizar el estado compartido
    this.stateService.updatePoemLines(updated.map((line) => line.text));

    setTimeout(() => {
      this.isInternalUpdate = false;
    }, 0);
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

  setText(text: string): void {
    this.initializeLines(text);
    this.emitChanges();
  }
}
