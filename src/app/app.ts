import { Component } from '@angular/core';
import { PoetryPageComponent } from './components/poetry-page/poetry-page.component';

@Component({
  selector: 'app-root',
  imports: [PoetryPageComponent],
  template: '<app-poetry-page />',
})
export class App {}
