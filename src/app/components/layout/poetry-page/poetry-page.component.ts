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
import { ButtonComponent, CardComponent } from '../../ui';
import { HeaderComponent, FooterComponent } from '../../layout';
import { PoetryAnalyzerService, ToastService } from '../../../services';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [
    CommonModule,
    // Metro
    PanoramaComponent,
    PivotComponent,
    AppBarComponent,
    ProgressComponent,
    ToastContainerComponent,
    // Poetry
    PoemEditorComponent,
    PoemResultsComponent,
    PoemQualityComponent,
    WordSuggestionsComponent,
    QuickStatsPanelComponent,
    MeterAnalysisSectionComponent,
    // UI
    ButtonComponent,
    CardComponent,
    // Layout
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);
  private readonly toastService = inject(ToastService);

  // Analysis Tabs (usando Pivot)
  readonly analysisTabs = signal<PivotItem[]>([
    { id: 'structure', label: 'structure' },
    { id: 'rhythm', label: 'rhythm' },
    { id: 'quality', label: 'quality' },
    { id: 'stats', label: 'stats' },
  ]);
  readonly selectedAnalysisTab = signal('structure');

  // AppBar Actions (solo mobile)
  readonly appBarActions: AppBarAction[] = [
    { id: 'analyze', icon: 'icon-[iconoir--search]', label: 'analyze' },
    { id: 'example', icon: 'icon-[iconoir--page]', label: 'example' },
    { id: 'clear', icon: 'icon-[iconoir--cancel]', label: 'clear' },
  ];

  // Computed
  readonly hasResults = computed(() => this.analyzer.result() !== null);
  readonly isAnalyzing = computed(() => this.analyzer.isLoading());

  // Handlers
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

  onAssessQuality(): void {
    this.analyzer.assessQuality();
    this.selectedAnalysisTab.set('quality');
    this.toastService.info('Quality Assessment', 'Analyzing poem quality...');
  }

  onShowMeterAnalysis(): void {
    this.selectedAnalysisTab.set('rhythm');
    this.toastService.info('Rhythm Analysis', 'Showing meter analysis...');
  }

  onAppBarAction(actionId: string): void {
    switch (actionId) {
      case 'analyze':
        // Trigger analysis from current text
        this.toastService.info('Analyzing', 'Processing your poem...');
        break;
      case 'example':
        this.analyzer.loadExample();
        this.toastService.success('Example Loaded', 'Sample poem loaded');
        break;
      case 'clear':
        this.analyzer.clear();
        this.toastService.info('Cleared', 'Editor cleared');
        break;
    }
  }

  getQuickStats() {
    const stats = this.analyzer.getQuickStats();
    return {
      ...stats,
      patternMatch: this.analyzer.isCompletePoem() ? 'Perfect' : 'Partial',
    };
  }
}
