import { Component } from '@angular/core';
import { PoetryPageComponent } from './components/layout/poetry-page/poetry-page.component';
import { ToastContainerComponent } from './components/metro/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PoetryPageComponent, ToastContainerComponent],
  template: `
    <app-toast-container />
    <app-poetry-page />
  `,
})
export class App {}
