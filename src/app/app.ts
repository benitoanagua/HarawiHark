import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Metro UI App');

  // Datos de ejemplo para tiles
  protected readonly tiles = signal([
    { title: 'Calendar', icon: 'iconoir--calendar', color: 'bg-primary', link: '#' },
    { title: 'Mail', icon: 'iconoir--mail', color: 'bg-error', link: '#' },
    { title: 'Photos', icon: 'iconoir--camera', color: 'bg-primary-container', link: '#' },
    { title: 'Store', icon: 'iconoir--shop', color: 'bg-surface-variant', link: '#' },
  ]);
}
