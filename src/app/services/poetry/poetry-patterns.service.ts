import { Injectable } from '@angular/core';
import { POETRY_FORMS } from '../../data/poetry-forms.data';

@Injectable({
  providedIn: 'root',
})
export class PoetryPatternsService {
  private readonly forms = POETRY_FORMS;

  getFormPattern(formId: string): number[] {
    return this.forms[formId]?.pattern || [];
  }

  getFormInfo(formId: string) {
    return this.forms[formId];
  }

  getAllForms() {
    return Object.values(this.forms);
  }

  validateFormCompatibility(lines: string[], formId: string): boolean {
    const pattern = this.getFormPattern(formId);
    return lines.length === pattern.length;
  }

  detectPossibleForms(lines: string[]): string[] {
    const possibleForms: string[] = [];
    const lineCount = lines.length;

    Object.entries(this.forms).forEach(([formId, form]) => {
      if (form.lines === lineCount) {
        possibleForms.push(formId);
      }
    });

    return possibleForms;
  }

  getFormOptions() {
    return Object.values(this.forms).map((form) => ({
      value: form.id,
      label: form.name,
      description: form.pattern.join('-'),
    }));
  }
}
