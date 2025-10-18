// toast-container.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/core/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons = {
      info: 'icon-[iconoir--info-circle]',
      success: 'icon-[iconoir--check-circle]',
      warning: 'icon-[iconoir--warning-triangle]',
      error: 'icon-[iconoir--cancel]',
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  onClose(id: string): void {
    this.toastService.remove(id);
  }
}
