import * as utils from './utils';

export type AxisType = 'continuous' | 'categorical';
export type AxisDirection = 'x' | 'y';
export type Tick = string | number;

export interface FriendlyAxis {
	element: 'axis';
	label: string;
	direction?: AxisDirection;
	type: AxisType;
	ticks: Tick[];
}

export interface Options {
	label: string;
	direction?: AxisDirection;
	type?: AxisType;
	ticks?: Tick[] | string;
}

export default function axis(
	node: HTMLElement | SVGElement,
	options: Options | undefined
) {
	if (options === undefined) return;

	// set default type if ticks are given
	if (options.ticks && !options.type) {
		options.type = 'continuous';
	}

	// get label
	let { label } = options;
	if (label && utils.isSelector(label)) {
		const element = utils.querySelector(node, label);
		label = element?.textContent || '';
	}

	// get ticks
	let ticks: Tick[] = [];
	if (options.ticks) {
		if (typeof options.ticks === 'string') {
			const elements = utils.querySelectorAll(node, options.ticks);
			if (elements) {
				ticks = Array.from(elements)
					.map((element) => element.textContent)
					.filter((s) => s) as string[];
			}
		} else {
			ticks = options.ticks;
		}
	}

	let data: Record<string, any> = {
		element: 'axis',
		label,
		ticks,
	};

	if (options.type) {
		data.type = options.type;
	}

	if (options.direction) {
		data.direction = options.direction;
	}

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
