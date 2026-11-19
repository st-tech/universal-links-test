export function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number,
): (...args: Args) => void {
	let timer: number | null = null;
	return (...args) => {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = window.setTimeout(() => {
			fn(...args);
			timer = null;
		}, delay);
	};
}
