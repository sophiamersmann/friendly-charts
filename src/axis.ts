import * as utils from './utils';

export type AxisType = 'continuous' | 'categorical';
export type AxisDirection = 'x' | 'y';
type Tick = string | number;

interface Axis {
	element: 'axis';
	label: string;
	direction?: AxisDirection;
}

interface AxisWithTicks extends Axis {
	type: AxisType;
	ticks: Tick[];
}

export type FriendlyAxis = Axis | AxisWithTicks;

export interface Options {
	label: string;
	direction?: AxisDirection;
	type?: AxisType;
	ticks?: Tick[] | string;
}

export function isAxisWithTicks(axis: unknown): axis is AxisWithTicks {
	return (axis as any).ticks !== undefined;
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
	const hasTicks = isAxisWithTicks(options);
	let ticks: Tick[] = [];
	if (hasTicks) {
		ticks = options.ticks;
		if (typeof ticks === 'string') {
			const elements = utils.querySelectorAll(node, ticks);
			if (elements) {
				ticks = Array.from(elements)
					.map((element) => element.textContent)
					.filter((s) => s) as string[];
			}
		}
	}

	let data: Record<string, any> = {
		element: 'axis',
		label,
		ticks,
	};

	if (hasTicks) {
		data.type = options.type;
	}

	if (options.direction) {
		data.direction = options.direction;
	}

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
