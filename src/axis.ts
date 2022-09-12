import * as utils from './utils';

export interface FriendlyAxis {
	element: 'axis';
	label: string;
	direction?: 'x' | 'y';
	ticks?: (string | number)[];
}

interface Options {
	label: FriendlyAxis['label'];
	direction?: FriendlyAxis['direction'];
	ticks?: FriendlyAxis['ticks'] | string;
}

export default function axis(node: HTMLElement | SVGElement, options: Options) {
	// get label
	let { label } = options;
	if (label && utils.isSelector(label)) {
		const element = utils.querySelector(node, label);
		label = element?.textContent || '';
	}

	// get ticks
	let { ticks } = options;
	if (typeof ticks === 'string') {
		const elements = utils.querySelectorAll(node, ticks);
		if (elements) {
			ticks = Array.from(elements)
				.map((element) => element.textContent)
				.filter((s) => s) as string[];
		}
	}

	// set data on the dom element
	utils.setFriendlyData(node, {
		element: 'axis',
		direction: options.direction || '',
		label,
		ticks: ticks || [],
	});
}
