import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { PoemEditorComponent } from '../poem-editor/poem-editor.component';
import { PoemResultsComponent } from '../poem-results/poem-results.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { PoetryAnalyzerService } from '../../services/poetry-analyzer.service';

@Component({
  selector: 'app-poetry-page',
  standalone: true,
  imports: [HeaderComponent, PoemEditorComponent, PoemResultsComponent, EmptyStateComponent],
  templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
  readonly analyzer = inject(PoetryAnalyzerService);
}
