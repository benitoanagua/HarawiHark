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
  readonly totalSyllables = computed(() => {
    return this.lines().reduce((total, line) => {
      return total + this.analyzer['rita'].analyzeLine(line).syllables;
    }, 0);
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
