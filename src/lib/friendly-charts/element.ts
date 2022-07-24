import { CLASSNAME } from './const';
import * as utils from './utils';
import type { ElementOptions } from './types';

export default function element(node: HTMLElement | SVGElement, options: ElementOptions) {
	node.classList.add(CLASSNAME.CHART_ELEMENT);

	let { id } = options;

	if (!id) {
		id = ['friendly-element', options.type, options.level, options.position].join('-');
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The id of an element ("${node.id}") is overwritten with a generated id ("${id}").`,
			`If you want to keep "${node.id}", pass it to the use directive as use:element={{ id: '${node.id}', ... }}.`
		);
	}

	node.id = id;

	// set data on the dom element
	utils.setFriendlyData(node, options);
}
