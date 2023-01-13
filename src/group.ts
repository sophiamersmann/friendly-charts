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

export interface Options {
	id?: FriendlyGroup['id'];
	type?: FriendlyGroup['type'];
	label: FriendlyGroup['label'];
}

export default function group(
	node: HTMLElement | SVGElement,
	options: Options | undefined
) {
	if (options === undefined) return;

	// make sure the visual element itself is never focused
	node.tabIndex = -1;

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
		id,
		label,
	};

	if (options.type) {
		data.type = options.type;
	}

	// set data on the dom element
	utils.setFriendlyData(node, data);
}
