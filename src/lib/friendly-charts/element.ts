import { CLASSNAME } from './const';
import * as utils from './utils';
import type { ElementOptions } from './types';

export default function element(node: HTMLElement | SVGElement, options: ElementOptions) {
	node.classList.add(CLASSNAME.CHART_ELEMENT);

	// set data on the dom element
	utils.setFriendlyData(node, options);
}
