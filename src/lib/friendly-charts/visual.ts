import { tick } from 'svelte';
import * as utils from './utils';
import { CLASSNAME } from './const';
import FriendlyNode, { map } from './friendly-node';

import type { FriendlyElement } from './element';

function createTree(friendlyElements: FriendlyElement[]) {
	const root = new FriendlyNode({
		id: 'root',
		type: 'root',
		label: 'To do',
		parentId: '',
		position: 0
	});

	const unprocessedNodesInTree = [root];
	const remainingNodes = friendlyElements.map((e) => new FriendlyNode(e));

	while (unprocessedNodesInTree.length > 0 && remainingNodes.length > 0) {
		const currFriendlyNode = unprocessedNodesInTree[0];

		// collect children of the current node
		const children = remainingNodes.filter(
			(node) =>
				node.data.parentId === currFriendlyNode.data.id ||
				(!node.data.parentId && currFriendlyNode.data.id === 'root')
		);
		children.sort((a, b) => a.data.position - b.data.position);

		for (let i = 0; i < children.length; i++) {
			const leftIndex = i - 1 >= 0 ? i - 1 : children.length - 1;
			const rightIndex = i + 1 < children.length ? i + 1 : 0;

			const node = children[i];
			node.parent = currFriendlyNode;
			node.left = children[leftIndex];
			node.right = children[rightIndex];

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
			node.top = node.parent.right.findChild(position);
		}
		if (node.parent.left) {
			node.bottom = node.parent.left.findChild(position);
		}
	});

	return root;
}

export default function visual(node: HTMLElement | SVGElement) {
	node.setAttribute('role', 'presentation');

	tick().then(() => {
		// TODO: does this make sense?
		utils.traverse(node, (child) => {
			child.setAttribute('role', 'presentation');
			child.setAttribute('aria-hidden', 'true');
		});

		const elements = node.querySelectorAll('.' + CLASSNAME.CHART_ELEMENT);
		const friendlyElements = Array.from(elements).map(utils.friendlyData) as FriendlyElement[];

		const root = createTree(friendlyElements);

		// TODO: implement keyboard navigation
	});
}
