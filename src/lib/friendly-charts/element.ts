import { CLASSNAME } from './const';
import * as utils from './utils';

export interface FriendlyElement {
	id: string;
	type: string;
	label: string;
	parentId: string;
	position: number;
}

type Options = Omit<FriendlyElement, 'id' | 'parentId'> & {
	id?: string;
	parentId?: string;
};

export default function element(node: HTMLElement | SVGElement, options: Options) {
	node.classList.add(CLASSNAME.CHART_ELEMENT);

	let { id } = options;

	if (!id) {
		id = ['friendly-element', utils.uniqueId()].join('-');
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The id of an element ("${node.id}") is overwritten with a generated id ("${id}").`,
			`If you want to keep "${node.id}", pass it to the use directive as use:element={{ id: '${node.id}', ... }}.`
		);
	}

	node.id = id;
	options.id = id;

	// set data on the dom element
	utils.setFriendlyData(node, options);
}
