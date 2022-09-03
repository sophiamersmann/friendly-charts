import * as utils from './utils';

import type { SymbolType } from './symbol';

export interface FriendlyGroup {
	element: 'group';
	id: string;
	type?: SymbolType;
	label: string;
	parentId: string;
	position: number;
}

interface Options {
	id?: FriendlyGroup['id'];
	type?: FriendlyGroup['type'];
	label: FriendlyGroup['label'];
	position: FriendlyGroup['position'];
}

export default function group(node: HTMLElement | SVGElement, options: Options) {
	let { id } = options;

	if (!id) {
		id = utils.concat('friendly-group', utils.uniqueId());
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The group's id \`${node.id}\` is overwritten with \`${id}\`.`,
			`If you want to keep \`${node.id}\`, pass it to the group as \`id\`.`
		);
	}

	node.id = id;

	const data = {
		...options,
		element: 'group',
		id: id as string
	};

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
