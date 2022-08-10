import { CLASSNAME } from './const';
import * as utils from './utils';

export interface FriendlySymbol {
	id: string;
	type: 'line' | 'point' | 'bar';
	label: string;
	parentId: string;
	position: number;
}

type Options = Omit<FriendlySymbol, 'id' | 'parentId'> & {
	id?: string;
	parentId?: string;
};

export default function symbol(node: HTMLElement | SVGElement, options: Options) {
	node.classList.add(CLASSNAME.CHART_ELEMENT);

	let { id } = options;

	if (!id) {
		id = ['friendly-symbol', utils.uniqueId()].join('-');
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The id of a symbol ("${node.id}") is overwritten with a generated id ("${id}").`,
			`If you want to keep "${node.id}", pass it to the use directive as use:friendly.symbol={{ id: '${node.id}', ... }}.`
		);
	}

	node.id = id;
	options.id = id;

	// set data on the dom element
	utils.setFriendlyData(node, options);
}