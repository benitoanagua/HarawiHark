import { Component, inject } from '@angular/core';
import { ToggleComponent } from '../metro/toggle/toggle.component';
import { ThemeService } from '../../services/core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ToggleComponent],

  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly currentTheme = this.themeService.currentTheme;

  onThemeChange(isDark: boolean): void {
    this.themeService.setTheme(isDark ? 'dark' : 'light');
  }
}
