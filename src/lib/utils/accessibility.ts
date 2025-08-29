export function announceToScreenReader(message: string) {
	if (typeof window === 'undefined') return;

	const announcement = document.createElement('div');
	announcement.setAttribute('aria-live', 'polite');
	announcement.setAttribute('aria-atomic', 'true');
	announcement.className = 'sr-only';
	announcement.textContent = message;

	document.body.appendChild(announcement);

	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

export function focusElement(selector: string, delay = 0) {
	if (typeof window === 'undefined') return;

	setTimeout(() => {
		const element = document.querySelector(selector) as HTMLElement;
		if (element && element.focus) {
			element.focus();
		}
	}, delay);
}
