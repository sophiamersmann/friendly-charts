/** Constructs a translate(x,y) string for use with the `transform` CSS property */
export function translate(xy: number[]) {
	return `translate(${xy})`;
}

/** Appends 'px' to a given number */
export function px(n: number) {
	return `${n}px`;
}
