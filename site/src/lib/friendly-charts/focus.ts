import * as utils from './utils';

export interface FriendlyFocus {
	element: 'focus';
}

export default function symbol(node: HTMLElement | SVGElement) {
	node.style.display = 'none';

	const data = {
		element: 'focus'
	};

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
