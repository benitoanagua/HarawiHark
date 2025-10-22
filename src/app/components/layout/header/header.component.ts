import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
