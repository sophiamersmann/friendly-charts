import { tick } from 'svelte';

import { CLASSNAME } from './const';
import * as utils from './utils';

// TODO: add symbolId as option

export interface FriendlyGroup {
	id: string;
	label: string;
	parentId: string;
	position: number;
}

interface Options {
	id?: FriendlyGroup['id'];
	label: FriendlyGroup['label'];
	position: FriendlyGroup['position'];
}

export default function group(node: HTMLElement | SVGElement, options: Options) {
	node.classList.add(CLASSNAME.CHART_GROUP);

	node.setAttribute('role', 'region');
	node.setAttribute('aria-hidden', 'false');
	node.tabIndex = -1;

	let { id } = options;

	if (!id) {
		id = ['friendly-group', utils.uniqueId()].join('-');
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The id of a group ("${node.id}") is overwritten with a generated id ("${id}").`,
			`If you want to keep "${node.id}", pass it to the use directive as use:friendly.group={{ id: '${node.id}', ... }}.`
		);
	}

	node.id = id;

	tick().then(() => {
		const parent = node.parentElement?.closest('.' + CLASSNAME.CHART_GROUP);

		const data: FriendlyGroup = {
			...options,
			id: id as string,
			parentId: parent?.id || ''
		};

		// set data on the dom element
		utils.setFriendlyData(node, data);
	});
}
