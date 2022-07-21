export default function hidden(node: HTMLElement | SVGElement) {
	node.setAttribute('aria-hidden', 'true');
}
