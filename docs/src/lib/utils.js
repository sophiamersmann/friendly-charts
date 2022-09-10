/** Constructs a translate(x,y) string for use with the `transform` CSS property */
export function translate(xy) {
	return `translate(${xy})`;
}

/** Appends 'px' to a given number */
export function px(n) {
	return `${n}px`;
}
