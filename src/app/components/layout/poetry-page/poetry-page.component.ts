import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  PanoramaComponent,
  PivotComponent,
  type PivotItem,
  AppBarComponent,
  type AppBarAction,
  ProgressComponent,
  ToastContainerComponent,
} from '../../metro';
import {
  PoemEditorComponent,
  PoemResultsComponent,
  PoemQualityComponent,
  WordSuggestionsComponent,
  QuickStatsPanelComponent,
  MeterAnalysisSectionComponent,
} from '../../poetry';
import { CardComponent } from '../../ui';
import { HeaderComponent, FooterComponent } from '../../layout';
import { PoetryAnalyzerService, ToastService, StateService } from '../../../services';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [
    CommonModule,
    PanoramaComponent,
    PivotComponent,
    AppBarComponent,
    ProgressComponent,
    ToastContainerComponent,
    PoemEditorComponent,
    PoemResultsComponent,
    PoemQualityComponent,
    WordSuggestionsComponent,
    QuickStatsPanelComponent,
    MeterAnalysisSectionComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);
  private readonly toastService = inject(ToastService);
  private readonly stateService = inject(StateService);

  readonly loadingState = signal<'idle' | 'analyzing' | 'loading-example' | 'assessing'>('idle');
  readonly currentStage = signal<'syllables' | 'rhythm' | 'patterns' | null>(null);

  readonly currentSection = signal<'editor' | 'results'>('editor');
  readonly recentlyAnalyzed = signal(false);

  readonly analysisTabs = signal<PivotItem[]>([
    { id: 'structure', label: 'structure' },
    { id: 'rhythm', label: 'rhythm' },
    { id: 'quality', label: 'quality' },
    { id: 'stats', label: 'stats' },
  ]);
  readonly selectedAnalysisTab = signal('structure');

  readonly appBarActions = computed<AppBarAction[]>(() => [
    {
      id: 'analyze',
      icon: 'icon-[iconoir--search]',
      label: 'analyze',
      disabled: this.stateService.lines().length === 0 || this.stateService.isAnalyzing(),
    },
    {
      id: 'example',
      icon: 'icon-[iconoir--page]',
      label: 'example',
      disabled: this.stateService.isAnalyzing(),
    },
    {
      id: 'clear',
      icon: 'icon-[iconoir--cancel]',
      label: 'clear',
      disabled: this.stateService.poemText().length === 0 || this.stateService.isAnalyzing(),
    },
    {
      id: 'copy',
      icon: 'icon-[iconoir--copy]',
      label: 'copy',
      disabled: this.stateService.poemText().length === 0 || this.stateService.isAnalyzing(),
    },
  ]);

  readonly hasResults = computed(() => this.analyzer.result() !== null);
  readonly isAnalyzing = computed(() => this.loadingState() !== 'idle');

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupScrollDetection();
    }
  }

  private setupScrollDetection(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section') as 'editor' | 'results';
            if (section) {
              this.currentSection.set(section);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    }, 100);
  }

  private navigateToSection(sectionId: 'editor' | 'results'): void {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  private navigateWithHighlight(sectionId: 'editor' | 'results'): void {
    this.recentlyAnalyzed.set(true);
    setTimeout(() => {
      this.navigateToSection(sectionId);
      setTimeout(() => this.recentlyAnalyzed.set(false), 2000);
    }, 100);
  }

  private confirmClear(): boolean {
    if (typeof window === 'undefined') return false;
    return window.confirm('Clear all content? This cannot be undone.');
  }

  private async analyzeWithStages(formId: string, lines: string[]): Promise<void> {
    this.loadingState.set('analyzing');
    this.stateService.setIsAnalyzing(true);

    await this.analyzer.analyze(formId, lines);

    this.currentStage.set(null);
    this.loadingState.set('idle');
    this.stateService.setIsAnalyzing(false);
    this.stateService.setHasResults(true);
    this.toastService.success('Analysis Complete', 'Check results below');
    this.navigateWithHighlight('results');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onAppBarAction(actionId: string): void {
    switch (actionId) {
      case 'analyze':
        this.handleAnalyze();
        break;

      case 'example':
        this.handleLoadExample();
        break;

      case 'clear':
        this.handleClear();
        break;

      case 'copy':
        this.handleCopy();
        break;
    }
  }

  private handleAnalyze(): void {
    const lines = this.stateService.lines();

    if (lines.length === 0) {
      this.toastService.warning('Empty Poem', 'Write something first');
      this.navigateToSection('editor');
      return;
    }

    const formId = this.stateService.selectedForm();
    this.analyzeWithStages(formId, lines);
  }

  private handleLoadExample(): void {
    this.loadingState.set('loading-example');
    const formId = this.stateService.selectedForm();

    this.stateService.loadExample();

    setTimeout(() => {
      const lines = this.stateService.lines();
      if (lines.length > 0) {
        this.analyzeWithStages(formId, lines);
      }
      this.loadingState.set('idle');
    }, 300);

    this.toastService.success('Example Loaded', 'Analyzing automatically...');
  }

  private handleClear(): void {
    const hasContent = this.stateService.poemText().length > 0 || this.hasResults();

    if (hasContent) {
      if (this.confirmClear()) {
        this.stateService.clear();
        this.analyzer.clear();
        this.loadingState.set('idle');
        this.currentStage.set(null);
        this.stateService.setIsAnalyzing(false);
        this.toastService.info('Cleared', 'Editor and results cleared');
        this.navigateToSection('editor');
      }
    } else {
      this.toastService.info('Already Empty', 'Nothing to clear');
    }
  }

  private async handleCopy(): Promise<void> {
    const text = this.stateService.poemText().trim();

    if (!text) {
      this.toastService.warning('Empty Poem', 'Nothing to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      const lineCount = this.stateService.lines().length;
      const syllableCount = this.analyzer.getQuickStats().totalSyllables;

      this.toastService.success('Poem Copied!', `${lineCount} lines, ${syllableCount} syllables`);
    } catch (err) {
      console.error('Failed to copy poem: ', err);
      this.toastService.error('Copy Failed', 'Could not copy to clipboard');
    }
  }

  onAnalyze(): void {
    this.handleAnalyze();
  }

  onAnalysisTabChange(tabId: string): void {
    this.selectedAnalysisTab.set(tabId);
  }

  onWordSelected(word: string): void {
    this.analyzer.selectWordEnhanced(word);
  }

  onReplaceWord(newWord: string): void {
    const original = this.analyzer.wordAlternatives()?.original || '';
    this.analyzer.replaceWord(original, newWord);
    this.toastService.success('Word Replaced', `"${original}" → "${newWord}"`);
  }

  onCloseSuggestions(): void {
    this.analyzer.selectWordEnhanced(null);
  }

  async onExportPoem(): Promise<void> {
    const result = this.analyzer.result();
    if (!result) return;

    const poemText = result.lines.map((line) => line.text).join('\n');
    const formInfo = this.analyzer.selectedForm();
    const exportText = `${formInfo.toUpperCase()} POEM\n\n${poemText}\n\n— Created with HarawiHark`;

    try {
      await navigator.clipboard.writeText(exportText);
      this.toastService.success('Exported', 'Poem copied to clipboard');
    } catch {
      this.toastService.error('Export Failed', 'Could not copy to clipboard');
    }
  }

  loadFormExample(formId: string): void {
    this.stateService.setSelectedForm(formId);
    this.handleLoadExample();
  }

  getQuickStats() {
    const stats = this.analyzer.getQuickStats();
    return {
      ...stats,
      patternMatch: this.analyzer.isCompletePoem() ? 'Perfect' : 'Partial',
    };
  }

  getFormPattern(formId: string): string {
    const patterns: Record<string, string> = {
      haiku: '5-7-5',
      tanka: '5-7-5-7-7',
      cinquain: '2-4-6-8-2',
      limerick: '8-8-5-5-8',
      redondilla: '8-8-8-8',
      lanterne: '1-2-3-4-1',
      diamante: '1-2-3-4-3-2-1',
      fibonacci: '1-1-2-3-5-8',
    };
    return patterns[formId] || '';
  }

  onQuickNav(section: 'editor' | 'results'): void {
    this.navigateToSection(section);
  }

  get appBarActionsValue(): AppBarAction[] {
    return this.appBarActions();
  }
}
