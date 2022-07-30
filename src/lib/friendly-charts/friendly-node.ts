import type { FriendlyElement } from './element';

export default class FriendlyNode {
	parent: FriendlyNode | null;
	children: FriendlyNode[];
	left: FriendlyNode | null;
	right: FriendlyNode | null;
	top: FriendlyNode | null;
	bottom: FriendlyNode | null;
	data: FriendlyElement;

	constructor(data: FriendlyElement) {
		this.parent = null;
		this.children = [];
		this.left = null;
		this.right = null;
		this.top = null;
		this.bottom = null;
		this.data = data;
	}

	findChild(position: number) {
		const diff = this.children.map((node) => Math.abs(position - node.data.position));
		const minDiff = Math.min(...diff);
		const index = diff.indexOf(minDiff);
		return this.children[index];
	}
}

export function map(node: FriendlyNode, cb: (node: FriendlyNode) => void) {
	cb(node);
	node.children.forEach((n) => map(n, cb));
}
