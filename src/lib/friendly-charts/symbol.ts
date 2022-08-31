import * as utils from './utils';

export type SymbolType = 'line' | 'point' | 'bar';

export interface FriendlySymbol {
	element: 'symbol';
	id: string;
	type: SymbolType;
	label: string;
	parentId: string;
	position: number;
}

type Options = {
	id?: string;
	type: FriendlySymbol['type'];
	label: FriendlySymbol['label'];
	parentId?: FriendlySymbol['parentId'];
	position: FriendlySymbol['position'];
};

export default function symbol(node: HTMLElement | SVGElement, options: Options) {
	let { id, label } = options;

	// generate random id if not given
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

	if (utils.isSelector(label)) {
		const element = utils.querySelector(node, label);
		label = element?.textContent || '';
	}

	const data = {
		...options,
		element: 'symbol',
		id: id as string,
		label
	};

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
