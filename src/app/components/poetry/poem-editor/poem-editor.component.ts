import { Component, signal, computed, inject } from '@angular/core';
import { SelectComponent, InputComponent, ButtonComponent, CardComponent } from '../../ui';
import { POETRY_FORM_OPTIONS, POETRY_EXAMPLES } from '../../../data/poetry-forms.data';
import { PoetryAnalyzerService, PoetryPatternsService } from '../../../services';

@Component({
  selector: 'app-poem-editor',
  standalone: true,
  imports: [SelectComponent, InputComponent, ButtonComponent, CardComponent],
  templateUrl: './poem-editor.component.html',
})
export class PoemEditorComponent {
  private readonly analyzer = inject(PoetryAnalyzerService);
  private readonly patterns = inject(PoetryPatternsService);

  readonly Math = Math;
  readonly formOptions = POETRY_FORM_OPTIONS;
  readonly selectedForm = signal('haiku');
  readonly poemText = signal('');

  readonly currentForm = computed(() => this.patterns.getFormInfo(this.selectedForm()));
  readonly lines = computed(() =>
    this.poemText()
      .split('\n')
      .filter((line) => line.trim().length > 0)
  );
  readonly lineCount = computed(() => this.lines().length);

  // Contadores mejorados en tiempo real
  readonly totalSyllables = computed(() => {
    return this.lines().reduce((total, line) => {
      return total + this.analyzer['rita'].analyzeLine(line).syllables;
    }, 0);
  });

  readonly expectedSyllables = computed(() => {
    const form = this.currentForm();
    return form ? form.pattern.reduce((sum: number, n: number) => sum + n, 0) : 0;
  });

  readonly syllableProgress = computed(() => {
    const total = this.totalSyllables();
    const expected = this.expectedSyllables();
    return expected > 0 ? Math.min((total / expected) * 100, 100) : 0;
  });

  // Análisis por línea en tiempo real
  readonly liveLineAnalysis = computed(() => {
    const form = this.currentForm();
    if (!form) return [];

    return this.lines().map((line, index) => {
      const analysis = this.analyzer['rita'].analyzeLine(line);
      const expected = form.pattern[index] ?? 0;
      const syllables = analysis.syllables;

      return {
        lineNumber: index + 1,
        text: line,
        currentSyllables: syllables,
        expectedSyllables: expected,
        isCorrect: syllables === expected,
        isOver: syllables > expected,
        progress: expected > 0 ? (syllables / expected) * 100 : 0,
      };
    });
  });

  onFormChange(formId: string): void {
    this.selectedForm.set(formId);
    this.analyzer.selectedForm.set(formId);
  }

  onTextChange(text: string): void {
    this.poemText.set(text);
    this.analyzer.poemText.set(text);
  }

  loadExample(): void {
    const formId = this.selectedForm();
    const example = POETRY_EXAMPLES[formId];
    if (example) {
      this.poemText.set(example.join('\n'));
      this.analyzer.poemText.set(example.join('\n'));
    }
  }

  clear(): void {
    this.poemText.set('');
    this.analyzer.poemText.set('');
    this.analyzer.clear();
  }

  analyze(): void {
    const formId = this.selectedForm();
    const lines = this.lines();

    if (lines.length === 0) return;

    this.analyzer.analyze(formId, lines);
  }
}
