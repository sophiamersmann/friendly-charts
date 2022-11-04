import * as utils from './utils';

import type { SymbolType } from './symbol';

export interface FriendlyGroup {
	element: 'group';
	id: string;
	type?: SymbolType;
	label: string;
	highlight?: string;
	parentId: string;
	position: number;
}

export interface Options {
	id?: FriendlyGroup['id'];
	type?: FriendlyGroup['type'];
	highlight?: FriendlyGroup['highlight'];
	label: FriendlyGroup['label'];
	position: FriendlyGroup['position'];
}

export default function group(
	node: HTMLElement | SVGElement,
	options: Options | undefined
) {
	if (options === undefined) return;

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

	// get label
	let { label } = options;
	if (utils.isSelector(label)) {
		const element = utils.querySelector(node, label);
		label = element?.textContent || '';
	}

	let data: Record<string, any> = {
		element: 'group',
		id: id as string,
		label,
		position: options.position,
	};

	if (options.type) {
		data.type = options.type;
	}

	if (options.highlight) {
		data.highlight = options.highlight;
	}

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
