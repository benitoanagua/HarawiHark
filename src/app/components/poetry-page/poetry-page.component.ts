import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { PoemEditorComponent } from '../poem-editor/poem-editor.component';
import { PoemResultsComponent } from '../poem-results/poem-results.component';
import { PoemQualityComponent } from '../poem-quality/poem-quality.component';
import { WordSuggestionsComponent } from '../word-suggestions/word-suggestions.component';
import { QuickStatsPanelComponent } from '../quick-stats-panel/quick-stats-panel.component';
import { MeterAnalysisSectionComponent } from '../meter-analysis-section/meter-analysis-section.component';
import { TabsComponent, Tab } from '../tabs/tabs.component';
import { PoetryAnalyzerService } from '../../services/poetry';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
    PoemEditorComponent,
    PoemResultsComponent,
    PoemQualityComponent,
    WordSuggestionsComponent,
    QuickStatsPanelComponent,
    MeterAnalysisSectionComponent,
    TabsComponent,
  ],
  templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);

  readonly selectedAnalysisTab = signal('structure');
  readonly analysisTabs = signal<Tab[]>([
    { id: 'structure', label: 'structure', icon: 'icon-[iconoir--layout-left]' },
    { id: 'rhythm', label: 'rhythm', icon: 'icon-[iconoir--music-double]' },
    { id: 'quality', label: 'quality', icon: 'icon-[iconoir--star]' },
    { id: 'stats', label: 'stats', icon: 'icon-[iconoir--dashboard]' },
  ]);

  onAnalysisTabChange(tabId: string): void {
    this.selectedAnalysisTab.set(tabId);
  }

  onWordSelected(word: string): void {
    this.analyzer.selectWordEnhanced(word);
  }

  onReplaceWord(newWord: string): void {
    this.analyzer.replaceWord(this.analyzer.wordAlternatives()?.original || '', newWord);
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
      console.log('Poem copied to clipboard');
    } catch (error) {
      console.error('Failed to copy poem to clipboard:', error);
      this.fallbackCopyToClipboard(exportText);
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Poem copied to clipboard (fallback)');
    } catch (error) {
      console.error('Fallback copy failed:', error);
    }
    document.body.removeChild(textArea);
  }

  onAssessQuality(): void {
    this.analyzer.assessQuality();
    this.selectedAnalysisTab.set('quality');
  }

  onShowMeterAnalysis(): void {
    this.selectedAnalysisTab.set('rhythm');
  }

  getQuickStats() {
    const stats = this.analyzer.getQuickStats();
    return {
      ...stats,
      patternMatch: this.analyzer.isCompletePoem() ? 'Perfect' : 'Partial',
    };
  }
}
