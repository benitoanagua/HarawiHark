import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { PoemEditorComponent } from '../poem-editor/poem-editor.component';
import { PoemResultsComponent } from '../poem-results/poem-results.component';
import { WordSuggestionsComponent } from '../word-suggestions/word-suggestions.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { PoetryAnalyzerService } from '../../services/poetry-analyzer.service';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [
    HeaderComponent,
    PoemEditorComponent,
    PoemResultsComponent,
    WordSuggestionsComponent,
    EmptyStateComponent,
  ],
  templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);

  onWordSelected(word: string): void {
    this.analyzer.selectWord(word);
  }

  onReplaceWord(newWord: string): void {
    console.log('Replace word with:', newWord);
    this.analyzer.selectWord(null);
  }

  onCloseSuggestions(): void {
    this.analyzer.selectWord(null);
  }
}
