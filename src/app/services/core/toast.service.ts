// toast.service.ts
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(toast: Omit<Toast, 'id'>): void {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? 3000;

    this.toasts.update((toasts) => [...toasts, { ...toast, id }]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  success(title: string, message?: string, duration?: number): void {
    this.show({ title, message, type: 'success', duration });
  }

  error(title: string, message?: string, duration?: number): void {
    this.show({ title, message, type: 'error', duration });
  }

  info(title: string, message?: string, duration?: number): void {
    this.show({ title, message, type: 'info', duration });
  }

  warning(title: string, message?: string, duration?: number): void {
    this.show({ title, message, type: 'warning', duration });
  }
}
