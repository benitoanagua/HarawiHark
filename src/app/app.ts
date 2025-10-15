import { Component } from '@angular/core';
import { PageComponent } from './components/page/page.component';

@Component({
  selector: 'app-root',
  imports: [PageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
