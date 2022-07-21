import { CLASSNAME } from './const';
import * as utils from './utils';
import type { AxisOptions } from './types';

export default function axis(node: HTMLElement | SVGElement, options: AxisOptions) {
	node.classList.add(CLASSNAME.CHART_AXIS);

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
			ticks = Array.from(elements).map((element) => element.textContent);
		}
	}

	// set data on the dom element
	utils.setFriendlyData(node, {
		direction: options.direction,
		orientation: options.orientation,
		label,
		ticks
	});
}
