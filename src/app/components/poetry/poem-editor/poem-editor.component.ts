import { Component, signal, computed, inject, effect } from '@angular/core';
import { SelectComponent, ButtonComponent, CardComponent, MultilineInputComponent } from '../../ui';
import { POETRY_FORM_OPTIONS } from '../../../data/poetry-forms.data';
import { PoetryAnalyzerService, ToastService, StateService } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poem-editor',
  standalone: true,
  imports: [CommonModule, SelectComponent, ButtonComponent, CardComponent, MultilineInputComponent],
  templateUrl: './poem-editor.component.html',
})
export class PoemEditorComponent {
  private readonly analyzer = inject(PoetryAnalyzerService);
  private readonly toastService = inject(ToastService);
  private readonly stateService = inject(StateService);

  readonly Math = Math;
  readonly formOptions = POETRY_FORM_OPTIONS;

  readonly selectedForm = this.stateService.selectedForm;
  readonly poemText = this.stateService.poemText;
  readonly currentForm = this.stateService.currentForm;
  readonly currentPattern = this.stateService.currentPattern;
  readonly expectedLines = this.stateService.expectedLines;
  readonly lines = this.stateService.lines;

  readonly lineCount = computed(() => this.lines().length);

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
    return expected > 0 ? (total / expected) * 100 : 0;
  });

  readonly editorHeight = signal('100%');

  constructor() {
    effect(() => {
      const formId = this.selectedForm();
      this.analyzer.selectedForm.set(formId);
      this.updateEditorForForm();
    });

    effect(() => {
      const text = this.poemText();
      this.analyzer.poemText.set(text);
    });

    effect(() => {
      this.adjustEditorHeight();
    });
  }

  onFormChange(formId: string): void {
    this.stateService.setSelectedForm(formId);
  }

  private updateEditorForForm(): void {
    const currentText = this.poemText();
    if (!currentText.trim()) {
      this.loadExample();
    }

    setTimeout(() => {
      this.adjustEditorHeight();
    }, 100);
  }

  onTextChange(text: string): void {
    const lines = text.split('\n');
    const trimmedText = lines.slice(0, this.expectedLines()).join('\n');
    this.stateService.setPoemText(trimmedText);
  }

  loadExample(): void {
    this.stateService.loadExample();
    this.toastService.success('Example Loaded', `Loaded ${this.selectedForm()} example`);

    setTimeout(() => {
      this.adjustEditorHeight();
    }, 100);
  }

  clear(): void {
    const hadContent = this.poemText().length > 0;
    this.stateService.clear();
    this.analyzer.clear();

    if (hadContent) {
      this.toastService.info('Editor Cleared', 'All content has been removed');
    }

    setTimeout(() => {
      this.adjustEditorHeight();
    }, 50);
  }

  analyze(): void {
    const lines = this.lines();
    if (lines.length === 0) {
      this.toastService.warning('Empty Poem', 'Write something first');
      return;
    }

    this.toastService.info('Analyzing Poem', 'Processing your poetry...');
    this.stateService.setIsAnalyzing(true);

    this.analyzer.analyze(this.selectedForm(), lines).finally(() => {
      this.stateService.setIsAnalyzing(false);
      this.stateService.setHasResults(true);
    });
  }

  async onCopyPoem(): Promise<void> {
    const text = this.poemText().trim();

    if (!text) {
      this.toastService.warning('Empty Poem', 'Nothing to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      const lineCount = this.lines().length;
      const syllableCount = this.totalSyllables();

      this.toastService.success('Poem Copied!', `${lineCount} lines, ${syllableCount} syllables`);
    } catch (err) {
      console.error('Failed to copy poem: ', err);
      this.toastService.error('Copy Failed', 'Could not copy to clipboard');
    }
  }

  isReadyForAnalysis(): boolean {
    return this.lineCount() > 0;
  }

  private adjustEditorHeight(): void {
    const lines = this.expectedLines();
    const baseHeight = 52;
    const calculatedHeight = Math.max(240, lines * baseHeight);

    this.editorHeight.set(`${calculatedHeight}px`);
  }

  getResponsiveFontClass(): string {
    return 'responsive-font';
  }

  getCurrentPlaceholder(): string {
    const form = this.currentForm();
    return form ? `Write your ${form.name} here...` : 'Write your poem here...';
  }
}
