import * as utils from './utils';

import type { FriendlySymbol } from './symbol';
import type { FriendlyGroup } from './group';
import type { FriendlyLocale } from './locale';

export default class FriendlyNode {
	parent: FriendlyNode | null;
	children: FriendlyNode[];
	descendants: Map<string, FriendlyNode>;
	left: FriendlyNode | null;
	right: FriendlyNode | null;
	up: FriendlyNode | null;
	down: FriendlyNode | null;
	data;
	label: string;

	constructor(
		data: Omit<FriendlySymbol | FriendlyGroup, 'element'> & {
			element?: FriendlySymbol['element'] | FriendlyGroup['element'] | 'root';
		}
	) {
		this.parent = null;
		this.children = [];
		this.descendants = new Map();
		this.left = null;
		this.right = null;
		this.up = null;
		this.down = null;
		this.data = data;
		this.label = '';
	}

	/** find a child at position closest to the given position */
	findChild(position: number) {
		const diff = this.children.map((node) =>
			Math.abs(position - node.data.position)
		);
		const minDiff = Math.min(...diff);
		const index = diff.indexOf(minDiff);
		return this.children[index];
	}

	get controlId() {
		return this.data.id + '__control';
	}

	static toId(controlId: string) {
		return controlId.replace('__control', '');
	}

	/** compute bounding box that encloses the DOM element */
	get boundingBox() {
		// the root's bounding box is computed from the root's children's boxes
		if (this.data.element === 'root') {
			if (this.children.length === 0) return null;

			const bbox = {
				top: Infinity,
				left: Infinity,
				bottom: -Infinity,
				right: -Infinity,
			};
			this.children.forEach((child) => {
				const element = document.getElementById(child.data.id);
				const childBox = element && utils.getBoundingClientRect(element);
				if (childBox) {
					if (childBox.top < bbox.top) bbox.top = childBox.top;
					if (childBox.left < bbox.left) bbox.left = childBox.left;
					if (childBox.bottom > bbox.bottom) bbox.bottom = childBox.bottom;
					if (childBox.right > bbox.right) bbox.right = childBox.right;
				}
			});

			return {
				top: bbox.top,
				left: bbox.left,
				width: bbox.right - bbox.left,
				height: bbox.bottom - bbox.top,
			};
		}

		const element = document.getElementById(this.data.id);
		const bbox = element && utils.getBoundingClientRect(element);
		if (!bbox) return null;
		return {
			top: bbox.top,
			left: bbox.left,
			width: bbox.width,
			height: bbox.height,
		};
	}

	get controlElement() {
		const element = document.createElement('div');
		element.id = this.controlId;
		element.tabIndex = -1;
		element.setAttribute('role', 'img');
		element.setAttribute('aria-label', this.label);
		element.textContent = this.label;

		const fig = document.createElement('figure');
		fig.setAttribute('role', 'figure');
		fig.appendChild(element);

		return fig;
	}
}

/** map a function to each node in a tree */
export function map(node: FriendlyNode, cb: (node: FriendlyNode) => void) {
	cb(node);
	node.children.forEach((n) => map(n, cb));
}

export function findAll(
	node: FriendlyNode,
	cond: (node: FriendlyNode) => boolean,
	result: FriendlyNode[] = []
) {
	if (cond(node)) result.push(node);
	for (let i = 0; i < node.children.length; i++) {
		findAll(node.children[i], cond, result);
	}
	return result;
}

export function findAllOnLevel(
	node: FriendlyNode,
	level: number,
	result: FriendlyNode[] = [],
	currLevel = 0
) {
	if (currLevel === level) result.push(node);
	for (let i = 0; i < node.children.length; i++) {
		findAllOnLevel(node.children[i], level, result, currLevel + 1);
	}
	return result;
}

export function findDepth(node: FriendlyNode, depth = 0): number {
	if (node.parent) return findDepth(node.parent, depth + 1);
	return depth;
}

export function getChartFeatures(tree: FriendlyNode): {
	nElements: number;
	type?: FriendlySymbol['type'];
} {
	const symbols = findAll(tree, (node) => node.data.type !== undefined);

	if (symbols.length === 0) return { nElements: 0 };

	// find top level symbols
	const depths = symbols.map((symbol) => findDepth(symbol));
	const minDepth = Math.min(...depths);
	const topLevelSymbols = symbols.filter((_, i) => depths[i] === minDepth);

	return { nElements: topLevelSymbols.length };
}

export function createTree(
	friendlyElements: (FriendlyGroup | FriendlySymbol)[],
	locale: FriendlyLocale
) {
	// create root element with a unique id
	const rootId = ['root', utils.uniqueId()].join('-');
	const root = new FriendlyNode({
		id: rootId,
		element: 'root',
		label: '',
		parentId: '',
		position: 0,
	});
	root.descendants.set(root.data.id, root);

	const unprocessedNodesInTree = [root];
	const remainingNodes = friendlyElements.map((e) => new FriendlyNode(e));

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

	function getMemberType(node: FriendlyNode) {
		if (node.children.length === 0) return;
		const child = node.children[0];
		if (child.data.element === 'group' && !child.data.type) return 'group';
		return child.data.type;
	}

	map(root, (node) => {
		if (node.data.element === 'group' && node.children.length === 0) {
			utils.warn(
				`The group labelled "${node.data.label}" is empty.`,
				'Either remove the group or add at least one symbol or group as child.'
			);
		}

		if (node.data.element === 'symbol' && node.children.length > 0) {
			utils.warn(
				`The symbol labelled "${node.data.label}" has children.`,
				'Use a group with a symbol type instead.'
			);
		}

		// add related nodes
		if (node.parent) {
			const position = node.data.position;
			if (node.parent.right) {
				node.up = node.parent.right.findChild(position);
			}
			if (node.parent.left) {
				node.down = node.parent.left.findChild(position);
			}
		}

		const parent = node.parent as FriendlyNode;
		if (node.data.element === 'root') {
			node.label = locale.root({
				nMembers: node.children.length,
				memberType: getMemberType(node),
			});
		} else if (node.data.element === 'group') {
			node.label = locale.group({
				label: node.data.label,
				position: parent.children.indexOf(node) + 1,
				nSiblings: parent.children.length,
				nMembers: node.children.length,
				memberType: getMemberType(node),
				symbolType: node.data.type,
				highlight: node.data.highlight,
			});
		} else if (node.data.element === 'symbol') {
			node.label = locale.symbol({
				label: node.data.label,
				type: node.data.type as FriendlySymbol['type'],
				position: parent.children.indexOf(node) + 1,
				nSiblings: parent.children.length,
				highlight: node.data.highlight,
			});
		}
	});

	return root;
}
