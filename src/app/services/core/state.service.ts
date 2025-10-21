import { Injectable, signal, computed } from '@angular/core';
import { POETRY_FORMS, POETRY_EXAMPLES } from '../../data/poetry-forms.data';

export interface AppState {
  selectedForm: string;
  poemText: string;
  isAnalyzing: boolean;
  hasResults: boolean;
  shouldLoadExample: boolean;
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
    shouldLoadExample: false,
  });

  private isUpdatingFromInternal = false;

  readonly selectedForm = computed(() => this.state().selectedForm);
  readonly poemText = computed(() => this.state().poemText);
  readonly isAnalyzing = computed(() => this.state().isAnalyzing);
  readonly hasResults = computed(() => this.state().hasResults);
  readonly shouldLoadExample = computed(() => this.state().shouldLoadExample);
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
    // Prevenir llamadas duplicadas
    if (this.isUpdatingFromInternal || this.state().selectedForm === formId) {
      console.log('🔵 StateService.setSelectedForm - SKIPPED (duplicate or updating):', formId);
      return;
    }

    this.isUpdatingFromInternal = true;
    console.log('🔵 StateService.setSelectedForm:', formId);

    const currentText = this.state().poemText.trim();

    this.state.update((state) => ({
      ...state,
      selectedForm: formId,
      shouldLoadExample: currentText.length === 0,
    }));

    console.log('🔵 State updated:', this.state());

    setTimeout(() => {
      this.isUpdatingFromInternal = false;
    }, 100);
  }

  setPoemText(text: string): void {
    this.isUpdatingFromInternal = true;
    this.state.update((state) => ({
      ...state,
      poemText: text,
      shouldLoadExample: false,
    }));
    setTimeout(() => {
      this.isUpdatingFromInternal = false;
    }, 0);
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
      this.state.update((state) => ({ ...state, shouldLoadExample: false }));
    }
  }

  clear(): void {
    this.isUpdatingFromInternal = true;
    this.state.update((state) => ({
      ...state,
      poemText: '',
      hasResults: false,
      shouldLoadExample: false,
    }));
    setTimeout(() => {
      this.isUpdatingFromInternal = false;
    }, 0);
  }

  updatePoemLines(lines: string[]): void {
    const text = lines.join('\n');
    this.setPoemText(text);
  }

  consumeLoadExample(): void {
    this.state.update((state) => ({ ...state, shouldLoadExample: false }));
  }
}
