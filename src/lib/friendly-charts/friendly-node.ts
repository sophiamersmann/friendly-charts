import type { FriendlyElement } from './element';

export default class FriendlyNode {
	parent: FriendlyNode | null;
	children: FriendlyNode[];
	descendants: Map<string, FriendlyNode>;
	left: FriendlyNode | null;
	right: FriendlyNode | null;
	up: FriendlyNode | null;
	down: FriendlyNode | null;
	data: FriendlyElement;

	constructor(data: FriendlyElement) {
		this.parent = null;
		this.children = [];
		this.descendants = new Map();
		this.left = null;
		this.right = null;
		this.up = null;
		this.down = null;
		this.data = data;
	}

	/** find a child at position closest to the given position */
	findChild(position: number) {
		const diff = this.children.map((node) => Math.abs(position - node.data.position));
		const minDiff = Math.min(...diff);
		const index = diff.indexOf(minDiff);
		return this.children[index];
	}

	/** compute bounding box that encloses the DOM element */
	get boundingBox() {
		// the root's bounding box is computed from the root's children's boxes
		if (this.data.type === 'root') {
			if (this.children.length === 0) return null;

			const bbox = { top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity };
			this.children.forEach((child) => {
				const element = document.getElementById(child.data.id);
				const childBox = element?.getBoundingClientRect();
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
				height: bbox.bottom - bbox.top
			};
		}

		const element = document.getElementById(this.data.id);
		const bbox = element?.getBoundingClientRect();
		if (!bbox) return null;
		return {
			top: bbox.top,
			left: bbox.left,
			width: bbox.width,
			height: bbox.height
		};
	}

	createControlElement() {
		const element = document.createElement('div');
		element.id = this.data.id;
		element.tabIndex = -1;
		element.setAttribute('role', 'img');
		element.setAttribute('aria-label', this.data.label);
		element.textContent = this.data.label;

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
