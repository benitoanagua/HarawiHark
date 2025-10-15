import { Component, Input, inject } from '@angular/core';
import { HeaderComponent, type User } from '../header/header.component';
import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './page.component.html',
})
export class PageComponent {
  private readonly appData = inject(AppDataService);

  @Input() user: User | null = null;

  protected readonly metroTiles = this.appData.metroTiles;
  protected readonly documentation = this.appData.documentation;

  doLogout(): void {
    this.user = null;
  }

  doLogin(): void {
    this.user = { name: 'Jane Doe' };
  }

  doCreateAccount(): void {
    this.user = { name: 'Jane Doe' };
  }
}
