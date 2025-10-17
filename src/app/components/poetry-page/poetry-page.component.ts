import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { PoemEditorComponent } from '../poem-editor/poem-editor.component';
import { PoemResultsComponent } from '../poem-results/poem-results.component';
import { PoemQualityComponent } from '../poem-quality/poem-quality.component';
import { PoetryAnalyzerService } from '../../services/poetry-analyzer.service';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    HeaderComponent,
    PoemEditorComponent,
    PoemResultsComponent,
    PoemQualityComponent,
  ],
  templateUrl: './poetry-page.component.html',
})
// Actualizaciones a src/app/components/poetry-page/poetry-page.component.ts
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);

  // Nuevas funcionalidades
  readonly showQuality = signal(false);
  readonly showVariations = signal(false);

  onWordSelected(word: string): void {
    this.analyzer.selectWordEnhanced(word);
  }

  onReplaceWord(newWord: string): void {
    console.log('Replace word with:', newWord);
    // Aquí implementarías la lógica para reemplazar la palabra en el poema
    this.analyzer.selectWordEnhanced(null);
  }

  onCloseSuggestions(): void {
    this.analyzer.selectWordEnhanced(null);
  }

  onExportPoem(): void {
    console.log('Export poem functionality');
    // Implementar exportación aquí
  }

  // Nuevos métodos
  async onGeneratePoem(): Promise<void> {
    const currentForm = this.analyzer.selectedForm() || 'haiku';
    await this.analyzer.generatePoem(currentForm);
  }

  async onGenerateVariations(): Promise<void> {
    await this.analyzer.generateVariations();
    this.showVariations.set(true);
  }

  onUseVariation(lineIndex: number, variation: string): void {
    console.log('Use variation:', lineIndex, variation);
    // Implementar uso de variación aquí
  }

  onAssessQuality(): void {
    this.analyzer.assessQuality();
    this.showQuality.set(true);
  }

  onUseGeneratedPoem(): void {
    const generated = this.analyzer.generatedPoem();
    if (generated) {
      // Actualizar el texto del poema con el generado
      this.analyzer.poemText.set(generated.join('\n'));
      this.analyzer.generatedPoem.set(null);
    }
  }
}
