import * as utils from './utils';

// TODO: position should be optional

type SymbolType = 'line' | 'point' | 'bar';

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
	position: FriendlySymbol['position'];
};

export default function symbol(node: HTMLElement | SVGElement, options: Options) {
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

	const data = {
		...options,
		element: 'symbol',
		id: id as string
	};

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
