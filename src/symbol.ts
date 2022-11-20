import * as utils from './utils';

export type SymbolType = 'line' | 'point' | 'bar' | 'area';

export interface FriendlySymbol {
	element: 'symbol';
	id: string;
	type: SymbolType;
	label: string;
	parentId: string;
	position: number;
}

export type Options = {
	id?: FriendlySymbol['id'];
	type: FriendlySymbol['type'];
	label: FriendlySymbol['label'];
	parentId?: FriendlySymbol['parentId'];
};

export default function symbol(
	node: HTMLElement | SVGElement,
	options: Options | undefined
) {
	if (options === undefined) return;

	let { id } = options;

	// generate random id if not given
	if (!id) {
		id = utils.concat('friendly-symbol', utils.uniqueId());
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The symbol's id \`${node.id}\` is overwritten with \`${id}\`.`,
			`If you want to keep \`${node.id}\`, pass it to the symbol as \`id\`.`
		);
	}

	node.id = id;

	// get label
	let { label } = options;
	if (utils.isSelector(label)) {
		const element = utils.querySelector(node, label);
		label = element?.textContent || '';
	}

	let data: Record<string, any> = {
		element: 'symbol',
		id,
		type: options.type,
		label,
	};

	if (options.parentId) {
		data.parentId = options.parentId;
	}

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
