import { Component, signal, computed, inject, effect } from '@angular/core';
import { SelectComponent, ButtonComponent, CardComponent, MultilineInputComponent } from '../../ui';
import { POETRY_FORM_OPTIONS, POETRY_EXAMPLES } from '../../../data/poetry-forms.data';
import { PoetryAnalyzerService, PoetryPatternsService } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poem-editor',
  standalone: true,
  imports: [CommonModule, SelectComponent, ButtonComponent, CardComponent, MultilineInputComponent],
  templateUrl: './poem-editor.component.html',
})
export class PoemEditorComponent {
  private readonly analyzer = inject(PoetryAnalyzerService);
  private readonly patterns = inject(PoetryPatternsService);

  readonly Math = Math;
  readonly formOptions = POETRY_FORM_OPTIONS;
  readonly selectedForm = signal('haiku');
  readonly poemText = signal('');

  readonly currentForm = computed(() => this.patterns.getFormInfo(this.selectedForm()));

  // Pattern para el multiline input - número fijo de líneas
  readonly currentPattern = computed(() => {
    const form = this.currentForm();
    return form ? form.pattern : [];
  });

  // Número fijo de líneas según la forma poética
  readonly expectedLines = computed(() => {
    const form = this.currentForm();
    return form ? form.lines : 3;
  });

  // Stats en tiempo real
  readonly lines = computed(() =>
    this.poemText()
      .split('\n')
      .slice(0, this.expectedLines()) // Solo considerar las líneas esperadas
      .filter((line) => line.trim().length > 0)
  );

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

  // Estado para controlar la altura del editor
  readonly editorHeight = signal('100%');

  constructor() {
    // Efecto: Sincronizar cuando cambia la forma poética
    effect(() => {
      const formId = this.selectedForm();
      this.analyzer.selectedForm.set(formId);
      // Actualizar placeholder y contenido cuando cambia el formulario
      this.updateEditorForForm();
    });

    // Efecto: Sincronizar texto con analyzer
    effect(() => {
      const text = this.poemText();
      this.analyzer.poemText.set(text);
    });

    // Efecto: Ajustar altura cuando cambia el formulario
    effect(() => {
      const form = this.currentForm();
      this.adjustEditorHeight();
    });
  }

  onFormChange(formId: string): void {
    this.selectedForm.set(formId);
    // El efecto automáticamente actualizará el editor
  }

  private updateEditorForForm(): void {
    // Actualizar el placeholder y resetear el texto si está vacío
    const currentText = this.poemText();
    if (!currentText.trim()) {
      // Si el editor está vacío, cargar ejemplo automáticamente
      this.loadExample();
    }

    // Forzar recálculo de altura después del cambio
    setTimeout(() => {
      this.adjustEditorHeight();
    }, 100);
  }

  onTextChange(text: string): void {
    // Mantener solo el número esperado de líneas
    const lines = text.split('\n');
    const trimmedText = lines.slice(0, this.expectedLines()).join('\n');
    this.poemText.set(trimmedText);
  }

  loadExample(): void {
    const formId = this.selectedForm();
    const example = POETRY_EXAMPLES[formId];

    if (example) {
      this.poemText.set(example.join('\n'));
    } else {
      // Si no hay ejemplo, limpiar el editor
      this.poemText.set('');
    }
  }

  clear(): void {
    this.poemText.set('');
    this.analyzer.clear();
  }

  analyze(): void {
    const lines = this.lines();
    if (lines.length === 0) return;

    this.analyzer.analyze(this.selectedForm(), lines);
  }

  // Método para verificar si está listo para análisis
  isReadyForAnalysis(): boolean {
    return this.lineCount() > 0;
  }

  // Método para ajustar la altura del editor
  private adjustEditorHeight(): void {
    // Calcular altura basada en el número de líneas esperadas
    const lines = this.expectedLines();
    const baseHeight = 52; // altura base por línea
    const calculatedHeight = Math.max(240, lines * baseHeight); // altura mínima de 240px

    this.editorHeight.set(`${calculatedHeight}px`);
  }

  // Método para obtener la clase de tamaño de fuente responsiva
  getResponsiveFontClass(): string {
    return 'responsive-font';
  }

  // Método para obtener el placeholder actualizado
  getCurrentPlaceholder(): string {
    const form = this.currentForm();
    return form ? `Write your ${form.name} here...` : 'Write your poem here...';
  }
}
