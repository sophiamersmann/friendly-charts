import { tick } from 'svelte';

import * as utils from './utils';
import { CLASSNAME } from './const';
import FriendlyNode, { map } from './friendly-node';

import type { FriendlySymbol } from './symbol';

function createTree(friendlySymbols: FriendlySymbol[]) {
	// create root element with a unique id
	const rootId = ['root', utils.uniqueId()].join('-');
	const root = new FriendlyNode({
		id: rootId,
		type: 'root',
		label: '',
		parentId: '',
		position: 0
	});
	root.descendants.set(root.data.id, root);

	const unprocessedNodesInTree = [root];
	const remainingNodes = friendlySymbols.map((e) => new FriendlyNode(e));

	while (unprocessedNodesInTree.length > 0 && remainingNodes.length > 0) {
		const currFriendlyNode = unprocessedNodesInTree[0];

		// collect children of the current node
		const children = remainingNodes.filter(
			(node) =>
				node.data.parentId === currFriendlyNode.data.id ||
				(!node.data.parentId && currFriendlyNode.data.id === rootId)
		);
		children.sort((a, b) => a.data.position - b.data.position);

		for (let i = 0; i < children.length; i++) {
			const leftIndex = i - 1 >= 0 ? i - 1 : children.length - 1;
			const rightIndex = i + 1 < children.length ? i + 1 : 0;

			const node = children[i];
			node.parent = currFriendlyNode;
			node.left = children[leftIndex];
			node.right = children[rightIndex];

			root.descendants.set(node.data.id, node);

			currFriendlyNode.children.push(node);
			unprocessedNodesInTree.push(node);

			const index = remainingNodes.indexOf(node);
			if (index > -1) {
				remainingNodes.splice(index, 1);
			}
		}

		const index = unprocessedNodesInTree.indexOf(currFriendlyNode);
		if (index > -1) {
			unprocessedNodesInTree.splice(index, 1);
		}
	}

	map(root, (node) => {
		if (!node.parent) return;

		const position = node.data.position;
		if (node.parent.right) {
			node.up = node.parent.right.findChild(position);
		}
		if (node.parent.left) {
			node.down = node.parent.left.findChild(position);
		}
	});

	return root;
}

export default function visual(node: HTMLElement | SVGElement) {
	node.setAttribute('role', 'presentation');

	// TODO: does this make sense?
	tick().then(() => {
		utils.traverse(node, (child) => {
			child.setAttribute('role', 'presentation');
			child.setAttribute('aria-hidden', 'true');
		});
	});

	// get chart elements from DOM
	const elements = node.querySelectorAll('.' + CLASSNAME.CHART_SYMBOL);
	const friendlySymbols = Array.from(elements).map(utils.friendlyData) as FriendlySymbol[];

	if (friendlySymbols.length === 0) return;

	// define relationship between chart elements
	const root = createTree(friendlySymbols);

	// assign meaningful labels
	map(root, (node) => {
		if (node.children.length > 0) {
			const { type } = node.children[0].data;
			node.label = utils.handlebars(
				'Group{{ SPACE }}{{ LABEL }}. Contains {{ N_ELEMENTS }} interactive {{ TYPE }}s.',
				{
					SPACE: node.data.label ? ' ' : '',
					LABEL: node.data.label,
					TYPE: type,
					N_ELEMENTS: root.children.length
				}
			);
		} else {
			const parent = node.parent as FriendlyNode;
			node.label = utils.handlebars('{{ LABEL }}. {{ TYPE }} {{ POS }} of {{ SIZE }}.', {
				LABEL: node.data.label,
				TYPE: node.data.type,
				POS: parent.children.indexOf(node) + 1,
				SIZE: parent.children.length
			});
		}
	});
}
