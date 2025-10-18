import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() selectedTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabId: string): void {
    if (this.selectedTab !== tabId) {
      this.selectedTab = tabId;
      this.tabChange.emit(tabId);
    }
  }
}
