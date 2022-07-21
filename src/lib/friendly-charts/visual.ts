import { tick } from 'svelte';
import { traverse } from './utils';

export default function visual(node: HTMLElement | SVGElement) {
	node.setAttribute('role', 'presentation');

	tick().then(() => {
		// TODO: does this make sense?
		traverse(node, (child) => {
			child.setAttribute('role', 'presentation');
			child.setAttribute('aria-hidden', 'true');
		});

		// TODO: implement keyboard navigation
		// const axisList = node.querySelectorAll('.' + CLASSNAME.CHART_AXIS);
		// const elementList = node.querySelectorAll('.' + CLASSNAME.CHART_ELEMENT);
	});
}
