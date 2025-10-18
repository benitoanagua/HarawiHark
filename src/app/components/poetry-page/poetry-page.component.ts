import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { PoemEditorComponent } from '../poem-editor/poem-editor.component';
import { PoemResultsComponent } from '../poem-results/poem-results.component';
import { PoemQualityComponent } from '../poem-quality/poem-quality.component';
import { WordSuggestionsComponent } from '../word-suggestions/word-suggestions.component';
import { PoetryAnalyzerService } from '../../services/poetry';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
    PoemEditorComponent,
    PoemResultsComponent,
    PoemQualityComponent,
    WordSuggestionsComponent,
  ],
  templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);

  readonly showQuality = signal(false);
  readonly showMeterAnalysis = signal(false);

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
      // Podríamos mostrar una notificación aquí
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
    this.showQuality.set(true);
  }

  onShowMeterAnalysis(): void {
    this.showMeterAnalysis.set(true);
  }

  getQuickStats() {
    return this.analyzer.getQuickStats();
  }
}
