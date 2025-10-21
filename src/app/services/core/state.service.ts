import { Injectable, signal, computed } from '@angular/core';
import { POETRY_FORMS, POETRY_EXAMPLES } from '../../data/poetry-forms.data';

export interface AppState {
  selectedForm: string;
  poemText: string;
  isAnalyzing: boolean;
  hasResults: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private readonly state = signal<AppState>({
    selectedForm: 'haiku',
    poemText: '',
    isAnalyzing: false,
    hasResults: false,
  });

  readonly selectedForm = computed(() => this.state().selectedForm);
  readonly poemText = computed(() => this.state().poemText);
  readonly isAnalyzing = computed(() => this.state().isAnalyzing);
  readonly hasResults = computed(() => this.state().hasResults);
  readonly currentForm = computed(() => POETRY_FORMS[this.selectedForm()]);
  readonly currentPattern = computed(() => this.currentForm()?.pattern || []);
  readonly expectedLines = computed(() => this.currentForm()?.lines || 3);

  readonly lines = computed(() =>
    this.poemText()
      .split('\n')
      .slice(0, this.expectedLines())
      .filter((line) => line.trim().length > 0)
  );

  setSelectedForm(formId: string): void {
    this.state.update((state) => ({
      ...state,
      selectedForm: formId,
    }));

    const currentText = this.state().poemText.trim();
    if (!currentText) {
      this.loadExample();
    }
  }

  setPoemText(text: string): void {
    this.state.update((state) => ({ ...state, poemText: text }));
  }

  setIsAnalyzing(analyzing: boolean): void {
    this.state.update((state) => ({ ...state, isAnalyzing: analyzing }));
  }

  setHasResults(hasResults: boolean): void {
    this.state.update((state) => ({ ...state, hasResults }));
  }

  loadExample(): void {
    const formId = this.selectedForm();
    const example = POETRY_EXAMPLES[formId];
    if (example) {
      this.setPoemText(example.join('\n'));
    }
  }

  clear(): void {
    this.setPoemText('');
    this.setHasResults(false);
  }

  updatePoemLines(lines: string[]): void {
    const text = lines.join('\n');
    this.setPoemText(text);
  }
}
